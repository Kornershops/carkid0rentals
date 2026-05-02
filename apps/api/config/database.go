package config

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// In production, load from environment variables
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Mock local connection for dev
		dsn = "host=localhost user=carkid0 password=secret dbname=carkid0 port=5432 sslmode=disable TimeZone=Africa/Lagos"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Database connection failed. Continuing in mocked memory mode for now...")
		// In a real app we might panic(err), but we want the mock to run without a real Postgres instance yet
		return
	}

	DB = db
	log.Println("Database connection successful")
}
