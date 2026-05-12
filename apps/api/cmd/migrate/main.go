package main

import (
	"flag"
	"log"
	"os"

	"github.com/carkid0/rentals/api/config"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	godotenv.Load()

	action := flag.String("action", "migrate", "Action to perform: migrate, indexes, optimize, all")
	flag.Parse()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=admin password=password dbname=carkid0_rentals port=5432 sslmode=disable TimeZone=Africa/Lagos"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Printf("Connected to database. Running action: %s", *action)

	switch *action {
	case "migrate":
		if err := config.RunMigrations(db); err != nil {
			log.Fatalf("Migration failed: %v", err)
		}
	case "indexes":
		if err := config.CreateIndexes(db); err != nil {
			log.Fatalf("Index creation failed: %v", err)
		}
	case "optimize":
		if err := config.OptimizeQueries(db); err != nil {
			log.Fatalf("Optimization failed: %v", err)
		}
	case "all":
		if err := config.RunMigrations(db); err != nil {
			log.Fatalf("Migration failed: %v", err)
		}
	default:
		log.Fatalf("Unknown action: %s", *action)
	}

	log.Println("✅ Database operations completed successfully")
}
