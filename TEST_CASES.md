# COMPREHENSIVE TEST CASES - MOVIE BOOKING SYSTEM

## USER MODULE TEST CASES

### AUTHENTICATION TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| AUTH-001 | Valid Login | User successfully authenticated and redirected to dashboard |
| AUTH-002 | Valid Registration | New user account created and logged in |
| AUTH-003 | Email Login | User can login with email instead of username |
| AUTH-004 | Password Reset | User receives reset link and can reset password |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| AUTH-NEG-001 | Invalid Email | Shows "Invalid email format" error |
| AUTH-NEG-002 | Weak Password | Shows "Password must be 8+ characters with uppercase, lowercase, number, special char" |
| AUTH-NEG-003 | SQL Injection | Input sanitized and blocked |
| AUTH-NEG-004 | XSS Attempt | Script tags removed from input |
| AUTH-NEG-005 | Duplicate Email | Shows "User already exists" error |
| AUTH-NEG-006 | Empty Fields | Shows field-specific validation errors |

#### Edge Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| AUTH-EDGE-001 | Session Timeout | User logged out after inactivity |
| AUTH-EDGE-002 | Concurrent Login | Previous session invalidated |
| AUTH-EDGE-003 | Password Mismatch | Shows "Passwords do not match" |

### MOVIE BROWSING TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| MOVIE-001 | Load Movies | All active movies displayed with correct info |
| MOVIE-002 | Movie Details | Correct trailer, cast, director, story shown |
| MOVIE-003 | Search Movies | Filter results displayed correctly |
| MOVIE-004 | Theater Selection | Theaters filtered by location correctly |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| MOVIE-NEG-001 | Invalid Movie ID | Shows "Movie not found" error |
| MOVIE-NEG-002 | Malformed URL | Handled gracefully with error message |

### SEAT BOOKING TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| SEAT-001 | Select Seats | Seats visually highlighted and selectable |
| SEAT-002 | Lock Seats | Seats locked for 15 minutes |
| SEAT-003 | Complete Booking | Booking confirmed and payment processed |
| SEAT-004 | Multiple Seats | Correct total price calculated |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| SEAT-NEG-001 | Double Booking | Same seat cannot be booked twice |
| SEAT-NEG-002 | Concurrent Selection | Shows "Seats locked by another user" |
| SEAT-NEG-003 | Page Refresh | Lock status maintained after refresh |
| SEAT-NEG-004 | Invalid Seat | Shows "Seat not available" error |
| SEAT-NEG-005 | No Seats Selected | Shows "Please select seats" error |

#### Edge Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| SEAT-EDGE-001 | Lock Timeout | Seats automatically released after 15 minutes |
| SEAT-EDGE-002 | Payment Failure | Seats released on payment failure |
| SEAT-EDGE-003 | Network Error | User-friendly error message shown |

### PAYMENT TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| PAY-001 | Valid Card | Payment processed successfully |
| PAY-002 | Valid UPI | Payment processed successfully |
| PAY-003 | Wallet Payment | Balance deducted correctly |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| PAY--NEG-001 | Invalid Card | Shows "Invalid card details" error |
| PAY--NEG-002 | Insufficient Balance | Shows "Insufficient wallet balance" |
| PAY--NEG-003 | Expired Card | Shows "Card has expired" error |

### PROFILE MANAGEMENT TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| PROFILE-001 | Update Profile | Changes saved successfully |
| PROFILE-002 | Add Payment | Payment method added correctly |
| PROFILE-003 | View Bookings | All user bookings displayed |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| PROFILE-NEG-001 | Invalid Email | Shows "Please enter valid email" |
| PROFILE-NEG-002 | Invalid Phone | Shows "Please enter valid 10-digit number" |
| PROFILE-NEG-003 | Numbers in Name | Shows "Name should only contain letters" |

## ADMIN MODULE TEST CASES

### ADMIN AUTHENTICATION TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-001 | Valid Admin Login | Admin authenticated and redirected to admin panel |
| ADMIN-002 | Correct Credentials | Admin dashboard accessible |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-NEG-001 | Invalid Password | Shows "Invalid credentials" |
| ADMIN-NEG-002 | Non-Admin Access | Regular user cannot access admin panel |
| ADMIN-NEG-003 | SQL Injection | Input sanitized and blocked |

### MOVIE MANAGEMENT TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-MOVIE-001 | Add Movie | Movie created with all details |
| ADMIN-MOVIE-002 | Edit Movie | Movie updated successfully |
| ADMIN-MOVIE-003 | Delete Movie | Movie removed from system |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-MOVIE-NEG-001 | Duplicate Title | Shows "Movie already exists" |
| ADMIN-MOVIE-NEG-002 | Invalid Price | Shows "Price must be positive" |
| ADMIN-MOVIE-NEG-003 | Delete with Bookings | Shows "Cannot delete movie with active bookings" |
| ADMIN-MOVIE-NEG-004 | Invalid Rating | Shows "Rating must be 0-10" |
| ADMIN-MOVIE-NEG-005 | XSS in Title | Script tags sanitized |

### SHOW MANAGEMENT TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-SHOW-001 | Add Show | Show created successfully |
| ADMIN-SHOW-002 | Delete Show | Show removed without affecting bookings |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-SHOW-NEG-001 | Invalid Time | Shows "Invalid time format" |
| ADMIN-SHOW-NEG-002 | Past Date | Shows "Date cannot be in the past" |
| ADMIN-SHOW-NEG-003 | Zero Seats | Shows "Available seats must be greater than 0" |

### USER MANAGEMENT TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-USER-001 | View Users | All users listed correctly |
| ADMIN-USER-002 | Search Users | Filter results accurate |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-USER-NEG-001 | Unauthorized Access | Non-admin users blocked |

### BOOKING MANAGEMENT TESTS

#### Positive Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-BOOKING-001 | View Bookings | All bookings displayed with filters |
| ADMIN-BOOKING-002 | Cancel Booking | Status updated to "cancelled" |

#### Negative Cases
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ADMIN-BOOKING-NEG-001 | Invalid Filter | Shows appropriate error message |

## SECURITY TEST CASES

### AUTHENTICATION SECURITY
| Test ID | Threat | Scenario | Expected Result |
|----------|--------|-----------|----------------|
| SEC-AUTH-001 | Privilege Escalation | Regular user cannot access admin endpoints |
| SEC-AUTH-002 | Session Hijacking | Invalid tokens rejected |
| SEC-AUTH-003 | Brute Force | Account locked after multiple failed attempts |

### INPUT VALIDATION SECURITY
| Test ID | Threat | Scenario | Expected Result |
|----------|--------|-----------|----------------|
| SEC-INPUT-001 | SQL Injection | All inputs sanitized |
| SEC-INPUT-002 | XSS Attacks | Script tags removed |
| SEC-INPUT-003 | CSRF Attacks | CSRF tokens implemented |
| SEC-INPUT-004 | Large Payloads | Input size limits enforced |

### API SECURITY
| Test ID | Threat | Scenario | Expected Result |
|----------|--------|-----------|----------------|
| SEC-API-001 | Unauthorized Access | 401 returned for protected endpoints |
| SEC-API-002 | Rate Limiting | 429 returned after excessive requests |
| SEC-API-003 | Data Exposure | Sensitive data filtered from responses |

## PERFORMANCE TEST CASES

### LOAD TESTING
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| PERF-001 | Concurrent Users | System handles 100+ simultaneous users |
| PERF-002 | Large Data | System handles 1000+ movies efficiently |
| PERF-003 | Peak Load | Response time < 2 seconds under load |

### BOUNDARY TESTS

#### INPUT BOUNDARIES
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| BOUND-001 | Max Length | Handles maximum field lengths correctly |
| BOUND-002 | Min Values | Handles minimum values correctly |
| BOUND-003 | Zero Values | Handles zero/negative values appropriately |

#### DATA BOUNDARIES
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| BOUND-004 | Empty Database | System handles empty state gracefully |
| BOUND-005 | Corrupted Data | System recovers from data corruption |

## INTEGRATION TESTS

### API INTEGRATION
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| INT-001 | End-to-End Booking | Complete booking flow works |
| INT-002 | Payment Gateway | Payment integration works correctly |
| INT-003 | Email Service | Confirmation emails sent successfully |

### UI INTEGRATION
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| INT-UI-001 | Responsive Design | Works on mobile/tablet/desktop |
| INT-UI-002 | Browser Compatibility | Works on Chrome/Firefox/Safari/Edge |

## ERROR HANDLING TESTS

### USER ERROR SCENARIOS
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ERR-USER-001 | Network Failure | User-friendly error message shown |
| ERR-USER-002 | Server Error | Graceful degradation with clear messaging |
| ERR-USER-003 | Timeout | Request retry mechanism implemented |

### ADMIN ERROR SCENARIOS
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| ERR-ADMIN-001 | Concurrent Edit | Shows "Another admin is editing" |
| ERR-ADMIN-002 | Data Corruption | Admin can recover from backup |
| ERR-ADMIN-003 | Audit Trail | All admin actions logged |

## ACCESSIBILITY TESTS

### WCAG COMPLIANCE
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| A11Y-001 | Screen Reader | All elements properly labeled |
| A11Y-002 | Keyboard Navigation | Full keyboard accessibility |
| A11Y-003 | Color Contrast | WCAG AA contrast ratios met |

## REGRESSION TESTS

### FUNCTIONAL REGRESSION
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| REG-001 | Core Features | All existing functionality still works |
| REG-002 | Performance | No performance degradation |
| REG-003 | Security | No new security vulnerabilities |

### UI REGRESSION
| Test ID | Type | Scenario | Expected Result |
|----------|------|-----------|----------------|
| REG-UI-001 | Layout | No broken layouts |
| REG-UI-002 | Styling | CSS styles applied correctly |
| REG-UI-003 | Responsiveness | Mobile layout intact |

## TEST EXECUTION PRIORITY

### HIGH PRIORITY (Must Pass)
1. All Authentication Tests
2. SQL Injection Prevention
3. XSS Prevention
4. Seat Locking System
5. Admin Authorization
6. Input Validation

### MEDIUM PRIORITY
1. Performance Tests
2. Error Handling
3. Integration Tests
4. Accessibility Tests

### LOW PRIORITY
1. UI Regression Tests
2. Edge Case Handling
3. Documentation Updates

## AUTOMATION RECOMMENDATIONS

### UNIT TESTS
- Jest for React components
- Supertest for API endpoints
- Validation function unit tests

### INTEGRATION TESTS
- Cypress for end-to-end user flows
- Postman/Newman for API testing

### PERFORMANCE TESTS
- Lighthouse for performance auditing
- Artillery for load testing

### SECURITY TESTS
- OWASP ZAP for security scanning
- Burp Suite for penetration testing
