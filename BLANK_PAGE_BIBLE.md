# BLANK PAGE BIBLE

## Purpose
This document is a permanent, living diagnostic and solution guide for all blank page issues in the BioMVP (LabLeap) React/Redux application. It is intended to be the single source of truth for troubleshooting, root cause analysis, and permanent fixes for blank page and navigation failures.

---

## Common Root Causes

### 1. Race Condition in Authentication Initialization
- **Symptom:** Blank page after login or on protected routes.
- **Root Cause:** The app attempted to render protected routes before the authentication state was fully initialized. This caused components to render with missing or invalid user/auth data, resulting in blank screens or infinite redirects.
- **Key Finding:** The async `doInit()` (auth initialization) was not awaited before rendering routes, so the app could not reliably determine if a user was authenticated.

### 2. <Redirect> Used Outside <Router>
- **Symptom:** Console error: `Invariant failed: You should not use <Redirect> outside a <Router>`.
- **Root Cause:** The app returned a `<Redirect>` component before the router context was mounted, violating React Router rules and causing a crash.

### 3. Backend/API Connectivity Issues
- **Symptom:** Registration/login fails, blank page, or 500/ERR_CONNECTION_REFUSED errors in console.
- **Root Cause:** The frontend could not reach the backend API (wrong port, backend not running, or CORS misconfiguration), so authentication failed and the app could not proceed.

---

## Diagnostic Steps
1. **Check Console for Errors:**
   - Look for React errors, especially about `<Redirect>` or minified React error codes (e.g., #185).
   - Look for network errors (e.g., 500, ERR_CONNECTION_REFUSED) on API calls.
2. **Check Redux State:**
   - Confirm `auth.loadingInit` and `auth.currentUser` are set as expected after login.
3. **Check App.js Render Logic:**
   - Ensure the router is only rendered after auth state is initialized.
   - Do not return `<Redirect>` outside the router context.
4. **Check Backend Connectivity:**
   - Ensure the backend server is running and accessible at the expected URL/port.
   - Check `.env` and config files for correct API URLs.

---

## Solutions & Fixes

### 1. Wait for Auth Initialization
- Add a `loadingInit` flag to Redux auth state.
- In `App.js`, render a loading screen until `loadingInit` is false, then render the router.
- Let route components handle redirects, not the top-level app.

### 2. Fix <Redirect> Usage
- Never return `<Redirect>` outside a router context.
- Move all redirects into route components or inside the router.

### 3. Backend/API
- Start the backend server and ensure it is accessible.
- Set correct API URLs in `.env` and config files.
- Enable CORS for frontend origin if needed.

---

## Additional Notes
- If you see minified React errors, use the [React error decoder](https://reactjs.org/docs/error-decoder.html) for details.
- Always check both frontend and backend logs for clues.
- Document all changes and fixes in this file for future reference.

---

_Last updated: July 9, 2025_
