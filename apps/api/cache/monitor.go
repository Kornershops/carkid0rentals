package cache

import (
	"context"
	"fmt"
	"log"
	"sync/atomic"
	"time"
)

type Stats struct {
	Hits          atomic.Int64
	Misses        atomic.Int64
	Sets          atomic.Int64
	Deletes       atomic.Int64
	Errors        atomic.Int64
	TotalRequests atomic.Int64
}

type Monitor struct {
	cache *CacheManager
	stats *Stats
}

func NewMonitor(cache *CacheManager) *Monitor {
	return &Monitor{
		cache: cache,
		stats: &Stats{},
	}
}

func (m *Monitor) RecordHit() {
	m.stats.Hits.Add(1)
	m.stats.TotalRequests.Add(1)
}

func (m *Monitor) RecordMiss() {
	m.stats.Misses.Add(1)
	m.stats.TotalRequests.Add(1)
}

func (m *Monitor) RecordSet() {
	m.stats.Sets.Add(1)
}

func (m *Monitor) RecordDelete() {
	m.stats.Deletes.Add(1)
}

func (m *Monitor) RecordError() {
	m.stats.Errors.Add(1)
}

func (m *Monitor) GetStats() map[string]interface{} {
	hits := m.stats.Hits.Load()
	misses := m.stats.Misses.Load()
	total := m.stats.TotalRequests.Load()

	hitRate := 0.0
	if total > 0 {
		hitRate = float64(hits) / float64(total) * 100
	}

	return map[string]interface{}{
		"hits":          hits,
		"misses":        misses,
		"sets":          m.stats.Sets.Load(),
		"deletes":       m.stats.Deletes.Load(),
		"errors":        m.stats.Errors.Load(),
		"totalRequests": total,
		"hitRate":       fmt.Sprintf("%.2f%%", hitRate),
	}
}

func (m *Monitor) ResetStats() {
	m.stats.Hits.Store(0)
	m.stats.Misses.Store(0)
	m.stats.Sets.Store(0)
	m.stats.Deletes.Store(0)
	m.stats.Errors.Store(0)
	m.stats.TotalRequests.Store(0)
}

func (m *Monitor) LogStats(interval time.Duration) {
	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			stats := m.GetStats()
			log.Printf("[Cache Stats] Hits: %v | Misses: %v | Hit Rate: %v | Sets: %v | Deletes: %v | Errors: %v",
				stats["hits"], stats["misses"], stats["hitRate"], stats["sets"], stats["deletes"], stats["errors"])
		}
	}()
}

func (m *Monitor) GetRedisInfo(ctx context.Context) (map[string]string, error) {
	info := make(map[string]string)

	result, err := m.cache.client.Info(ctx, "memory").Result()
	if err != nil {
		return nil, err
	}
	info["memory"] = result

	result, err = m.cache.client.Info(ctx, "stats").Result()
	if err != nil {
		return nil, err
	}
	info["stats"] = result

	dbSize, err := m.cache.client.DBSize(ctx).Result()
	if err != nil {
		return nil, err
	}
	info["keys"] = fmt.Sprintf("%d", dbSize)

	return info, nil
}

func (m *Monitor) HealthCheck(ctx context.Context) error {
	return m.cache.Ping(ctx)
}
