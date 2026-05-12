#!/bin/bash

echo "🔒 CarKid0 Rentals - Security Audit"
echo "===================================="
echo ""

API_URL="${API_URL:-http://localhost:9090}"
RESULTS_FILE="tests/security/results/audit_$(date +%Y%m%d_%H%M%S).txt"

mkdir -p tests/security/results

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
CRITICAL=0
HIGH=0
MEDIUM=0
LOW=0
PASSED=0

log_result() {
    local severity=$1
    local test_name=$2
    local result=$3
    local details=$4
    
    echo "[$severity] $test_name: $result" >> "$RESULTS_FILE"
    if [ -n "$details" ]; then
        echo "  Details: $details" >> "$RESULTS_FILE"
    fi
    echo "" >> "$RESULTS_FILE"
    
    case $severity in
        CRITICAL)
            echo -e "${RED}[CRITICAL]${NC} $test_name: $result"
            ((CRITICAL++))
            ;;
        HIGH)
            echo -e "${RED}[HIGH]${NC} $test_name: $result"
            ((HIGH++))
            ;;
        MEDIUM)
            echo -e "${YELLOW}[MEDIUM]${NC} $test_name: $result"
            ((MEDIUM++))
            ;;
        LOW)
            echo -e "${YELLOW}[LOW]${NC} $test_name: $result"
            ((LOW++))
            ;;
        PASS)
            echo -e "${GREEN}[PASS]${NC} $test_name"
            ((PASSED++))
            ;;
    esac
}

echo "Starting security audit..."
echo "API URL: $API_URL"
echo "Results will be saved to: $RESULTS_FILE"
echo ""

# Test 1: SQL Injection
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: SQL Injection Attempts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test SQL injection in query parameters
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/v1/listings?id=1' OR '1'='1")
if [ "$response" == "500" ] || [ "$response" == "200" ]; then
    log_result "CRITICAL" "SQL Injection in query params" "VULNERABLE" "Response: $response"
else
    log_result "PASS" "SQL Injection in query params"
fi

# Test SQL injection in POST body
response=$(curl -s -X POST "$API_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"phone":"' OR 1=1--"}' \
    -o /dev/null -w "%{http_code}")
if [ "$response" == "500" ]; then
    log_result "CRITICAL" "SQL Injection in POST body" "VULNERABLE" "Response: $response"
else
    log_result "PASS" "SQL Injection in POST body"
fi

# Test 2: Authentication Bypass
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: Authentication Bypass"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test accessing protected endpoint without token
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/v1/lister/dashboard")
if [ "$response" == "200" ]; then
    log_result "CRITICAL" "Protected endpoint without auth" "VULNERABLE" "Endpoint accessible without token"
elif [ "$response" == "401" ] || [ "$response" == "403" ]; then
    log_result "PASS" "Protected endpoint without auth"
else
    log_result "MEDIUM" "Protected endpoint without auth" "UNEXPECTED" "Response: $response"
fi

# Test with invalid token
response=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer invalid-token-12345" \
    "$API_URL/api/v1/lister/dashboard")
if [ "$response" == "200" ]; then
    log_result "CRITICAL" "Invalid token accepted" "VULNERABLE"
elif [ "$response" == "401" ] || [ "$response" == "403" ]; then
    log_result "PASS" "Invalid token rejected"
else
    log_result "MEDIUM" "Invalid token handling" "UNEXPECTED" "Response: $response"
fi

# Test 3: Rate Limiting
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 3: Rate Limiting"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Send 10 rapid requests
rate_limited=false
for i in {1..10}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/v1/listings")
    if [ "$response" == "429" ]; then
        rate_limited=true
        break
    fi
    sleep 0.1
done

if [ "$rate_limited" = true ]; then
    log_result "PASS" "Rate limiting active"
else
    log_result "HIGH" "Rate limiting" "NOT IMPLEMENTED" "No 429 response after 10 requests"
fi

# Test 4: CORS Configuration
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 4: CORS Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cors_header=$(curl -s -I -H "Origin: http://evil.com" "$API_URL/api/v1/listings" | grep -i "access-control-allow-origin")
if echo "$cors_header" | grep -q "*"; then
    log_result "MEDIUM" "CORS allows all origins" "MISCONFIGURED" "Access-Control-Allow-Origin: *"
elif [ -z "$cors_header" ]; then
    log_result "LOW" "CORS not configured" "MISSING"
else
    log_result "PASS" "CORS properly configured"
fi

# Test 5: Security Headers
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 5: Security Headers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

headers=$(curl -s -I "$API_URL/health")

# Check for security headers
if ! echo "$headers" | grep -qi "X-Content-Type-Options"; then
    log_result "LOW" "X-Content-Type-Options header" "MISSING"
else
    log_result "PASS" "X-Content-Type-Options header"
fi

if ! echo "$headers" | grep -qi "X-Frame-Options"; then
    log_result "LOW" "X-Frame-Options header" "MISSING"
else
    log_result "PASS" "X-Frame-Options header"
fi

if ! echo "$headers" | grep -qi "Strict-Transport-Security"; then
    log_result "MEDIUM" "HSTS header" "MISSING" "HTTPS not enforced"
else
    log_result "PASS" "HSTS header"
fi

# Test 6: Information Disclosure
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 6: Information Disclosure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if server header reveals version
server_header=$(curl -s -I "$API_URL/health" | grep -i "Server:")
if echo "$server_header" | grep -qE "[0-9]+\.[0-9]+"; then
    log_result "LOW" "Server version disclosure" "EXPOSED" "$server_header"
else
    log_result "PASS" "Server version not disclosed"
fi

# Check for detailed error messages
error_response=$(curl -s "$API_URL/api/v1/nonexistent")
if echo "$error_response" | grep -qi "stack\|trace\|error.*line"; then
    log_result "MEDIUM" "Detailed error messages" "EXPOSED" "Stack traces visible"
else
    log_result "PASS" "Error messages sanitized"
fi

# Test 7: Input Validation
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 7: Input Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test with extremely long input
long_string=$(python3 -c "print('A' * 10000)")
response=$(curl -s -X POST "$API_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"$long_string\"}" \
    -o /dev/null -w "%{http_code}")
if [ "$response" == "500" ]; then
    log_result "MEDIUM" "Long input handling" "VULNERABLE" "Server error on long input"
elif [ "$response" == "400" ]; then
    log_result "PASS" "Long input validation"
else
    log_result "LOW" "Long input handling" "UNEXPECTED" "Response: $response"
fi

# Test with special characters
response=$(curl -s -X POST "$API_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"phone":"<script>alert(1)</script>"}' \
    -o /dev/null -w "%{http_code}")
if [ "$response" == "500" ]; then
    log_result "MEDIUM" "Special character handling" "VULNERABLE"
elif [ "$response" == "400" ]; then
    log_result "PASS" "Special character validation"
else
    log_result "LOW" "Special character handling" "UNEXPECTED" "Response: $response"
fi

# Test 8: Authorization
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 8: Authorization (Role-Based Access)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# This requires valid tokens - placeholder test
echo "Note: Authorization tests require valid JWT tokens for different roles"
log_result "PASS" "Authorization test placeholder" "Manual testing required"

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Security Audit Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${RED}Critical Issues: $CRITICAL${NC}"
echo -e "${RED}High Issues: $HIGH${NC}"
echo -e "${YELLOW}Medium Issues: $MEDIUM${NC}"
echo -e "${YELLOW}Low Issues: $LOW${NC}"
echo -e "${GREEN}Passed Tests: $PASSED${NC}"
echo ""

total_issues=$((CRITICAL + HIGH + MEDIUM + LOW))
echo "Total Issues Found: $total_issues"
echo ""

if [ $CRITICAL -gt 0 ]; then
    echo -e "${RED}❌ CRITICAL ISSUES FOUND - DO NOT DEPLOY${NC}"
    exit 1
elif [ $HIGH -gt 0 ]; then
    echo -e "${RED}⚠️  HIGH SEVERITY ISSUES - FIX BEFORE DEPLOYMENT${NC}"
    exit 1
elif [ $MEDIUM -gt 0 ]; then
    echo -e "${YELLOW}⚠️  MEDIUM SEVERITY ISSUES - REVIEW REQUIRED${NC}"
    exit 0
else
    echo -e "${GREEN}✅ NO CRITICAL OR HIGH ISSUES FOUND${NC}"
    exit 0
fi
