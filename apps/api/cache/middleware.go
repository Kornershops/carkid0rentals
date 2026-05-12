package cache

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v3"
)

type Middleware struct {
	cache *CacheManager
}

func NewMiddleware(cache *CacheManager) *Middleware {
	return &Middleware{cache: cache}
}

func (m *Middleware) CacheResponse(ttl time.Duration) fiber.Handler {
	return func(c fiber.Ctx) error {
		if c.Method() != "GET" {
			return c.Next()
		}

		cacheKey := m.generateCacheKey(c)

		var cachedResponse []byte
		if err := m.cache.Get(c.Context(), cacheKey, &cachedResponse); err == nil {
			c.Set("X-Cache", "HIT")
			return c.Send(cachedResponse)
		}

		c.Set("X-Cache", "MISS")

		if err := c.Next(); err != nil {
			return err
		}

		response := c.Response().Body()
		if len(response) > 0 {
			m.cache.Set(c.Context(), cacheKey, response, ttl)
		}

		return nil
	}
}

func (m *Middleware) generateCacheKey(c fiber.Ctx) string {
	path := c.Path()
	query := c.Request().URI().QueryString()
	userID := c.Locals("userID")

	key := fmt.Sprintf("%s:%s:%v", path, query, userID)
	hash := sha256.Sum256([]byte(key))
	return "response:" + hex.EncodeToString(hash[:])
}

func (m *Middleware) RateLimit(maxRequests int, window time.Duration) fiber.Handler {
	return func(c fiber.Ctx) error {
		userID := c.Locals("userID")
		if userID == nil {
			userID = c.IP()
		}

		key := fmt.Sprintf("rate_limit:%v", userID)
		count, err := m.cache.Increment(c.Context(), key, window)
		if err != nil {
			return c.Next()
		}

		c.Set("X-RateLimit-Limit", fmt.Sprintf("%d", maxRequests))
		c.Set("X-RateLimit-Remaining", fmt.Sprintf("%d", maxRequests-int(count)))

		if count > int64(maxRequests) {
			return c.Status(429).JSON(fiber.Map{
				"error": "Rate limit exceeded",
			})
		}

		return c.Next()
	}
}
