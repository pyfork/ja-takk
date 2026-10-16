// veridle-api: the sign-in endpoint for veridle.com.
// It is deliberately a dead end for now: every sign-in is rejected as invalid
// credentials, so no one can get in. Abuse protection sits in front of that.
package main

import (
	"context"
	"encoding/json"
	"log"
	"mime"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

const maxBody = 4 << 10 // 4 KB is generous for two short fields

type server struct {
	lim *limiter
}

func (s *server) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/signin", s.signin)
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		_, _ = w.Write([]byte("ok\n"))
	})
	return mux
}

func (s *server) signin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", "POST")
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// nginx sets X-Real-IP from the Cloudflare-restored client address; this
	// process only listens on loopback so the header cannot come from outside.
	ip := r.Header.Get("X-Real-IP")
	if ip == "" {
		ip = r.RemoteAddr
	}
	ok, retry := s.lim.allow(clientKey(ip))
	form := isForm(r)
	if !ok {
		// Refused before the body is read: nothing is processed while locked.
		secs := int(retry.Seconds()) + 1
		w.Header().Set("Retry-After", strconv.Itoa(secs))
		if form {
			redirect(w, r, "#locked")
			return
		}
		writeJSON(w, http.StatusTooManyRequests, map[string]string{
			"error": "too_many_attempts",
		})
		return
	}

	// Read and discard the submission (bounded). Nothing is stored or logged:
	// a mistyped username is often a password.
	r.Body = http.MaxBytesReader(w, r.Body, maxBody)
	if form {
		_ = r.ParseForm()
	} else {
		var in struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		_ = json.NewDecoder(r.Body).Decode(&in)
	}

	if form {
		redirect(w, r, "#error")
		return
	}
	writeJSON(w, http.StatusUnauthorized, map[string]string{
		"error": "invalid_credentials",
	})
}

func isForm(r *http.Request) bool {
	mt, _, _ := mime.ParseMediaType(r.Header.Get("Content-Type"))
	return mt == "application/x-www-form-urlencoded"
}

// redirect sends a no-JS form post back to its sign-in page, where :target
// shows the message. The page is chosen from an allow-list, never from input.
func redirect(w http.ResponseWriter, r *http.Request, frag string) {
	page := "/signin"
	if r.FormValue("l") == "ms" {
		page = "/ms/log-masuk"
	}
	http.Redirect(w, r, page+frag, http.StatusSeeOther)
}

func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func main() {
	addr := os.Getenv("LISTEN_ADDR")
	if addr == "" {
		addr = "127.0.0.1:8793"
	}
	s := &server{lim: newLimiter(time.Now)}

	go func() {
		for range time.Tick(10 * time.Minute) {
			s.lim.sweep()
		}
	}()

	srv := &http.Server{
		Addr:              addr,
		Handler:           s.routes(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    8 << 10,
	}

	done := make(chan os.Signal, 1)
	signal.Notify(done, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-done
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = srv.Shutdown(ctx)
	}()

	log.Printf("veridle-api listening on %s", addr)
	if err := srv.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
