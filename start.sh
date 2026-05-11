#!/bin/bash

echo "🚀 CarKid0 Rentals - Quick Start"
echo "================================"
echo ""

# Kill any existing process on port 9090
echo "🔧 Checking port 9090..."
lsof -ti:9090 | xargs kill -9 2>/dev/null && echo "✅ Cleared port 9090" || echo "✅ Port 9090 is free"
echo ""

# Start API
echo "🚀 Starting API on port 9090..."
cd apps/api
go run main.go &
API_PID=$!
echo "✅ API started (PID: $API_PID)"
echo ""

# Wait for API to be ready
echo "⏳ Waiting for API to be ready..."
sleep 3

# Test health endpoint
echo "🧪 Testing health endpoint..."
curl -s http://localhost:9090/health | jq '.' || echo "❌ Health check failed"
echo ""

# Generate tokens
echo "🔐 Generating JWT tokens..."
go run generate_token.go
echo ""

echo "✅ Setup complete!"
echo ""
echo "📚 Quick Commands:"
echo "  Test endpoints:  ./test_medium_priority.sh"
echo "  Stop API:        kill $API_PID"
echo "  View logs:       tail -f api.log"
echo ""
echo "🌐 API running at: http://localhost:9090"
echo "📖 Health check:   http://localhost:9090/health"
