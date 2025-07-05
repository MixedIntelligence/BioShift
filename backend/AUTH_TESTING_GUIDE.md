# Auth Endpoints Manual Testing Guide

## Prerequisites
- Backend server running on port 8080
- curl installed (or use Postman)

## Test Commands

### 1. Health Check
```bash
curl -X GET http://localhost:8080/api/health
```
Expected: `{"status":"ok","message":"Backend is running."}`

### 2. Register a New User (Worker)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manual_test@example.com",
    "password": "password123",
    "role": "Worker"
  }'
```
Expected: `{"token":"eyJ..."}`

### 3. Register a Provider
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider_test@example.com",
    "password": "password123",
    "role": "Provider",
    "companyName": "Test Company",
    "website": "https://test-company.com"
  }'
```
Expected: `{"token":"eyJ..."}`

### 4. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manual_test@example.com",
    "password": "password123"
  }'
```
Expected: `{"token":"eyJ..."}`

### 5. Get Current User (Auth endpoint)
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
Expected: `{"id":1,"email":"manual_test@example.com","role":"Worker","created_at":"..."}`

### 6. Get Current User (Users endpoint)
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
Expected: `{"id":1,"email":"manual_test@example.com","role":"Worker","created_at":"..."}`

## Error Cases to Test

### Duplicate Email
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manual_test@example.com",
    "password": "password123",
    "role": "Worker"
  }'
```
Expected: `{"error":"Email already exists"}` (409 status)

### Invalid Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "wrongpassword"
  }'
```
Expected: `{"error":"Invalid credentials"}` (401 status)

### Missing Token
```bash
curl -X GET http://localhost:8080/api/auth/me
```
Expected: `{"error":"No token provided"}` (401 status)

### Invalid Token
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```
Expected: `{"error":"Invalid token"}` (403 status)

## Validation Tests

### Missing Required Fields
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```
Expected: `{"error":"password is required"}` (400 status)

### Invalid Email Format
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123"
  }'
```
Expected: `{"error":"email must be a valid email"}` (400 status)

### Provider Missing Company Info
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider2@example.com",
    "password": "password123",
    "role": "Provider"
  }'
```
Expected: `{"error":"companyName is required"}` (400 status)
