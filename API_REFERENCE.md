# 🚀 CarKid0 Rentals API - Endpoint Reference

## 🔴 NEW: HIGH PRIORITY Endpoints (IMPLEMENTED)

### Lister Endpoints

#### Get Lister Dashboard
```http
GET /api/v1/lister/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "monthlyRevenue": 150000,
  "activeBookings": 5,
  "fleetSize": 12,
  "utilizationRate": 65
}
```

#### Get Lister Bookings
```http
GET /api/v1/lister/bookings?status=all
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): `all`, `pending`, `confirmed`, `paid`, `active`, `completed`, `cancelled`

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "listingId": "uuid",
    "listingTitle": "Tesla Model 3",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-01-20T00:00:00Z",
    "days": 5,
    "total": 50000,
    "status": "confirmed",
    "createdAt": "2024-01-10T10:00:00Z"
  }
]
```

---

### Driver Endpoints

#### Get Driver Dashboard
```http
GET /api/v1/drivers/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "todayEarnings": 15000,
  "weeklyEarnings": 85000,
  "activeBookings": 2,
  "availableVehicles": 45
}
```

---

### Booking Endpoints

#### Get Public Booking Detail
```http
GET /api/v1/bookings/:id/public
```

**No authentication required** - for confirmation pages

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "listingId": "uuid",
  "listingTitle": "Mercedes S-Class",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-20T00:00:00Z",
  "days": 5,
  "pricePerDay": 10000,
  "subtotal": 50000,
  "serviceFee": 5000,
  "total": 55000,
  "currency": "NGN",
  "status": "confirmed",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+234...",
  "createdAt": "2024-01-10T10:00:00Z"
}
```

---

## 📋 Existing Endpoints

### Authentication
- `POST /api/v1/auth/login` - Send OTP
- `POST /api/v1/auth/verify` - Verify OTP → JWT
- `POST /api/v1/auth/kyc` - Submit KYC (protected)

### Listings
- `GET /api/v1/listings` - Browse listings
- `GET /api/v1/listings/:id` - Listing detail
- `POST /api/v1/listings` - Create listing (protected)

### Bookings
- `POST /api/v1/bookings` - Create booking (protected)
- `GET /api/v1/bookings` - User's bookings (protected)
- `GET /api/v1/bookings/:id` - Booking detail (protected)
- `PATCH /api/v1/bookings/:id/status` - Update status (protected)

### Payments
- `POST /api/v1/payments/initialize` - Start Paystack payment (protected)
- `POST /api/v1/payments/webhook` - Paystack callback

### Fleet
- `GET /api/v1/fleet` - Fleet management (protected)

---

## 🔧 Testing Examples

### Get a JWT Token
```bash
# 1. Login (send OTP)
curl -X POST http://localhost:9090/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+2348012345678"}'

# 2. Verify OTP (use 123456 for mock)
curl -X POST http://localhost:9090/api/v1/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+2348012345678", "otp": "123456"}'

# Response includes: { "token": "eyJhbGc..." }
```

### Test New Endpoints
```bash
TOKEN="your-jwt-token-here"

# Lister Dashboard
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:9090/api/v1/lister/dashboard

# Lister Bookings
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:9090/api/v1/lister/bookings

# Driver Dashboard
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:9090/api/v1/drivers/dashboard

# Public Booking
curl http://localhost:9090/api/v1/bookings/BOOKING_ID/public
```

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable (database down)

---

## 🎯 Next: MEDIUM PRIORITY Tasks

Ready to implement:
1. Driver Registration (`POST /api/v1/drivers/register`)
2. Driver Verification Status (`GET /api/v1/drivers/verification-status`)
3. Document Upload (`POST /api/v1/drivers/upload-document`)
4. Messaging - Get Conversations (`GET /api/v1/messages`)
5. Messaging - Send Message (`POST /api/v1/messages`)
6. Lister Registration (`POST /api/v1/listers/register`)
7. Driver Onboarding (`POST /api/v1/drivers/onboard`)
8. Update Booking Confirmation Page (frontend)

---

**Base URL**: `http://localhost:9090/api/v1`  
**Production**: TBD (Netlify/Railway)  
**API Version**: 2.0.0
