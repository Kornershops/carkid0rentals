import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  scenarios: {
    // Scenario 1: 1000 vehicles with 60-second pings (baseline)
    baseline_load: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '5m',
      startTime: '0s',
      exec: 'baselineScenario',
    },
    
    // Scenario 2: 500 vehicles with 5-second pings (high frequency)
    high_frequency: {
      executor: 'constant-vus',
      vus: 500,
      duration: '5m',
      startTime: '6m',
      exec: 'highFrequencyScenario',
    },
    
    // Scenario 3: Mixed intervals (realistic)
    mixed_load: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '5m',
      startTime: '12m',
      exec: 'mixedScenario',
    },
    
    // Scenario 4: Spike test (sudden load)
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 2000 },
        { duration: '1m', target: 2000 },
        { duration: '30s', target: 0 },
      ],
      startTime: '18m',
      exec: 'spikeScenario',
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<100', 'p(99)<200'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:9090';
const ADMIN_TOKEN = __ENV.ADMIN_TOKEN || 'test-admin-token';

// Generate mock vehicle data
function generateVehicleId() {
  const vu = __VU;
  return `vehicle-${String(vu).padStart(4, '0')}`;
}

function generateGPSData(vehicleId, scenario = 'normal') {
  const baseLatLagos = 6.5244;
  const baseLngLagos = 3.3792;
  
  // Add random offset (within 10km radius)
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;
  
  let lat = baseLatLagos + latOffset;
  let lng = baseLngLagos + lngOffset;
  let speed = Math.random() * 60; // 0-60 km/h
  
  // Simulate violations for some vehicles
  if (scenario === 'violation' && Math.random() < 0.1) {
    // 10% of vehicles violate boundary
    lat += 0.2; // Move outside geofence
  }
  
  return {
    vehicleId,
    lat,
    lng,
    speed,
    timestamp: new Date().toISOString(),
  };
}

// Scenario 1: Baseline (60-second pings)
export function baselineScenario() {
  const vehicleId = generateVehicleId();
  const gpsData = generateGPSData(vehicleId);
  
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
    'response time < 100ms': (r) => r.timings.duration < 100,
  });
  
  errorRate.add(!success);
  sleep(60); // 60-second interval
}

// Scenario 2: High frequency (5-second pings)
export function highFrequencyScenario() {
  const vehicleId = generateVehicleId();
  const gpsData = generateGPSData(vehicleId);
  
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
    'response time < 50ms': (r) => r.timings.duration < 50,
  });
  
  errorRate.add(!success);
  sleep(5); // 5-second interval
}

// Scenario 3: Mixed intervals (realistic)
export function mixedScenario() {
  const vehicleId = generateVehicleId();
  const gpsData = generateGPSData(vehicleId, 'violation');
  
  // Randomly assign interval based on rental duration
  const intervals = [5, 30, 60];
  const weights = [0.2, 0.3, 0.5]; // 20% short, 30% medium, 50% long
  const rand = Math.random();
  let interval = 60;
  
  if (rand < weights[0]) {
    interval = 5;
  } else if (rand < weights[0] + weights[1]) {
    interval = 30;
  }
  
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
    'response time < 100ms': (r) => r.timings.duration < 100,
  });
  
  errorRate.add(!success);
  sleep(interval);
}

// Scenario 4: Spike test
export function spikeScenario() {
  const vehicleId = generateVehicleId();
  const gpsData = generateGPSData(vehicleId);
  
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
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  errorRate.add(!success);
  sleep(1);
}

// Test other endpoints
export function testActiveRentals() {
  const res = http.get(
    `${BASE_URL}/api/v1/admin/active-rentals`,
    {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
      },
    }
  );
  
  check(res, {
    'active rentals status is 200': (r) => r.status === 200,
    'active rentals response time < 50ms': (r) => r.timings.duration < 50,
  });
}

export function testVehicleStatus() {
  const vehicleId = generateVehicleId();
  
  const res = http.get(
    `${BASE_URL}/api/v1/safehalt/status/${vehicleId}`,
    {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
      },
    }
  );
  
  check(res, {
    'vehicle status is 200': (r) => r.status === 200,
    'vehicle status response time < 20ms': (r) => r.timings.duration < 20,
  });
}
