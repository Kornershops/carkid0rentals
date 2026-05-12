# Load Testing Guide

## Overview

Comprehensive load testing suite for CarKid0 Rentals Safe-Halt system using k6.

## Installation

### macOS
```bash
brew install k6
```

### Linux
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Windows
```bash
choco install k6
```

## Test Scenarios

### 1. Vehicle Simulation (`vehicle_simulation.js`)

Simulates 1000 vehicles sending GPS pings with 4 scenarios:

**Scenario 1: Baseline Load (5 min)**
- 1000 vehicles
- 60-second ping interval
- Tests: Normal operation capacity

**Scenario 2: High Frequency (5 min)**
- 500 vehicles
- 5-second ping interval
- Tests: Short rental handling

**Scenario 3: Mixed Load (5 min)**
- 1000 vehicles
- Mixed intervals (5s/30s/60s)
- 20% short, 30% medium, 50% long rentals
- Tests: Realistic production load

**Scenario 4: Spike Test (2 min)**
- 0 → 2000 vehicles in 30 seconds
- Hold 2000 for 1 minute
- 2000 → 0 in 30 seconds
- Tests: Sudden load handling

### 2. Database & Cache Scenarios (`scenarios.js`)

Tests infrastructure performance:

**Database Load (3 min)**
- 100 queries/second
- Tests: Active rentals, user bookings, available vehicles, vehicle status
- Threshold: p95 < 100ms

**Cache Performance (3 min)**
- 500 requests/second
- Tests: Cache hit rate, response times
- Threshold: Hit rate > 80%

**Redis Updates (3 min)**
- 1000 updates/second
- Tests: GPS data storage speed
- Threshold: p95 < 5ms

**Concurrent Operations (5 min)**
- Ramps from 10 to 200 ops/second
- Tests: Bookings, rentals, queries, GPS updates
- Threshold: p95 < 200ms

## Running Tests

### Quick Smoke Test (30 seconds)
```bash
./run_load_tests.sh quick
```

### Vehicle Simulation Only
```bash
./run_load_tests.sh vehicle
```

### Database & Cache Only
```bash
./run_load_tests.sh scenarios
```

### All Tests (~25 minutes)
```bash
./run_load_tests.sh all
```

### Custom Configuration
```bash
API_URL=http://production-api.com \
ADMIN_TOKEN=your-token \
./run_load_tests.sh all
```

## Performance Thresholds

### Response Times
- **p95 < 100ms** - 95% of requests under 100ms
- **p99 < 200ms** - 99% of requests under 200ms
- **Redis updates < 5ms** - GPS data storage
- **Cache hits < 10ms** - Cached responses
- **DB queries < 50ms** - Database operations

### Error Rates
- **HTTP failures < 1%** - Less than 1% failed requests
- **Error rate < 1%** - Less than 1% application errors

### Cache Performance
- **Hit rate > 80%** - At least 80% cache hits

## Expected Results

### Baseline Performance
```
✓ http_req_duration..............: avg=45ms  p95=85ms  p99=150ms
✓ http_req_failed................: 0.05%
✓ errors.........................: 0.03%
✓ cache_hits.....................: 85%
✓ db_query_duration..............: avg=25ms  p95=45ms
```

### System Capacity
- **1000 vehicles @ 60s interval:** ~17 requests/second
- **500 vehicles @ 5s interval:** ~100 requests/second
- **Mixed load:** ~50-70 requests/second
- **Spike capacity:** 2000 concurrent vehicles

### Resource Usage (Expected)
- **CPU:** 40-60% under normal load
- **Memory:** 2-4 GB
- **Redis:** 500 MB - 1 GB
- **Database connections:** 20-40 active

## Interpreting Results

### Good Performance
```
✓ All thresholds passing
✓ Error rate < 0.1%
✓ p95 response time < 100ms
✓ Cache hit rate > 80%
✓ No timeouts or connection errors
```

### Warning Signs
```
⚠ Error rate 0.1% - 1%
⚠ p95 response time 100-200ms
⚠ Cache hit rate 70-80%
⚠ Occasional timeouts
```

### Critical Issues
```
❌ Error rate > 1%
❌ p95 response time > 200ms
❌ Cache hit rate < 70%
❌ Frequent timeouts
❌ Database connection pool exhausted
```

## Optimization Recommendations

### If Response Times High
1. Check database indexes (run `./optimize_db.sh`)
2. Increase Redis memory
3. Enable query caching
4. Add more database connections
5. Scale horizontally

### If Error Rate High
1. Check application logs
2. Verify database connectivity
3. Check Redis connectivity
4. Review rate limiting settings
5. Increase timeout values

### If Cache Hit Rate Low
1. Increase cache TTL
2. Warm cache on startup
3. Review cache invalidation logic
4. Add more cacheable endpoints
5. Increase Redis memory

## Monitoring During Tests

### Terminal 1: Run Tests
```bash
./run_load_tests.sh all
```

### Terminal 2: Monitor API Logs
```bash
cd apps/api
tail -f api.log | grep -E "ERROR|WARN|SLOW"
```

### Terminal 3: Monitor System Resources
```bash
# CPU and Memory
top

# Or use htop
htop

# Database connections
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Redis memory
redis-cli INFO memory
```

### Terminal 4: Monitor Redis
```bash
redis-cli MONITOR
```

## Test Results Analysis

### View JSON Results
```bash
cat tests/load/results/vehicle_simulation.json | jq '.metrics'
```

### Generate HTML Report
```bash
# Install k6-reporter
npm install -g k6-html-reporter

# Generate report
k6-html-reporter tests/load/results/vehicle_simulation.json
```

### Upload to k6 Cloud (Optional)
```bash
k6 login cloud
k6 run --out cloud tests/load/vehicle_simulation.js
```

## Troubleshooting

### k6 Not Found
```bash
# macOS
brew install k6

# Verify installation
k6 version
```

### API Not Responding
```bash
# Check if API is running
curl http://localhost:9090/health

# Start API
cd apps/api
go run main.go
```

### Connection Refused
```bash
# Check port
lsof -i :9090

# Kill existing process
lsof -ti:9090 | xargs kill -9

# Restart API
cd apps/api
go run main.go
```

### Out of Memory
```bash
# Increase system limits
ulimit -n 10000

# Reduce concurrent VUs
# Edit test file and reduce vus value
```

### Database Connection Pool Exhausted
```bash
# Increase max connections in config/database.go
sqlDB.SetMaxOpenConns(200)  // Increase from 100

# Or reduce test load
```

## Pre-Production Checklist

Before running load tests:
- [ ] Database indexes created (`./optimize_db.sh indexes`)
- [ ] Redis cache enabled
- [ ] Background jobs running
- [ ] Connection pooling configured
- [ ] Monitoring dashboards ready
- [ ] Backup database before tests
- [ ] Test on staging environment first

## Post-Test Actions

After load tests complete:
1. Review all metrics against thresholds
2. Identify bottlenecks from logs
3. Document performance issues
4. Create optimization tickets
5. Re-run tests after fixes
6. Update capacity planning docs

## Files Created

1. `tests/load/vehicle_simulation.js` - Vehicle GPS simulation
2. `tests/load/scenarios.js` - Database and cache tests
3. `run_load_tests.sh` - Test runner script
4. `LOAD_TESTING.md` - This documentation

## Next Steps

1. Install k6: `brew install k6`
2. Start API: `cd apps/api && go run main.go`
3. Run quick test: `./run_load_tests.sh quick`
4. Review results
5. Run full suite: `./run_load_tests.sh all`
6. Optimize based on results
7. Re-test until thresholds met

## Success Criteria

- [ ] All 4 vehicle scenarios pass
- [ ] All 4 infrastructure scenarios pass
- [ ] Error rate < 0.1%
- [ ] p95 response time < 100ms
- [ ] Cache hit rate > 80%
- [ ] System stable for 25 minutes
- [ ] No memory leaks
- [ ] No connection pool exhaustion

**Status:** Ready to run load tests
