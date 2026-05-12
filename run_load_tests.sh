#!/bin/bash

echo "🚀 CarKid0 Rentals - Load Testing Suite"
echo "========================================"
echo ""

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo "❌ k6 is not installed"
    echo "Install with: brew install k6 (macOS) or visit https://k6.io/docs/getting-started/installation/"
    exit 1
fi

# Configuration
API_URL="${API_URL:-http://localhost:9090}"
ADMIN_TOKEN="${ADMIN_TOKEN:-test-admin-token}"

echo "Configuration:"
echo "  API URL: $API_URL"
echo "  Admin Token: ${ADMIN_TOKEN:0:20}..."
echo ""

# Check if API is running
echo "Checking API health..."
if ! curl -s -f "$API_URL/health" > /dev/null; then
    echo "❌ API is not responding at $API_URL"
    echo "Please start the API server first"
    exit 1
fi
echo "✅ API is running"
echo ""

# Function to run a test
run_test() {
    local test_name=$1
    local test_file=$2
    local output_file=$3
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Running: $test_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    k6 run \
        --out json="$output_file" \
        -e API_URL="$API_URL" \
        -e ADMIN_TOKEN="$ADMIN_TOKEN" \
        "$test_file"
    
    if [ $? -eq 0 ]; then
        echo "✅ $test_name completed successfully"
    else
        echo "❌ $test_name failed"
    fi
    echo ""
}

# Create results directory
mkdir -p tests/load/results

# Run tests
case "${1:-all}" in
    vehicle)
        echo "Running vehicle simulation tests..."
        run_test "Vehicle Simulation" \
            "tests/load/vehicle_simulation.js" \
            "tests/load/results/vehicle_simulation.json"
        ;;
    
    scenarios)
        echo "Running scenario tests..."
        run_test "Database & Cache Scenarios" \
            "tests/load/scenarios.js" \
            "tests/load/results/scenarios.json"
        ;;
    
    quick)
        echo "Running quick smoke test..."
        k6 run \
            --vus 10 \
            --duration 30s \
            -e API_URL="$API_URL" \
            -e ADMIN_TOKEN="$ADMIN_TOKEN" \
            tests/load/vehicle_simulation.js
        ;;
    
    all)
        echo "Running all load tests..."
        echo ""
        
        run_test "Vehicle Simulation (1000 vehicles)" \
            "tests/load/vehicle_simulation.js" \
            "tests/load/results/vehicle_simulation.json"
        
        sleep 5
        
        run_test "Database & Cache Performance" \
            "tests/load/scenarios.js" \
            "tests/load/results/scenarios.json"
        ;;
    
    *)
        echo "Usage: $0 {vehicle|scenarios|quick|all}"
        echo ""
        echo "Commands:"
        echo "  vehicle   - Test 1000 vehicles with GPS pings"
        echo "  scenarios - Test database and cache performance"
        echo "  quick     - Quick 30-second smoke test"
        echo "  all       - Run all tests (default)"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Load Testing Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Results saved to: tests/load/results/"
echo ""
echo "To view detailed results:"
echo "  k6 cloud tests/load/results/vehicle_simulation.json"
echo ""
echo "Or generate HTML report:"
echo "  k6-reporter tests/load/results/vehicle_simulation.json"
