# 🚀 Quick Start Guide - Backend Testing

## 🔐 JWT Tokens (Valid for 7 days)

### Customer Token
```bash
export CUSTOMER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfY3VzdG9tZXJfMDAxIiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNzc5MTEyNTE1LCJpYXQiOjE3Nzg1MDc3MTV9.Tm-583hT8wRS1EfUe8di3MTFcaCuOghjDUfrRKsjoF4"
```

### Driver Token
```bash
export DRIVER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfZHJpdmVyXzAwMSIsInJvbGUiOiJkcml2ZXIiLCJleHAiOjE3NzkxMTI1MTUsImlhdCI6MTc3ODUwNzcxNX0.FiXkhZj1s5_kH8n0a4V7-V0PzoZ2qesNg9JdEEZQd5o"
```

### Lister Token
```bash
export LISTER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfbGlzdGVyXzAwMSIsInJvbGUiOiJsaXN0ZXIiLCJleHAiOjE3NzkxMTI1MTUsImlhdCI6MTc3ODUwNzcxNX0.tSUBLYkUJCpDun-MxploO4gIWELGbhC4Bh7A0D-YizA"
```

### Admin Token
```bash
export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfYWRtaW5fMDAxIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzc5MTEyNTE1LCJpYXQiOjE3Nzg1MDc3MTV9.sRMREAUDR5oj2g6PPHL76WwPFLJcbqJbedRpI9eJSuM"
```

---

## 🚀 Start the API

```bash
cd apps/api
go run main.go
```

API runs on: `http://localhost:9090`

---

## 🧪 Quick Tests

### Test Authentication
```bash
curl -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  http://localhost:9090/api/v1/auth/me
```

### Test Lister Dashboard
```bash
curl -H "Authorization: Bearer $LISTER_TOKEN" \
  http://localhost:9090/api/v1/lister/dashboard
```

### Test Driver Dashboard
```bash
curl -H "Authorization: Bearer $DRIVER_TOKEN" \
  http://localhost:9090/api/v1/drivers/dashboard
```

### Register as Driver
```bash
curl -X POST http://localhost:9090/api/v1/drivers/register \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "licenseNumber": "DL123456789",
    "licenseExpiry": "2026-12-31",
    "experience": 5,
    "vehicleType": "sedan"
  }'
```

### Register as Lister
```bash
curl -X POST http://localhost:9090/api/v1/lister/register \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Premium Rentals Ltd",
    "businessType": "corporate",
    "taxId": "TAX123456"
  }'
```

---

## 📋 All Available Endpoints

### Authentication
- `POST /api/v1/auth/login` - Send OTP
- `POST /api/v1/auth/verify` - Verify OTP → JWT
- `POST /api/v1/auth/kyc` - Submit KYC ✅
- `GET /api/v1/auth/me` - Get current user ✅
- `PATCH /api/v1/auth/role` - Update role ✅

### Listings
- `GET /api/v1/listings` - Browse listings
- `GET /api/v1/listings/:id` - Listing detail
- `POST /api/v1/listings` - Create listing ✅

### Bookings
- `POST /api/v1/bookings` - Create booking ✅
- `GET /api/v1/bookings` - User's bookings ✅
- `GET /api/v1/bookings/:id` - Booking detail ✅
- `GET /api/v1/bookings/:id/public` - Public booking detail ⭐ NEW
- `PATCH /api/v1/bookings/:id/status` - Update status ✅

### Lister (NEW)
- `GET /api/v1/lister/dashboard` - Dashboard stats ⭐ NEW
- `GET /api/v1/lister/bookings` - Lister's bookings ⭐ NEW
- `POST /api/v1/lister/register` - Register as lister ⭐ NEW

### Driver (NEW)
- `GET /api/v1/drivers/dashboard` - Dashboard stats ⭐ NEW
- `POST /api/v1/drivers/register` - Register as driver ⭐ NEW
- `GET /api/v1/drivers/verification-status` - Check status ⭐ NEW
- `POST /api/v1/drivers/upload-document` - Upload docs ⭐ NEW
- `POST /api/v1/drivers/onboard` - Complete onboarding ⭐ NEW

### Messages (NEW)
- `GET /api/v1/messages` - Get conversations ⭐ NEW
- `POST /api/v1/messages` - Send message ⭐ NEW

### Payments
- `POST /api/v1/payments/initialize` - Start payment ✅
- `POST /api/v1/payments/webhook` - Paystack callback

### Fleet
- `GET /api/v1/fleet` - Fleet management ✅

---

## 🔄 Generate Fresh Tokens

```bash
cd apps/api
go run generate_token.go
```

---

## 📊 Implementation Status

✅ **Sprint 1 (HIGH)**: 4/4 Complete  
✅ **Sprint 2 (MEDIUM)**: 8/8 Complete  
🔜 **Sprint 3 (LOW)**: 0/9 Remaining

**Total Endpoints Implemented**: 12 new endpoints  
**Total Time**: ~3 hours  
**Build Status**: ✅ Passing

---

## 🐛 Troubleshooting

### Token Expired?
```bash
go run generate_token.go
```

### Database Connection Issues?
```bash
docker-compose up -d postgres
```

### Port Already in Use?
```bash
lsof -ti:9090 | xargs kill -9
```

---

## 📚 Documentation

- `IMPLEMENTATION_SUMMARY.md` - Sprint 1 details
- `SPRINT_2_SUMMARY.md` - Sprint 2 details
- `API_REFERENCE.md` - Full API documentation
- `BACKEND_INTEGRATION_TASKS.md` - Original task list

---

**Ready to test!** 🚀
