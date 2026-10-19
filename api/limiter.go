package main

import (
	"net"
	"strings"
	"sync"
	"time"
)

// limiter allows `max` sign-in attempts per client, then refuses to process
// anything from that client for `lockFor`. Attempts made while locked are not
// processed and do not extend the lock. A global ceiling and a hard cap on the
// number of tracked clients protect the host from floods that spread
// across many addresses.
type limiter struct {
	mu        sync.Mutex
	now       func() time.Time
	max       int
	lockFor   time.Duration
	window    time.Duration
	clients   map[string]*client
	maxClient int

	globalMax    int
	globalWindow time.Duration
	globalStart  time.Time
	globalCount  int
}

type client struct {
	attempts    int
	firstSeen   time.Time
	lockedUntil time.Time
}

func newLimiter(now func() time.Time) *limiter {
	return &limiter{
		now:          now,
		max:          5,
		lockFor:      60 * time.Minute,
		window:       60 * time.Minute,
		clients:      make(map[string]*client),
		maxClient:    20000,
		globalMax:    120,
		globalWindow: time.Minute,
	}
}

// allow reports whether the attempt may be processed. When it may not, retry is
// how long the caller should wait.
func (l *limiter) allow(key string) (ok bool, retry time.Duration) {
	l.mu.Lock()
	defer l.mu.Unlock()
	t := l.now()

	if t.Sub(l.globalStart) >= l.globalWindow {
		l.globalStart, l.globalCount = t, 0
	}
	if l.globalCount >= l.globalMax {
		return false, l.globalStart.Add(l.globalWindow).Sub(t)
	}

	c := l.clients[key]
	if c != nil && t.Before(c.lockedUntil) {
		return false, c.lockedUntil.Sub(t)
	}
	if c == nil || t.Sub(c.firstSeen) >= l.window {
		if c == nil && len(l.clients) >= l.maxClient {
			l.sweepLocked(t)
			if len(l.clients) >= l.maxClient {
				return false, l.lockFor
			}
		}
		c = &client{firstSeen: t}
		l.clients[key] = c
	}

	l.globalCount++
	c.attempts++
	if c.attempts >= l.max {
		c.lockedUntil = t.Add(l.lockFor)
		c.attempts = 0
		c.firstSeen = c.lockedUntil
	}
	return true, 0
}

// sweep drops clients whose window and lock have both expired.
func (l *limiter) sweep() {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.sweepLocked(l.now())
}

func (l *limiter) sweepLocked(t time.Time) {
	for k, c := range l.clients {
		if !t.Before(c.lockedUntil) && t.Sub(c.firstSeen) >= l.window {
			delete(l.clients, k)
		}
	}
}

// clientKey normalises an address: IPv4 as-is, IPv6 collapsed to its /64 so a
// single host cannot rotate through its whole allocation.
func clientKey(addr string) string {
	addr = strings.TrimSpace(addr)
	if h, _, err := net.SplitHostPort(addr); err == nil {
		addr = h
	}
	ip := net.ParseIP(addr)
	if ip == nil {
		return "unknown"
	}
	if v4 := ip.To4(); v4 != nil {
		return v4.String()
	}
	return ip.Mask(net.CIDRMask(64, 128)).String() + "/64"
}
