import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const cacheHitRate = new Rate('cache_hits');
const dbQueryTime = new Trend('db_query_duration');

export const options = {
  scenarios: {
    // Database query performance
    database_load: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 50,
      maxVUs: 200,
      exec: 'testDatabaseQueries',
    },
    
    // Cache performance
    cache_load: {
      executor: 'constant-arrival-rate',
      rate: 500,
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 100,
      maxVUs: 500,
      startTime: '4m',
      exec: 'testCachePerformance',
    },
    
    // Redis state updates
    redis_load: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 200,
      maxVUs: 1000,
      startTime: '8m',
      exec: 'testRedisUpdates',
    },
    
    // Background job stress test
    concurrent_operations: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      stages: [
        { duration: '1m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '1m', target: 200 },
        { duration: '1m', target: 50 },
      ],
      preAllocatedVUs: 100,
      maxVUs: 500,
      startTime: '12m',
      exec: 'testConcurrentOperations',
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<100', 'p(99)<200'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.01'],
    cache_hits: ['rate>0.8'],
    db_query_duration: ['p(95)<50'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:9090';
const ADMIN_TOKEN = __ENV.ADMIN_TOKEN || 'test-admin-token';

function randomVehicleId() {
  return `vehicle-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`;
}

function randomUserId() {
  return `user-${String(Math.floor(Math.random() * 500)).padStart(4, '0')}`;
}

// Test database query performance
export function testDatabaseQueries() {
  const queries = [
    // Active rentals query
    {
      url: `${BASE_URL}/api/v1/admin/active-rentals`,
      name: 'active_rentals',
    },
    // User bookings query
    {
      url: `${BASE_URL}/api/v1/bookings?userId=${randomUserId()}`,
      name: 'user_bookings',
    },
    // Available vehicles query
    {
      url: `${BASE_URL}/api/v1/listings?status=available`,
      name: 'available_vehicles',
    },
    // Vehicle status query
    {
      url: `${BASE_URL}/api/v1/safehalt/status/${randomVehicleId()}`,
      name: 'vehicle_status',
    },
  ];
  
  const query = queries[Math.floor(Math.random() * queries.length)];
  
  const res = http.get(query.url, {
    headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` },
    tags: { name: query.name },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 100ms': (r) => r.timings.duration < 100,
  });
  
  dbQueryTime.add(res.timings.duration);
  errorRate.add(!success);
}

// Test cache performance
export function testCachePerformance() {
  const cacheableEndpoints = [
    `${BASE_URL}/api/v1/listings/${Math.floor(Math.random() * 100)}`,
    `${BASE_URL}/api/v1/auth/me`,
    `${BASE_URL}/api/v1/lister/dashboard`,
    `${BASE_URL}/api/v1/drivers/dashboard`,
  ];
  
  const endpoint = cacheableEndpoints[Math.floor(Math.random() * cacheableEndpoints.length)];
  
  const res = http.get(endpoint, {
    headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` },
  });
  
  const cacheHeader = res.headers['X-Cache'];
  const isCacheHit = cacheHeader === 'HIT';
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'cached response < 10ms': (r) => !isCacheHit || r.timings.duration < 10,
  });
  
  cacheHitRate.add(isCacheHit);
  errorRate.add(!success);
}

// Test Redis state updates
export function testRedisUpdates() {
  const vehicleId = randomVehicleId();
  const gpsData = {
    vehicleId,
    lat: 6.5244 + (Math.random() - 0.5) * 0.1,
    lng: 3.3792 + (Math.random() - 0.5) * 0.1,
    speed: Math.random() * 60,
    timestamp: new Date().toISOString(),
  };
  
  const res = http.post(
    `${BASE_URL}/api/v1/safehalt/telemetry`,
    JSON.stringify(gpsData),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
      },
    }
  );
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'redis update < 5ms': (r) => r.timings.duration < 5,
  });
  
  errorRate.add(!success);
}

// Test concurrent operations
export function testConcurrentOperations() {
  const operations = [
    // Create booking
    () => {
      const booking = {
        listingId: `listing-${Math.floor(Math.random() * 100)}`,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        fullName: 'Load Test User',
        email: 'loadtest@example.com',
        phone: '+2348012345678',
      };
      
      return http.post(
        `${BASE_URL}/api/v1/bookings`,
        JSON.stringify(booking),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );
    },
    
    // Register rental session
    () => {
      const session = {
        vehicleId: randomVehicleId(),
        centerLat: 6.5244,
        centerLng: 3.3792,
        radiusKm: 10,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
      };
      
      return http.post(
        `${BASE_URL}/api/v1/safehalt/register`,
        JSON.stringify(session),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );
    },
    
    // Query active rentals
    () => {
      return http.get(
        `${BASE_URL}/api/v1/admin/active-rentals`,
        {
          headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` },
        }
      );
    },
    
    // Update vehicle location
    () => {
      const gpsData = {
        vehicleId: randomVehicleId(),
        lat: 6.5244 + (Math.random() - 0.5) * 0.1,
        lng: 3.3792 + (Math.random() - 0.5) * 0.1,
        speed: Math.random() * 60,
        timestamp: new Date().toISOString(),
      };
      
      return http.post(
        `${BASE_URL}/api/v1/safehalt/telemetry`,
        JSON.stringify(gpsData),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );
    },
  ];
  
  const operation = operations[Math.floor(Math.random() * operations.length)];
  const res = operation();
  
  const success = check(res, {
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  errorRate.add(!success);
}
