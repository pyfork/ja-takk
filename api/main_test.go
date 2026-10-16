package main

import (
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
	"time"
)

type clock struct{ t time.Time }

func (c *clock) now() time.Time { return c.t }

func newTestServer() (*server, *clock) {
	c := &clock{t: time.Date(2026, 10, 13, 12, 0, 0, 0, time.UTC)}
	return &server{lim: newLimiter(c.now)}, c
}

func post(s *server, ip, ctype, body string) *httptest.ResponseRecorder {
	r := httptest.NewRequest(http.MethodPost, "/api/signin", strings.NewReader(body))
	r.Header.Set("Content-Type", ctype)
	r.Header.Set("X-Real-IP", ip)
	w := httptest.NewRecorder()
	s.routes().ServeHTTP(w, r)
	return w
}

const js = "application/json"

func TestEverySigninIsRejected(t *testing.T) {
	s, _ := newTestServer()
	for _, body := range []string{`{"username":"admin","password":"admin"}`, `{}`, `not json`, ``} {
		w := post(s, "1.1.1.1", js, body)
		if w.Code != http.StatusUnauthorized {
			t.Fatalf("body %q: got %d, want 401", body, w.Code)
		}
		if !strings.Contains(w.Body.String(), "invalid_credentials") {
			t.Fatalf("unexpected body %q", w.Body.String())
		}
		// fresh IP each time so the limiter never interferes
		s, _ = newTestServer()
	}
}

func TestLocksAfterFiveAttemptsForAnHour(t *testing.T) {
	s, c := newTestServer()
	for i := 1; i <= 5; i++ {
		if w := post(s, "2.2.2.2", js, `{}`); w.Code != 401 {
			t.Fatalf("attempt %d: got %d, want 401", i, w.Code)
		}
	}
	w := post(s, "2.2.2.2", js, `{}`)
	if w.Code != 429 || w.Header().Get("Retry-After") == "" {
		t.Fatalf("6th attempt: got %d retry=%q, want 429 with Retry-After", w.Code, w.Header().Get("Retry-After"))
	}
	c.t = c.t.Add(59 * time.Minute)
	if w := post(s, "2.2.2.2", js, `{}`); w.Code != 429 {
		t.Fatalf("at 59m: got %d, want still locked", w.Code)
	}
	// other clients are unaffected
	if w := post(s, "3.3.3.3", js, `{}`); w.Code != 401 {
		t.Fatalf("other ip: got %d, want 401", w.Code)
	}
	c.t = c.t.Add(2 * time.Minute)
	if w := post(s, "2.2.2.2", js, `{}`); w.Code != 401 {
		t.Fatalf("after 61m: got %d, want 401 again", w.Code)
	}
}

func TestLockedAttemptsDoNotExtendLock(t *testing.T) {
	s, c := newTestServer()
	for i := 0; i < 5; i++ {
		post(s, "4.4.4.4", js, `{}`)
	}
	c.t = c.t.Add(30 * time.Minute)
	post(s, "4.4.4.4", js, `{}`) // refused
	c.t = c.t.Add(31 * time.Minute)
	if w := post(s, "4.4.4.4", js, `{}`); w.Code != 401 {
		t.Fatalf("got %d, want lock to have expired 60m after the 5th attempt", w.Code)
	}
}

func TestGlobalCeiling(t *testing.T) {
	s, c := newTestServer()
	for i := 0; i < 120; i++ {
		ip := "10.0." + strconv.Itoa(i/250) + "." + strconv.Itoa(i%250+1)
		if w := post(s, ip, js, `{}`); w.Code != 401 {
			t.Fatalf("attempt %d: got %d", i, w.Code)
		}
	}
	if w := post(s, "9.9.9.9", js, `{}`); w.Code != 429 {
		t.Fatalf("over ceiling: got %d, want 429", w.Code)
	}
	c.t = c.t.Add(61 * time.Second)
	if w := post(s, "9.9.9.9", js, `{}`); w.Code != 401 {
		t.Fatalf("after window: got %d, want 401", w.Code)
	}
}

func TestIPv6CollapsesToSlash64(t *testing.T) {
	if clientKey("2001:db8:1:2:aaaa::1") != clientKey("2001:db8:1:2:bbbb::9") {
		t.Fatal("same /64 should share a key")
	}
	if clientKey("2001:db8:1:2::1") == clientKey("2001:db8:1:3::1") {
		t.Fatal("different /64 should not share a key")
	}
	if clientKey("garbage") != "unknown" {
		t.Fatal("garbage address should map to unknown")
	}
}

func TestFormPostRedirectsBackToPage(t *testing.T) {
	s, _ := newTestServer()
	form := "application/x-www-form-urlencoded"
	w := post(s, "5.5.5.5", form, "username=a&password=b&l=ms")
	if w.Code != 303 || w.Header().Get("Location") != "/ms/log-masuk#error" {
		t.Fatalf("got %d %q", w.Code, w.Header().Get("Location"))
	}
	w = post(s, "5.5.5.6", form, "username=a&password=b&l=//evil.example")
	if w.Header().Get("Location") != "/signin#error" {
		t.Fatalf("open redirect risk: %q", w.Header().Get("Location"))
	}
	for i := 0; i < 5; i++ {
		post(s, "5.5.5.7", form, "l=en")
	}
	w = post(s, "5.5.5.7", form, "l=en")
	if w.Code != 303 || w.Header().Get("Location") != "/signin#locked" {
		t.Fatalf("locked form: got %d %q", w.Code, w.Header().Get("Location"))
	}
}

func TestOnlyPostAllowed(t *testing.T) {
	s, _ := newTestServer()
	r := httptest.NewRequest(http.MethodGet, "/api/signin", nil)
	w := httptest.NewRecorder()
	s.routes().ServeHTTP(w, r)
	if w.Code != 405 {
		t.Fatalf("got %d, want 405", w.Code)
	}
}
