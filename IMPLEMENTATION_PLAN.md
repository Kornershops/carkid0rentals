# CarKid0 Rentals - Implementation Plan

Complete Task Breakdown for Phases 2 to 4

---

## Overview

Current Status: Phase 1 Complete, Phase 2 In Progress
Timeline: 6 weeks remaining (Phases 2 to 4)
Focus: Safe-Halt Anti-Theft System for Eco-Gig Vehicles

---

## Phase 2: IoT Integration (Weeks 3 to 4)

Status: IN PROGRESS
Duration: 2 weeks
Goal: Connect backend to vehicle hardware and implement real-time tracking

### Week 3 Tasks

Task 2.1: Wialon or Gurtam API Integration
Priority: HIGH
Estimated Time: 3 days
Dependencies: None

Steps:
1. Research and select between Wialon and Gurtam
   - Compare pricing models
   - Review API documentation
   - Test API sandbox environment
   - Decision: Choose one platform

2. Set up API credentials
   - Create developer account
   - Generate API keys
   - Store in environment variables
   - Test authentication

3. Implement API client in Go
   - Create new package: apps/api/domain/telemetry
   - Build API wrapper functions
   - Add error handling
   - Write unit tests

4. Test basic commands
   - Send test unlock command
   - Receive GPS ping
   - Verify data format
   - Log all responses

Files to Create:
- apps/api/domain/telemetry/client.go
- apps/api/domain/telemetry/types.go
- apps/api/domain/telemetry/client_test.go
- apps/api/.env (add TELEMETRY_API_KEY)

Acceptance Criteria:
- Can authenticate with telemetry platform
- Can send unlock command successfully
- Can receive GPS data in real-time
- All tests passing

---

Task 2.2: Hardware Command Protocol
Priority: HIGH
Estimated Time: 2 days
Dependencies: Task 2.1

Steps:
1. Define command structure
   - UNLOCK vehicle
   - LOCK vehicle
   - SET_GEOFENCE (coordinates)
   - SET_HEARTBEAT (interval in seconds)
   - TRIGGER_BUZZER
   - ENABLE_LIMP_MODE (speed limit)
   - IMMOBILIZE

2. Implement command sender
   - Create command builder
   - Add validation
   - Queue commands if offline
   - Retry logic with exponential backoff

3. Implement response handler
   - Parse acknowledgment messages
   - Handle errors
   - Update vehicle status in Redis
   - Log all responses

4. Test with shadow vehicle
   - Send all command types
   - Verify acknowledgments
   - Check error handling
   - Monitor logs

Files to Create:
- apps/api/domain/telemetry/commands.go
- apps/api/domain/telemetry/responses.go
- apps/api/domain/telemetry/queue.go

Acceptance Criteria:
- All 7 command types working
- Commands queued when offline
- Retry logic functioning
- Response parsing accurate

---

Task 2.3: Variable Heartbeat Implementation
Priority: HIGH
Estimated Time: 2 days
Dependencies: Task 2.2

Steps:
1. Create heartbeat calculator
   - Input: rental duration
   - Output: ping interval (5, 30, or 60 seconds)
   - Add configuration table in database

2. Implement heartbeat setter
   - Called when rental starts
   - Sends SET_HEARTBEAT command to vehicle
   - Stores current interval in Redis
   - Logs interval change

3. Implement heartbeat resetter
   - Called when rental ends
   - Resets to default 60 seconds
   - Updates Redis
   - Logs reset

4. Test all scenarios
   - 30-minute rental (5 seconds)
   - 12-hour rental (30 seconds)
   - 3-day rental (60 seconds)
   - Verify actual ping rates

Files to Create:
- apps/api/domain/telemetry/heartbeat.go
- apps/api/domain/telemetry/heartbeat_test.go

Database Changes:
- Add heartbeat_config table
- Add current_heartbeat field to vehicles table

Acceptance Criteria:
- Correct interval calculated for all durations
- Commands sent successfully
- Ping rates verified in logs
- Redis updated correctly

---

### Week 4 Tasks

Task 2.4: Redis Hot State Implementation
Priority: HIGH
Estimated Time: 2 days
Dependencies: Task 2.3

Steps:
1. Design Redis schema
   - Key format: vehicle:{vehicleId}:state
   - Fields: lat, lon, speed, heading, timestamp
   - Key format: vehicle:{vehicleId}:rental
   - Fields: userId, startTime, endTime, geofence, status
   - TTL: 24 hours

2. Implement state updater
   - Receives GPS pings via MQTT
   - Parses location data
   - Updates Redis in under 5ms
   - Logs slow updates

3. Implement state reader
   - Fast lookup by vehicleId
   - Returns current location
   - Returns rental context
   - Caches for 1 second

4. Implement violation checker
   - Runs every GPS ping
   - Checks geofence boundary
   - Checks time expiry
   - Returns violation type or null

Files to Create:
- apps/api/domain/telemetry/redis_state.go
- apps/api/domain/telemetry/violation_checker.go
- apps/api/domain/telemetry/redis_state_test.go

Acceptance Criteria:
- State updates in under 5ms
- Violation checks in under 10ms
- Handles 1000 pings per second
- No data loss

---

Task 2.5: MQTT Listener Service
Priority: HIGH
Estimated Time: 2 days
Dependencies: Task 2.4

Steps:
1. Set up MQTT subscriber
   - Connect to EMQX broker
   - Subscribe to vehicle topics
   - Handle reconnection
   - Log connection status

2. Implement ping processor
   - Parse incoming GPS data
   - Validate data format
   - Update Redis state
   - Run violation checker

3. Implement violation handler
   - If violation detected
   - Trigger Safe-Halt protocol
   - Log to database
   - Send notifications

4. Add monitoring
   - Track ping rate per vehicle
   - Alert on missing pings
   - Monitor processing latency
   - Dashboard metrics

Files to Create:
- apps/api/domain/telemetry/mqtt_listener.go
- apps/api/domain/telemetry/ping_processor.go
- apps/api/domain/telemetry/violation_handler.go

Acceptance Criteria:
- Receives all GPS pings
- Processes in under 10ms
- Violations detected accurately
- No missed pings

---

Task 2.6: Shadow Pilot Dashboard
Priority: MEDIUM
Estimated Time: 2 days
Dependencies: Task 2.5

Steps:
1. Create admin dashboard page
   - Route: /dashboard/admin/shadow-pilot
   - Real-time vehicle map
   - Violation log table
   - Command history

2. Implement WebSocket updates
   - Push GPS updates to frontend
   - Push violation alerts
   - Update every 5 seconds
   - Handle disconnections

3. Add manual controls
   - Send test commands
   - Override shadow mode
   - View vehicle details
   - Export logs

4. Add analytics
   - Total pings received
   - Violations detected
   - False positive rate
   - Average response time

Files to Create:
- apps/web/src/app/dashboard/admin/shadow-pilot/page.tsx
- apps/web/src/components/shadow-pilot/VehicleMap.tsx
- apps/web/src/components/shadow-pilot/ViolationLog.tsx
- apps/web/src/components/shadow-pilot/CommandPanel.tsx
- apps/api/domain/telemetry/websocket.go

Acceptance Criteria:
- Real-time map updates
- Violations visible immediately
- Manual commands work
- Analytics accurate

---

## Phase 3: Safe-Halt Logic (Weeks 5 to 6)

Status: NOT STARTED
Duration: 2 weeks
Goal: Implement 4-stage escalation protocol and enforcement

### Week 5 Tasks

Task 3.1: 4-Stage Escalation Protocol
Priority: CRITICAL
Estimated Time: 3 days
Dependencies: Phase 2 complete

Steps:
1. Create escalation state machine
   - States: NORMAL, WARNING, LIMP_1, LIMP_2, IMMOBILIZED
   - Transitions based on distance and time
   - Store current state in Redis
   - Log all state changes

2. Implement Stage 1: Warning
   - Trigger: 500m from boundary OR 5 minutes left
   - Action: Send TRIGGER_BUZZER command
   - Action: Push notification to app
   - Action: Update state to WARNING
   - No speed restriction

3. Implement Stage 2: Limp Mode 1
   - Trigger: Boundary crossed OR time expired
   - Action: Send ENABLE_LIMP_MODE command (40 km/h)
   - Action: Flash hazard lights
   - Action: Push urgent notification
   - Action: Update state to LIMP_1

4. Implement Stage 3: Limp Mode 2
   - Trigger: 200m past boundary OR 2 minutes past expiry
   - Action: Send ENABLE_LIMP_MODE command (15 km/h)
   - Action: Hazard lights continuous
   - Action: Buzzer continuous
   - Action: Final warning notification
   - Action: Update state to LIMP_2

5. Implement Stage 4: Immobilization
   - Trigger: Speed drops below 5 km/h
   - Action: Send IMMOBILIZE command
   - Action: Log GPS location
   - Action: Alert admin dashboard
   - Action: SMS to lister
   - Action: Update state to IMMOBILIZED

Files to Create:
- apps/api/domain/safehalt/state_machine.go
- apps/api/domain/safehalt/escalation.go
- apps/api/domain/safehalt/stages.go
- apps/api/domain/safehalt/state_machine_test.go

Database Changes:
- Add safehalt_events table
- Fields: id, vehicleId, rentalId, stage, timestamp, location, reason

Acceptance Criteria:
- All 4 stages implemented
- Transitions happen correctly
- Commands sent successfully
- All events logged
- Never cuts engine at high speed

---

Task 3.2: Geofence Boundary Calculator
Priority: HIGH
Estimated Time: 2 days
Dependencies: Task 3.1

Steps:
1. Implement distance calculator
   - Use S2 Geometry library
   - Calculate distance from point to polygon
   - Handle complex polygon shapes
   - Optimize for speed (under 1ms)

2. Implement boundary checker
   - Input: current location, geofence polygon
   - Output: inside, outside, or distance to boundary
   - Cache results for 1 second
   - Handle edge cases

3. Implement warning zone
   - 500m buffer inside boundary
   - Trigger warning when entering buffer
   - Clear warning when moving away
   - Log all transitions

4. Test with real coordinates
   - Lagos city boundaries
   - Nairobi zones
   - Complex shapes
   - Edge cases

Files to Create:
- apps/api/domain/safehalt/geofence.go
- apps/api/domain/safehalt/distance.go
- apps/api/domain/safehalt/geofence_test.go

Acceptance Criteria:
- Accurate distance calculations
- Handles complex polygons
- Performance under 1ms
- No false positives

---

Task 3.3: Time Expiry Checker
Priority: HIGH
Estimated Time: 1 day
Dependencies: Task 3.1

Steps:
1. Implement expiry calculator
   - Input: rental start time, duration
   - Output: expiry timestamp
   - Store in Redis
   - Handle timezone correctly

2. Implement time checker
   - Compare current time to expiry
   - Calculate time remaining
   - Trigger warnings at 5 minutes
   - Trigger expiry at 0 minutes

3. Implement grace period
   - 2-minute grace after expiry
   - Only for Stage 2 to Stage 3 transition
   - No grace for immobilization
   - Log grace period usage

4. Test edge cases
   - Rental starts at midnight
   - Rental crosses DST change
   - Server time vs vehicle time
   - Offline scenarios

Files to Create:
- apps/api/domain/safehalt/expiry.go
- apps/api/domain/safehalt/expiry_test.go

Acceptance Criteria:
- Accurate time calculations
- Timezone handling correct
- Grace period works
- Edge cases handled

---

### Week 6 Tasks

Task 3.4: AI Inspection Integration
Priority: HIGH
Estimated Time: 3 days
Dependencies: None (parallel work)

Steps:
1. Research AI inspection providers
   - AiRentoSoft API
   - OpenCV custom model
   - AWS Rekognition
   - Google Vision API
   - Decision: Choose one

2. Implement video upload
   - Frontend: Record 10-second video
   - Upload to S3 or similar
   - Generate signed URL
   - Pass to AI API

3. Implement damage detection
   - Send video to AI API
   - Parse response (damage locations)
   - Compare before and after
   - Calculate damage severity

4. Implement decision logic
   - If new damage detected
   - Flag security deposit
   - Notify user immediately
   - Require acknowledgment
   - Block rental end until resolved

Files to Create:
- apps/api/domain/inspection/ai_client.go
- apps/api/domain/inspection/video_processor.go
- apps/api/domain/inspection/damage_detector.go
- apps/web/src/components/inspection/VideoRecorder.tsx
- apps/web/src/components/inspection/DamageReport.tsx

Database Changes:
- Add inspections table
- Fields: id, rentalId, type (start/end), videoUrl, damageDetected, damages (JSON), timestamp

Acceptance Criteria:
- Video upload works
- AI detection accurate
- Damage comparison works
- User cannot bypass

---

Task 3.5: Session Close Protocol
Priority: HIGH
Estimated Time: 2 days
Dependencies: Task 3.4

Steps:
1. Implement engine status checker
   - Query vehicle hardware
   - Check engine ON or OFF
   - Retry if no response
   - Timeout after 30 seconds

2. Implement door lock checker
   - Query vehicle hardware
   - Check all doors locked
   - Retry if no response
   - Timeout after 30 seconds

3. Implement zone checker
   - Get current GPS location
   - Check if inside return zone
   - Return zone can be different from rental zone
   - Allow 50m tolerance

4. Implement session closer
   - Run all 3 checks
   - If all pass: end rental
   - If any fail: show error to user
   - User cannot leave until all pass
   - Admin override available

Files to Create:
- apps/api/domain/rental/session_close.go
- apps/api/domain/rental/vehicle_status.go
- apps/api/domain/rental/session_close_test.go

Acceptance Criteria:
- All 3 checks working
- User cannot bypass
- Clear error messages
- Admin override works

---

Task 3.6: Offline-First Geofence Push
Priority: HIGH
Estimated Time: 2 days
Dependencies: Task 3.2

Steps:
1. Implement geofence packager
   - Convert polygon to hardware format
   - Add expiry timestamp
   - Add escalation rules
   - Compress data

2. Implement push mechanism
   - Send via MQTT at rental start
   - Verify receipt
   - Retry if failed
   - Log push status

3. Implement hardware enforcement
   - Vehicle enforces locally
   - No backend connection needed
   - Syncs when connection returns
   - Logs all local actions

4. Test offline scenarios
   - Start rental, go offline
   - Cross boundary while offline
   - Time expires while offline
   - Verify enforcement happens

Files to Create:
- apps/api/domain/safehalt/geofence_push.go
- apps/api/domain/safehalt/offline_enforcer.go

Acceptance Criteria:
- Geofence pushed successfully
- Works without connection
- Syncs when online
- No data loss

---

## Phase 4: Testing and Launch (Weeks 7 to 8)

Status: NOT STARTED
Duration: 2 weeks
Goal: Test system thoroughly and launch to production

### Week 7 Tasks

Task 4.1: 7-Day Shadow Pilot with 3 Vehicles
Priority: CRITICAL
Estimated Time: 7 days continuous
Dependencies: Phase 3 complete

Steps:
1. Select 3 test vehicles
   - Vehicle 1: Eco-Gig (Toyota Corolla)
   - Vehicle 2: Eco-Gig (Honda Civic)
   - Vehicle 3: Premium (Toyota Prado)
   - Install hardware in all 3
   - Configure in system

2. Create test scenarios
   - Scenario 1: Normal rental (no violations)
   - Scenario 2: Boundary violation
   - Scenario 3: Time expiry
   - Scenario 4: Both violations
   - Scenario 5: Offline enforcement
   - Scenario 6: AI inspection with damage
   - Scenario 7: Session close failure

3. Run continuous monitoring
   - Monitor all GPS pings
   - Log all violations
   - Track false positives
   - Measure response times
   - Record all anomalies

4. Daily review meetings
   - Review previous 24 hours
   - Analyze false positives
   - Tune sensitivity settings
   - Fix bugs immediately
   - Document learnings

Deliverables:
- Shadow pilot report
- False positive analysis
- Performance metrics
- Bug fixes implemented
- Tuning recommendations

Acceptance Criteria:
- All 7 scenarios tested
- False positive rate under 1 percent
- Response time under 5 seconds
- Zero critical bugs
- System stable for 7 days

---

Task 4.2: False Positive Analysis and Tuning
Priority: HIGH
Estimated Time: 2 days
Dependencies: Task 4.1 (runs in parallel)

Steps:
1. Collect false positive data
   - Log all violations
   - Mark false positives
   - Categorize by type
   - Calculate rate

2. Analyze root causes
   - GPS accuracy issues
   - Geofence boundary too tight
   - Time sync problems
   - Hardware delays

3. Implement tuning
   - Adjust geofence buffer
   - Add GPS accuracy filter
   - Implement smoothing algorithm
   - Add confidence scores

4. Re-test with tuning
   - Run same scenarios
   - Measure improvement
   - Iterate if needed
   - Document final settings

Files to Create:
- apps/api/domain/safehalt/tuning.go
- apps/api/domain/safehalt/accuracy_filter.go
- docs/TUNING_GUIDE.md

Acceptance Criteria:
- False positive rate under 1 percent
- No increase in false negatives
- Settings documented
- Tuning guide created

---

Task 4.3: Load Testing
Priority: HIGH
Estimated Time: 2 days
Dependencies: Task 4.1

Steps:
1. Set up load testing environment
   - Use k6 or Locust
   - Simulate 1000 vehicles
   - Each sending GPS pings
   - Realistic intervals

2. Test scenarios
   - Scenario 1: 1000 vehicles, 60-second pings
   - Scenario 2: 500 vehicles, 5-second pings
   - Scenario 3: Mixed intervals
   - Scenario 4: Spike test (sudden load)

3. Measure performance
   - Response times
   - Error rates
   - CPU usage
   - Memory usage
   - Redis performance
   - Database performance

4. Optimize bottlenecks
   - Add indexes if needed
   - Optimize queries
   - Increase Redis memory
   - Scale horizontally if needed

Files to Create:
- tests/load/vehicle_simulation.js
- tests/load/scenarios.js
- docs/LOAD_TEST_RESULTS.md

Acceptance Criteria:
- Handles 1000 vehicles
- Response time under 100ms
- Error rate under 0.1 percent
- System stable under load

---

### Week 8 Tasks

Task 4.4: Security Audit
Priority: HIGH
Estimated Time: 2 days
Dependencies: None (parallel work)

Steps:
1. Code security review
   - Check for SQL injection
   - Check for XSS vulnerabilities
   - Review authentication logic
   - Review authorization logic
   - Check for secrets in code

2. API security testing
   - Test all endpoints
   - Try unauthorized access
   - Test rate limiting
   - Test input validation
   - Test error handling

3. Hardware security review
   - Review MQTT authentication
   - Check command encryption
   - Review key management
   - Test replay attacks
   - Test man-in-the-middle

4. Fix all findings
   - Prioritize by severity
   - Fix critical immediately
   - Document all fixes
   - Re-test after fixes

Deliverables:
- Security audit report
- List of vulnerabilities found
- All fixes implemented
- Security checklist

Acceptance Criteria:
- Zero critical vulnerabilities
- All high severity fixed
- Medium severity documented
- Security checklist complete

---

Task 4.5: Documentation Completion
Priority: MEDIUM
Estimated Time: 2 days
Dependencies: All previous tasks

Steps:
1. Update API documentation
   - Document all new endpoints
   - Add request/response examples
   - Document error codes
   - Add authentication guide

2. Create operator manual
   - How to monitor system
   - How to handle alerts
   - How to override commands
   - Troubleshooting guide

3. Create deployment guide
   - Production setup steps
   - Environment variables
   - Database migrations
   - Monitoring setup

4. Create runbooks
   - Incident response procedures
   - Escalation procedures
   - Recovery procedures
   - Maintenance procedures

Files to Create:
- docs/API_DOCUMENTATION.md
- docs/OPERATOR_MANUAL.md
- docs/DEPLOYMENT_GUIDE.md
- docs/RUNBOOKS.md

Acceptance Criteria:
- All documentation complete
- Reviewed by team
- No missing sections
- Clear and actionable

---

Task 4.6: Production Deployment
Priority: CRITICAL
Estimated Time: 1 day
Dependencies: All previous tasks

Steps:
1. Pre-deployment checklist
   - All tests passing
   - Security audit complete
   - Documentation complete
   - Backup procedures ready
   - Rollback plan ready

2. Deploy to production
   - Deploy backend first
   - Run database migrations
   - Deploy frontend
   - Verify health checks
   - Monitor for errors

3. Enable for 1 vehicle
   - Select most reliable vehicle
   - Enable live enforcement
   - Monitor closely for 24 hours
   - Be ready to disable

4. Gradual rollout
   - Day 1: 1 vehicle
   - Day 2: 3 vehicles
   - Day 3: 10 vehicles
   - Week 2: 50 vehicles
   - Month 1: All vehicles

Deliverables:
- Production deployment complete
- Monitoring dashboards live
- On-call rotation set up
- Incident response ready

Acceptance Criteria:
- Zero downtime deployment
- All health checks passing
- Monitoring working
- First vehicle live

---

Task 4.7: Post-Launch Monitoring
Priority: CRITICAL
Estimated Time: Ongoing
Dependencies: Task 4.6

Steps:
1. Set up monitoring dashboards
   - Vehicle status dashboard
   - Violation dashboard
   - Performance dashboard
   - Error dashboard

2. Set up alerts
   - High error rate
   - Slow response times
   - Missing GPS pings
   - Failed commands
   - System down

3. Daily review process
   - Review previous 24 hours
   - Check all metrics
   - Investigate anomalies
   - Document issues
   - Plan fixes

4. Weekly review process
   - Review previous week
   - Calculate KPIs
   - Identify trends
   - Plan improvements
   - Update roadmap

Deliverables:
- Monitoring dashboards
- Alert rules configured
- Daily review template
- Weekly review template

Acceptance Criteria:
- All dashboards working
- Alerts firing correctly
- Review process established
- Team trained

---

## Summary

Total Tasks: 23 tasks across 3 phases
Total Duration: 6 weeks
Critical Path: Phase 2 -> Phase 3 -> Phase 4

Phase 2 (Weeks 3 to 4): 6 tasks - IoT Integration
Phase 3 (Weeks 5 to 6): 6 tasks - Safe-Halt Logic
Phase 4 (Weeks 7 to 8): 7 tasks - Testing and Launch
Ongoing: 4 tasks - Monitoring and Operations

Key Milestones:
- End of Week 4: IoT integration complete
- End of Week 6: Safe-Halt logic complete
- End of Week 7: Shadow pilot complete
- End of Week 8: Production launch

Success Criteria:
- All 23 tasks completed
- Zero critical bugs
- False positive rate under 1 percent
- System stable under load
- First vehicle live in production

---

## Resource Requirements

Development Team:
- 2 Backend Engineers (Go)
- 1 Frontend Engineer (Next.js)
- 1 DevOps Engineer
- 1 QA Engineer
- 1 Product Manager

Hardware:
- 3 test vehicles with GPS trackers
- MQTT broker (EMQX)
- Redis cluster
- PostgreSQL database

External Services:
- Wialon or Gurtam API
- AI inspection API
- SMS gateway
- Push notification service

Budget Estimate:
- Hardware: 500,000 Naira
- API subscriptions: 200,000 Naira per month
- Cloud infrastructure: 300,000 Naira per month
- Total: 1,000,000 Naira setup + 500,000 Naira per month

---

## Risk Management

High Risks:
1. Hardware integration delays
   - Mitigation: Start early, have backup provider
2. False positive rate too high
   - Mitigation: Extensive tuning, shadow pilot
3. Performance issues at scale
   - Mitigation: Load testing, horizontal scaling
4. Security vulnerabilities
   - Mitigation: Security audit, penetration testing

Medium Risks:
1. AI inspection accuracy
   - Mitigation: Test multiple providers
2. Offline enforcement reliability
   - Mitigation: Extensive offline testing
3. User adoption resistance
   - Mitigation: Clear communication, training

Low Risks:
1. Documentation incomplete
   - Mitigation: Dedicated time allocated
2. Monitoring gaps
   - Mitigation: Comprehensive dashboard setup

---

Status: Implementation Plan Ready
Next Step: Begin Phase 2 Task 2.1
Last Updated: 2026-05-11
