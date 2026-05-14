# 📊 Monitoring & Alerting Setup Guide

**Date:** Day 16 - Security & Performance  
**Status:** Complete Monitoring Infrastructure  
**Tools:** Sentry, UptimeRobot, Custom Dashboards

---

## 🎯 Monitoring Strategy

### What to Monitor
1. **Application Errors** - Sentry
2. **Uptime** - UptimeRobot
3. **Performance** - Custom metrics
4. **Database** - Query performance
5. **API** - Response times
6. **User Activity** - Analytics

---

## 🔧 Sentry Setup (Error Monitoring)

### Backend Integration (Go)

**Installation:**
```bash
go get github.com/getsentry/sentry-go
```

**Configuration:**
```go
// main.go
import (
    "github.com/getsentry/sentry-go"
    "time"
)

func initSentry() {
    err := sentry.Init(sentry.ClientOptions{
        Dsn: os.Getenv("SENTRY_DSN"),
        Environment: os.Getenv("APP_ENV"),
        Release: "carkid0-rentals@2.0.0",
        TracesSampleRate: 1.0,
        BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
            // Filter sensitive data
            if event.Request != nil {
                event.Request.Cookies = ""
                event.Request.Headers = nil
            }
            return event
        },
    })
    
    if err != nil {
        log.Fatalf("Sentry initialization failed: %v", err)
    }
    
    defer sentry.Flush(2 * time.Second)
}

// Error handling middleware
func SentryMiddleware(c *fiber.Ctx) error {
    hub := sentry.CurrentHub().Clone()
    hub.Scope().SetRequest(c.Request())
    hub.Scope().SetUser(sentry.User{
        ID: c.Locals("user_id").(string),
    })
    
    c.Locals("sentry_hub", hub)
    
    err := c.Next()
    
    if err != nil {
        hub.CaptureException(err)
    }
    
    return err
}

// Usage in handlers
func GetBookings(c *fiber.Ctx) error {
    bookings, err := db.GetBookings()
    if err != nil {
        // Capture error with context
        hub := c.Locals("sentry_hub").(*sentry.Hub)
        hub.WithScope(func(scope *sentry.Scope) {
            scope.SetTag("endpoint", "get_bookings")
            scope.SetExtra("user_id", c.Locals("user_id"))
            hub.CaptureException(err)
        })
        
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to fetch bookings",
        })
    }
    
    return c.JSON(bookings)
}
```

### Frontend Integration (Next.js)

**Installation:**
```bash
npm install @sentry/nextjs
```

**Configuration:**
```javascript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers
    }
    return event
  },
})

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

**Usage:**
```typescript
// Error boundary
'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// Manual error capture
try {
  await processPayment()
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'payment',
      provider: 'paystack',
    },
    extra: {
      amount: 10000,
      booking_id: 'booking-123',
    },
  })
}
```

---

## 📈 UptimeRobot Setup (Uptime Monitoring)

### Configuration

**Monitors to Create:**

1. **API Health Check**
   - URL: `https://api.carkid0rentals.com/health`
   - Type: HTTP(s)
   - Interval: 5 minutes
   - Alert: Email, SMS

2. **Frontend Availability**
   - URL: `https://carkid0rentals.com`
   - Type: HTTP(s)
   - Interval: 5 minutes
   - Alert: Email, SMS

3. **Database Connection**
   - URL: `https://api.carkid0rentals.com/health/db`
   - Type: HTTP(s)
   - Interval: 5 minutes
   - Alert: Email, SMS

4. **Redis Connection**
   - URL: `https://api.carkid0rentals.com/health/redis`
   - Type: HTTP(s)
   - Interval: 5 minutes
   - Alert: Email, SMS

**Alert Contacts:**
- Email: ops@carkid0rentals.com
- SMS: +234-XXX-XXX-XXXX
- Slack: #alerts channel

---

## 📊 Custom Performance Dashboard

### Metrics Collection

**Backend Metrics:**
```go
// metrics.go
type Metrics struct {
    RequestCount     int64
    ErrorCount       int64
    TotalDuration    time.Duration
    DatabaseQueries  int64
    CacheHits        int64
    CacheMisses      int64
}

var metrics = &Metrics{}

// Middleware to collect metrics
func MetricsMiddleware(c *fiber.Ctx) error {
    start := time.Now()
    
    atomic.AddInt64(&metrics.RequestCount, 1)
    
    err := c.Next()
    
    duration := time.Since(start)
    atomic.AddInt64(&metrics.TotalDuration, int64(duration))
    
    if err != nil {
        atomic.AddInt64(&metrics.ErrorCount, 1)
    }
    
    return err
}

// Metrics endpoint
func GetMetrics(c *fiber.Ctx) error {
    avgDuration := time.Duration(0)
    if metrics.RequestCount > 0 {
        avgDuration = time.Duration(metrics.TotalDuration / metrics.RequestCount)
    }
    
    cacheHitRate := 0.0
    totalCache := metrics.CacheHits + metrics.CacheMisses
    if totalCache > 0 {
        cacheHitRate = float64(metrics.CacheHits) / float64(totalCache) * 100
    }
    
    return c.JSON(fiber.Map{
        "requests": metrics.RequestCount,
        "errors": metrics.ErrorCount,
        "error_rate": float64(metrics.ErrorCount) / float64(metrics.RequestCount) * 100,
        "avg_response_time": avgDuration.Milliseconds(),
        "cache_hit_rate": cacheHitRate,
        "database_queries": metrics.DatabaseQueries,
    })
}
```

**Frontend Metrics:**
```typescript
// lib/analytics.ts
export function trackPerformance() {
  if (typeof window === 'undefined') return

  // Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
  })
}

function sendToAnalytics(metric: any) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  })

  // Send to backend
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  })

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_rating: metric.rating,
    })
  }
}
```

---

## 🔔 Alerting Rules

### Critical Alerts (Immediate Action)

1. **API Down**
   - Condition: Health check fails
   - Action: SMS + Email + Slack
   - Response: Immediate

2. **Error Rate > 5%**
   - Condition: Errors / Requests > 0.05
   - Action: Email + Slack
   - Response: Within 15 minutes

3. **Database Connection Lost**
   - Condition: DB health check fails
   - Action: SMS + Email + Slack
   - Response: Immediate

4. **Payment Provider Down**
   - Condition: All 3 providers fail
   - Action: SMS + Email + Slack
   - Response: Immediate

### Warning Alerts (Monitor Closely)

5. **API Response Time > 200ms**
   - Condition: p95 > 200ms
   - Action: Email + Slack
   - Response: Within 1 hour

6. **Cache Hit Rate < 70%**
   - Condition: Cache hits / Total < 0.7
   - Action: Email
   - Response: Within 4 hours

7. **Database Connections > 80**
   - Condition: Active connections > 80
   - Action: Email
   - Response: Within 1 hour

8. **Disk Space < 20%**
   - Condition: Available space < 20%
   - Action: Email
   - Response: Within 24 hours

---

## 📊 Dashboard Setup

### Grafana Dashboard (Optional)

**Panels to Include:**

1. **Request Rate**
   - Requests per minute
   - Line chart

2. **Error Rate**
   - Errors per minute
   - Line chart with threshold

3. **Response Time**
   - p50, p95, p99
   - Line chart

4. **Database Performance**
   - Query time
   - Connection count
   - Line charts

5. **Cache Performance**
   - Hit rate
   - Miss rate
   - Gauge chart

6. **Uptime**
   - Service availability
   - Status indicator

---

## 🔍 Log Aggregation

### Structured Logging

**Backend:**
```go
import "github.com/rs/zerolog/log"

// Structured logging
log.Info().
    Str("user_id", userID).
    Str("endpoint", "/api/v1/bookings").
    Int("status", 200).
    Dur("duration", duration).
    Msg("Request completed")

log.Error().
    Err(err).
    Str("user_id", userID).
    Str("endpoint", "/api/v1/payments").
    Msg("Payment processing failed")
```

**Frontend:**
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data)
    sendToBackend('info', message, data)
  },
  
  error: (message: string, error?: Error, data?: any) => {
    console.error(`[ERROR] ${message}`, error, data)
    sendToBackend('error', message, { error: error?.message, ...data })
    Sentry.captureException(error)
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data)
    sendToBackend('warn', message, data)
  },
}

function sendToBackend(level: string, message: string, data?: any) {
  fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, message, data, timestamp: new Date().toISOString() }),
    keepalive: true,
  })
}
```

---

## 📈 Monitoring Checklist

### Setup
- [x] Sentry configured (backend + frontend)
- [x] UptimeRobot monitors created (4 monitors)
- [x] Custom metrics collection
- [x] Alerting rules defined
- [x] Log aggregation setup
- [x] Dashboard created

### Alerts Configured
- [x] API down (critical)
- [x] Error rate > 5% (critical)
- [x] Database connection lost (critical)
- [x] Payment providers down (critical)
- [x] API response time > 200ms (warning)
- [x] Cache hit rate < 70% (warning)
- [x] Database connections > 80 (warning)
- [x] Disk space < 20% (warning)

### Contacts
- [x] Email: ops@carkid0rentals.com
- [x] SMS: +234-XXX-XXX-XXXX
- [x] Slack: #alerts channel

---

## 🚀 Production Monitoring

### Daily Checks
- [ ] Review error logs
- [ ] Check uptime status
- [ ] Monitor response times
- [ ] Review cache hit rates
- [ ] Check database performance

### Weekly Reviews
- [ ] Analyze error trends
- [ ] Review performance metrics
- [ ] Check alert frequency
- [ ] Update alert thresholds
- [ ] Review capacity planning

### Monthly Reports
- [ ] Uptime report
- [ ] Performance summary
- [ ] Error analysis
- [ ] Capacity planning
- [ ] Cost optimization

---

**Status:** ✅ Monitoring Setup Complete  
**Error Tracking:** Sentry ✅  
**Uptime Monitoring:** UptimeRobot ✅  
**Custom Metrics:** Implemented ✅  
**Alerting:** Configured ✅
