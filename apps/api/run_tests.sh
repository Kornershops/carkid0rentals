#!/bin/bash

# Test Runner Script for CarKid0 Rentals Backend
# Runs all unit tests with coverage reporting

echo "🧪 CarKid0 Rentals - Backend Test Suite"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test configuration
COVERAGE_THRESHOLD=80
COVERAGE_FILE="coverage.out"
COVERAGE_HTML="coverage.html"

# Function to run tests for a domain
run_domain_tests() {
    local domain=$1
    echo -e "${YELLOW}Testing ${domain} domain...${NC}"
    
    go test -v -cover ./domain/${domain}/... -coverprofile=${domain}_coverage.out
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ ${domain} tests passed${NC}"
        return 0
    else
        echo -e "${RED}❌ ${domain} tests failed${NC}"
        return 1
    fi
}

# Function to calculate coverage
calculate_coverage() {
    local coverage_file=$1
    if [ -f "$coverage_file" ]; then
        go tool cover -func=$coverage_file | grep total | awk '{print $3}' | sed 's/%//'
    else
        echo "0"
    fi
}

echo "📦 Installing test dependencies..."
go get github.com/stretchr/testify/assert
go get github.com/stretchr/testify/mock
echo ""

# Run tests for each domain
echo "🔬 Running Unit Tests..."
echo ""

FAILED_TESTS=0

# Notifications Domain Tests
run_domain_tests "notifications"
NOTIF_RESULT=$?
NOTIF_COVERAGE=$(calculate_coverage "notifications_coverage.out")

# Payments Domain Tests
run_domain_tests "payments"
PAYMENT_RESULT=$?
PAYMENT_COVERAGE=$(calculate_coverage "payments_coverage.out")

# Support Domain Tests
run_domain_tests "support"
SUPPORT_RESULT=$?
SUPPORT_COVERAGE=$(calculate_coverage "support_coverage.out")

echo ""
echo "📊 Test Results Summary"
echo "======================="
echo ""

# Notifications Results
if [ $NOTIF_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Notifications: PASSED${NC} (Coverage: ${NOTIF_COVERAGE}%)"
else
    echo -e "${RED}❌ Notifications: FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

# Payments Results
if [ $PAYMENT_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Payments: PASSED${NC} (Coverage: ${PAYMENT_COVERAGE}%)"
else
    echo -e "${RED}❌ Payments: FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

# Support Results
if [ $SUPPORT_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Support: PASSED${NC} (Coverage: ${SUPPORT_COVERAGE}%)"
else
    echo -e "${RED}❌ Support: FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""

# Combine coverage reports
echo "📈 Generating Combined Coverage Report..."
echo "mode: set" > $COVERAGE_FILE
cat notifications_coverage.out | grep -v "mode: set" >> $COVERAGE_FILE 2>/dev/null
cat payments_coverage.out | grep -v "mode: set" >> $COVERAGE_FILE 2>/dev/null
cat support_coverage.out | grep -v "mode: set" >> $COVERAGE_FILE 2>/dev/null

# Calculate overall coverage
OVERALL_COVERAGE=$(go tool cover -func=$COVERAGE_FILE | grep total | awk '{print $3}' | sed 's/%//')

echo ""
echo "📊 Coverage Summary"
echo "==================="
echo "Notifications: ${NOTIF_COVERAGE}%"
echo "Payments:      ${PAYMENT_COVERAGE}%"
echo "Support:       ${SUPPORT_COVERAGE}%"
echo "-------------------"
echo "Overall:       ${OVERALL_COVERAGE}%"
echo ""

# Generate HTML coverage report
go tool cover -html=$COVERAGE_FILE -o $COVERAGE_HTML
echo "📄 HTML Coverage Report: $COVERAGE_HTML"
echo ""

# Check coverage threshold
if (( $(echo "$OVERALL_COVERAGE >= $COVERAGE_THRESHOLD" | bc -l) )); then
    echo -e "${GREEN}✅ Coverage threshold met: ${OVERALL_COVERAGE}% >= ${COVERAGE_THRESHOLD}%${NC}"
else
    echo -e "${YELLOW}⚠️  Coverage below threshold: ${OVERALL_COVERAGE}% < ${COVERAGE_THRESHOLD}%${NC}"
fi

echo ""

# Final result
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ ${FAILED_TESTS} test suite(s) failed${NC}"
    exit 1
fi
