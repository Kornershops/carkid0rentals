#!/bin/bash

# Test script for MEDIUM PRIORITY backend endpoints
# Usage: ./test_medium_priority.sh

BASE_URL="http://localhost:9090/api/v1"

# Generate fresh tokens
echo "🔐 Generating JWT tokens..."
go run generate_token.go > /tmp/tokens.txt

# Extract tokens
DRIVER_TOKEN=$(grep -A 1 "Role: driver" /tmp/tokens.txt | grep "Token:" | awk '{print $2}')
LISTER_TOKEN=$(grep -A 1 "Role: lister" /tmp/tokens.txt | grep "Token:" | awk '{print $2}')
CUSTOMER_TOKEN=$(grep -A 1 "Role: customer" /tmp/tokens.txt | grep "Token:" | awk '{print $2}')

echo ""
echo "🧪 Testing MEDIUM PRIORITY Endpoints"
echo "====================================="
echo ""

# Task 5: Driver Registration
echo "📝 Task 5: Driver Registration"
curl -s -X POST "$BASE_URL/drivers/register" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "licenseNumber": "DL123456789",
    "licenseExpiry": "2026-12-31",
    "experience": 5,
    "vehicleType": "sedan"
  }' | jq '.'
echo ""

# Task 6: Driver Verification Status
echo "🔍 Task 6: Driver Verification Status"
curl -s -H "Authorization: Bearer $DRIVER_TOKEN" \
  "$BASE_URL/drivers/verification-status" | jq '.'
echo ""

# Task 7: Document Upload (simulated)
echo "📄 Task 7: Document Upload"
echo "Note: File upload requires multipart/form-data"
echo "Example: curl -F 'document=@license.jpg' -F 'type=license' -H 'Authorization: Bearer \$TOKEN' $BASE_URL/drivers/upload-document"
echo ""

# Task 8: Get Conversations
echo "💬 Task 8: Get Conversations"
curl -s -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  "$BASE_URL/messages" | jq '.'
echo ""

# Task 9: Send Message
echo "📨 Task 9: Send Message"
curl -s -X POST "$BASE_URL/messages" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_001",
    "message": "Hello, is this vehicle still available?"
  }' | jq '.'
echo ""

# Task 10: Lister Registration
echo "🏢 Task 10: Lister Registration"
curl -s -X POST "$BASE_URL/lister/register" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Premium Rentals Ltd",
    "businessType": "corporate",
    "taxId": "TAX123456"
  }' | jq '.'
echo ""

# Task 11: Driver Onboarding
echo "✅ Task 11: Driver Onboarding"
curl -s -X POST "$BASE_URL/drivers/onboard" \
  -H "Authorization: Bearer $DRIVER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "notifications": true,
      "language": "en"
    }
  }' | jq '.'
echo ""

echo "✅ All MEDIUM priority tests completed!"
echo ""
echo "🔑 Tokens for manual testing:"
echo "DRIVER_TOKEN=$DRIVER_TOKEN"
echo "LISTER_TOKEN=$LISTER_TOKEN"
echo "CUSTOMER_TOKEN=$CUSTOMER_TOKEN"
