# Copilot Recovery Plan

## 1. Backend API (v9) – Stabilize and Test ✅ COMPLETED

- ✅ Test `/api/auth/register` and `/api/auth/login` endpoints with Postman/curl for all roles (Lab, Worker, Provider).
- ✅ Check error handling for duplicate emails, invalid input, and missing fields.
- ✅ Verify JWT generation and that `/api/users/me` returns correct user info with a valid token.
- ✅ Add missing validation or error messages as needed.

### Status: COMPLETED - All authentication endpoints working correctly

- Worker registration/login: Working
- Lab registration/login: Working
- Provider registration/login: Working (with company validation)
- JWT token generation/validation: Working
- Error handling: Working (400 for validation, 401 for auth, 409 for duplicates)

## 2. Frontend (v9) – Connect and Polish

- Landing Page:
  - Ensure clear navigation to Register and Login.

- Registration Flow:
  - Role selection (Lab, Worker, Provider).
  - Registration form fields: email, password, (company/website for Provider).
  - On submit: POST to `/api/auth/register`.
  - On success: Store JWT (localStorage/sessionStorage), redirect to dashboard/onboarding.

- Login Flow:
  - Login form: email, password.
  - On submit: POST to `/api/auth/login`.
  - On success: Store JWT, redirect to dashboard.

- JWT Handling:
  - Store JWT securely.
  - Attach JWT to Authorization header for authenticated API requests.
  - On app load, check for JWT and auto-login if valid.

- User Dashboard/Onboarding:
  - After login/registration, fetch `/api/users/me` to get user info.
  - Show onboarding steps or dashboard based on user role.

## 3. Error Handling & UX

- Show clear error messages for registration/login failures.
- Loading indicators during API calls.
- Redirects for authenticated/unauthenticated users as appropriate.

## 4. Testing

- Manual:
  - Register and login as each role.
  - Try invalid/duplicate emails, wrong passwords, etc.

- Automated:
  - Add/expand Jest/Supertest tests for backend auth endpoints.
  - Add frontend tests for registration/login flows if possible.

## 5. Next Steps (After Onboarding)

- Profile completion (skills, education, etc.).
- Email verification (optional).
- Password reset flow.
- Security review (rate limiting, brute force protection, etc.).

---

**Ready to start?**
Let me know if you want to begin with backend endpoint testing, frontend wiring, or a specific bug/feature!
