package listings

import (
	"strconv"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(router fiber.Router) {
	l := router.Group("/listings")
	l.Get("/", GetListings)
	l.Get("/:id", GetListing)
	l.Post("/", middleware.Protected(), CreateListing)
}

func GetListings(c fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}

	filter := ListingFilter{
		Category: c.Query("category"),
		Source:   c.Query("source", "all"),
		Country:  c.Query("country"),
		City:     c.Query("city"),
		Page:     page,
		Limit:    limit,
	}

	if config.DB == nil {
		return c.JSON(fiber.Map{"listings": []Listing{}, "total": 0})
	}

	var listings []Listing
	query := config.DB.Model(&Listing{})

	if filter.Category != "" && filter.Category != "all" {
		query = query.Where("category = ?", filter.Category)
	}
	if filter.Source == "admin" {
		query = query.Where("lister_role = ?", "admin")
	} else if filter.Source == "lister" {
		query = query.Where("lister_role = ?", "lister")
	}
	if filter.Country != "" {
		query = query.Where("country = ?", filter.Country)
	}
	if filter.City != "" {
		query = query.Where("location = ?", filter.City)
	}

	var total int64
	query.Count(&total)

	offset := (filter.Page - 1) * filter.Limit
	query.Offset(offset).Limit(filter.Limit).Order("created_at DESC").Find(&listings)

	return c.JSON(fiber.Map{
		"listings": listings,
		"total":    total,
		"page":     filter.Page,
		"limit":    filter.Limit,
	})
}

func GetListing(c fiber.Ctx) error {
	id := c.Params("id")

	if config.DB == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Not found"})
	}

	var listing Listing
	if err := config.DB.First(&listing, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Listing not found"})
	}
	return c.JSON(listing)
}

func CreateListing(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	role := c.Locals("role").(string)

	var listing Listing
	if err := c.Bind().JSON(&listing); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	listing.ListerID = userID
	if role == "admin" {
		listing.ListerRole = "admin"
		listing.ListerName = "CarKid0 Official"
	} else {
		listing.ListerRole = "lister"
	}

	if config.DB != nil {
		if err := config.DB.Create(&listing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to create listing"})
		}
	}

	return c.Status(201).JSON(listing)
}
