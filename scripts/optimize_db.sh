#!/bin/bash

echo "🔧 CarKid0 Rentals - Database Optimization"
echo "=========================================="

cd "$(dirname "$0")/apps/api"

case "$1" in
  migrate)
    echo "Running migrations..."
    go run cmd/migrate/main.go -action=migrate
    ;;
  indexes)
    echo "Creating indexes..."
    go run cmd/migrate/main.go -action=indexes
    ;;
  optimize)
    echo "Optimizing queries..."
    go run cmd/migrate/main.go -action=optimize
    ;;
  all)
    echo "Running all optimizations..."
    go run cmd/migrate/main.go -action=all
    ;;
  *)
    echo "Usage: $0 {migrate|indexes|optimize|all}"
    echo ""
    echo "Commands:"
    echo "  migrate  - Run database migrations"
    echo "  indexes  - Create performance indexes"
    echo "  optimize - Run query optimizations"
    echo "  all      - Run everything"
    exit 1
    ;;
esac

echo ""
echo "✅ Done!"
