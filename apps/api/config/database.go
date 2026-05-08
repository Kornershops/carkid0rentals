package config

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=admin password=password dbname=carkid0_rentals port=5432 sslmode=disable TimeZone=Africa/Lagos"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("Database connection failed: %v. Running in memory-fallback mode.", err)
		return
	}

	DB = db
	log.Println("Database connected successfully")
}
