package main

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"userId"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func main() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "carkid0-dev-secret-change-in-production"
	}

	// Generate tokens for different roles
	roles := []struct {
		userID string
		role   string
	}{
		{"usr_customer_001", "customer"},
		{"usr_driver_001", "driver"},
		{"usr_lister_001", "lister"},
		{"usr_admin_001", "admin"},
	}

	fmt.Println("🔐 CarKid0 Rentals - JWT Token Generator")
	fmt.Println("=========================================\n")

	for _, r := range roles {
		claims := Claims{
			UserID: r.userID,
			Role:   r.role,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
				IssuedAt:  jwt.NewNumericDate(time.Now()),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString([]byte(secret))
		if err != nil {
			fmt.Printf("Error generating token for %s: %v\n", r.role, err)
			continue
		}

		fmt.Printf("Role: %s\n", r.role)
		fmt.Printf("UserID: %s\n", r.userID)
		fmt.Printf("Token: %s\n", tokenString)
		fmt.Printf("Expires: %s\n\n", time.Now().Add(7*24*time.Hour).Format(time.RFC3339))
	}

	fmt.Println("💡 Usage:")
	fmt.Println("export TOKEN=\"<token>\"")
	fmt.Println("curl -H \"Authorization: Bearer $TOKEN\" http://localhost:9090/api/v1/auth/me")
}
