#!/bin/bash

# Test script for HIGH PRIORITY backend endpoints
# Usage: ./test_endpoints.sh <JWT_TOKEN>

TOKEN=${1:-""}
BASE_URL="http://localhost:9090/api/v1"

if [ -z "$TOKEN" ]; then
  echo "❌ Please provide a JWT token: ./test_endpoints.sh <TOKEN>"
  exit 1
fi

echo "🧪 Testing HIGH PRIORITY Endpoints"
echo "=================================="
echo ""

# Task 1: Lister Dashboard
echo "📊 Task 1: Lister Dashboard"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/lister/dashboard" | jq '.'
echo ""

# Task 2: Lister Bookings
echo "📋 Task 2: Lister Bookings (all)"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/lister/bookings" | jq '.'
echo ""

echo "📋 Task 2: Lister Bookings (active only)"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/lister/bookings?status=active" | jq '.'
echo ""

# Task 3: Driver Dashboard
echo "🚗 Task 3: Driver Dashboard"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/drivers/dashboard" | jq '.'
echo ""

# Task 4: Public Booking Detail
echo "🎫 Task 4: Public Booking Detail"
echo "Enter booking ID to test (or press Enter to skip):"
read BOOKING_ID
if [ ! -z "$BOOKING_ID" ]; then
  curl -s "$BASE_URL/bookings/$BOOKING_ID/public" | jq '.'
  echo ""
fi

echo "✅ All tests completed!"
