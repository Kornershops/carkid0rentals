# 🔔 Notifications System Setup Guide

**Version:** 1.0  
**Last Updated:** January 2025  
**Status:** ✅ Ready for Production

---

## 📋 Overview

The notifications system supports 4 channels:
1. **Push Notifications** - Firebase Cloud Messaging (FCM)
2. **Email Notifications** - SendGrid
3. **SMS Notifications** - Twilio
4. **In-App Notifications** - Database + WebSocket

---

## 🚀 Quick Start

### 1. Backend Setup

#### Environment Variables
Add to `apps/api/.env`:

```env
# Firebase Cloud Messaging (Push Notifications)
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json

# SendGrid (Email Notifications)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=notifications@carkid0rentals.com
SENDGRID_FROM_NAME=CarKid0 Rentals

# Twilio (SMS Notifications)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Install Dependencies
```bash
cd apps/api

# Firebase Admin SDK
go get firebase.google.com/go/v4
go get google.golang.org/api/option

# SendGrid
go get github.com/sendgrid/sendgrid-go

# Twilio
go get github.com/twilio/twilio-go
```

#### Run Migrations
```bash
# Migrations are auto-run on startup
go run main.go
```

---

### 2. Frontend Setup

#### Install Dependencies
```bash
cd apps/web

# Date formatting
npm install date-fns

# Icons (already installed)
npm install lucide-react
```

#### Add NotificationBell to Header
Edit `apps/web/src/components/layout/header.tsx`:

```tsx
import { NotificationBell } from '@/components/notifications';

export function Header() {
  return (
    <header>
      {/* ... other header content ... */}
      <NotificationBell className="ml-4" />
    </header>
  );
}
```

---

## 🔧 Service Integration

### Firebase Cloud Messaging (FCM)

#### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or use existing
3. Add web app to project
4. Enable Cloud Messaging

#### 2. Generate Service Account Key
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `firebase-credentials.json`
4. Set path in `FIREBASE_CREDENTIALS_PATH`

#### 3. Get Web Push Certificate
1. Go to Project Settings → Cloud Messaging
2. Under "Web Push certificates", generate key pair
3. Copy the key pair (needed for frontend)

#### 4. Frontend Setup
Create `apps/web/public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

---

### SendGrid (Email)

#### 1. Create SendGrid Account
1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for free account (100 emails/day)
3. Verify your email

#### 2. Create API Key
1. Go to Settings → API Keys
2. Create API Key with "Full Access"
3. Copy key and set in `SENDGRID_API_KEY`

#### 3. Verify Sender Identity
1. Go to Settings → Sender Authentication
2. Verify single sender or domain
3. Use verified email in `SENDGRID_FROM_EMAIL`

#### 4. Test Email
```bash
curl -X POST http://localhost:9090/api/v1/notifications/test-email \
  -H "Authorization: Bearer $TOKEN"
```

---

### Twilio (SMS)

#### 1. Create Twilio Account
1. Go to [Twilio](https://www.twilio.com/)
2. Sign up for free trial ($15 credit)
3. Verify your phone number

#### 2. Get Credentials
1. Go to Console Dashboard
2. Copy Account SID → `TWILIO_ACCOUNT_SID`
3. Copy Auth Token → `TWILIO_AUTH_TOKEN`

#### 3. Get Phone Number
1. Go to Phone Numbers → Buy a Number
2. Select number with SMS capability
3. Copy number → `TWILIO_PHONE_NUMBER`

#### 4. Test SMS
```bash
curl -X POST http://localhost:9090/api/v1/notifications/test-sms \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 API Endpoints

### Register Device Token
```bash
POST /api/v1/notifications/register-device
Authorization: Bearer {token}
Content-Type: application/json

{
  "token": "fcm-device-token",
  "platform": "web" // or "ios", "android"
}
```

### Get Notifications
```bash
GET /api/v1/notifications?limit=20&offset=0
Authorization: Bearer {token}
```

### Mark as Read
```bash
PATCH /api/v1/notifications/{id}/read
Authorization: Bearer {token}
```

### Mark All as Read
```bash
PATCH /api/v1/notifications/read-all
Authorization: Bearer {token}
```

### Get Unread Count
```bash
GET /api/v1/notifications/unread-count
Authorization: Bearer {token}
```

### Get Preferences
```bash
GET /api/v1/notifications/preferences
Authorization: Bearer {token}
```

### Update Preferences
```bash
PATCH /api/v1/notifications/preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "push": true,
  "email": true,
  "sms": false,
  "in_app": true
}
```

---

## 🧪 Testing

### Backend Tests
```bash
cd apps/api

# Test notification creation
go test ./domain/notifications/... -v

# Test with curl
export TOKEN=$(go run generate_token.go | grep "Token:" | cut -d' ' -f2)

# Register device
curl -X POST http://localhost:9090/api/v1/notifications/register-device \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token":"test-token-123","platform":"web"}'

# Get notifications
curl http://localhost:9090/api/v1/notifications \
  -H "Authorization: Bearer $TOKEN"
```

### Frontend Tests
```bash
cd apps/web

# Run component tests
npm test -- notifications

# Manual testing
npm run dev
# Navigate to http://localhost:3000
# Click notification bell icon
```

---

## 📈 Monitoring

### Delivery Metrics
Monitor in your service dashboards:

**Firebase Console:**
- Cloud Messaging → Reports
- Track delivery rate, open rate

**SendGrid Dashboard:**
- Statistics → Overview
- Track sent, delivered, opened

**Twilio Console:**
- Messaging → Logs
- Track sent, delivered, failed

### Application Metrics
```sql
-- Unread notifications by user
SELECT user_id, COUNT(*) as unread_count
FROM notifications
WHERE read = false
GROUP BY user_id;

-- Notification types distribution
SELECT type, COUNT(*) as count
FROM notifications
GROUP BY type
ORDER BY count DESC;

-- Delivery rate (last 24 hours)
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN read = true THEN 1 ELSE 0 END) as read_count,
  (SUM(CASE WHEN read = true THEN 1 ELSE 0 END)::float / COUNT(*) * 100) as read_rate
FROM notifications
WHERE created_at > NOW() - INTERVAL '24 hours';
```

---

## 🔒 Security

### Best Practices
1. **Never expose API keys** in frontend code
2. **Use environment variables** for all credentials
3. **Validate user permissions** before sending notifications
4. **Rate limit** notification endpoints
5. **Sanitize user input** in notification content

### Rate Limiting
Add to `apps/api/middleware/rate_limit.go`:

```go
// Limit to 100 notifications per user per hour
limiter := rate.NewLimiter(rate.Every(time.Hour/100), 100)
```

---

## 🐛 Troubleshooting

### Push Notifications Not Working
1. Check Firebase credentials path
2. Verify device token is registered
3. Check FCM console for errors
4. Ensure user has granted notification permission

### Emails Not Sending
1. Verify SendGrid API key
2. Check sender email is verified
3. Review SendGrid activity logs
4. Check spam folder

### SMS Not Sending
1. Verify Twilio credentials
2. Check phone number format (+1234567890)
3. Ensure trial account has verified recipient
4. Review Twilio logs

### Database Issues
```bash
# Check if tables exist
psql -d carkid0_rentals -c "\dt notifications*"

# Check notification count
psql -d carkid0_rentals -c "SELECT COUNT(*) FROM notifications;"

# Reset migrations (if needed)
psql -d carkid0_rentals -c "DROP TABLE IF EXISTS notifications, notification_preferences, device_tokens CASCADE;"
```

---

## 💰 Cost Estimates

### Free Tiers
- **Firebase FCM:** Unlimited (free)
- **SendGrid:** 100 emails/day (free)
- **Twilio:** $15 trial credit

### Paid Plans
- **SendGrid Essentials:** $15/mo (40,000 emails)
- **Twilio:** $0.0075/SMS (pay-as-you-go)

### Monthly Estimates (10,000 users)
- Push: $0 (free)
- Email: $15-50 (depending on volume)
- SMS: $75 (if 10% opt-in, 1 SMS/week)
- **Total:** ~$100/month

---

## 📚 Additional Resources

### Documentation
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [SendGrid API](https://docs.sendgrid.com/)
- [Twilio SMS](https://www.twilio.com/docs/sms)

### Code Examples
- See `apps/api/domain/notifications/` for backend
- See `apps/web/src/components/notifications/` for frontend

---

## ✅ Checklist

### Backend
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Database migrations run
- [ ] Firebase credentials added
- [ ] SendGrid API key added
- [ ] Twilio credentials added
- [ ] API endpoints tested

### Frontend
- [ ] Dependencies installed
- [ ] NotificationBell added to header
- [ ] Firebase config added
- [ ] Service worker registered
- [ ] Components tested

### Production
- [ ] Environment variables in production
- [ ] Firebase project in production mode
- [ ] SendGrid sender verified
- [ ] Twilio phone number purchased
- [ ] Monitoring setup
- [ ] Rate limiting enabled

---

**Status:** ✅ Ready for Production  
**Next Steps:** Configure services and test end-to-end
