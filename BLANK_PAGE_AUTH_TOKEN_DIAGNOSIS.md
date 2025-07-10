# Blank Page Issue After Login: Redux Auth State & Token Expiry

## Problem Summary
- After login, navigating via the sidebar results in blank pages for all protected routes.
- Console logs show: `⏰ Token expired, clearing and proceeding without user` and `AUTH_INIT_SUCCESS with user: none`.
- This means Redux `currentUser` is always `none` after navigation, so all protected components render nothing or deny access.

## Root Cause
- The JWT token in localStorage is either missing, expired, or being cleared on every navigation.
- The authentication initialization (`doInit()`) runs on every route change and always finds no valid token.
- As a result, Redux state is reset and the user is effectively logged out, causing blank pages.

## How to Diagnose
1. Open browser dev tools and check the console after navigating to any sidebar link.
2. Look for logs about token expiry and Redux auth state.
3. Check localStorage for the presence and expiry of the JWT token after login.
4. If the token is missing or expired immediately after login, check backend token issuance logic.
5. If the token is present and valid, but `doInit()` still clears it, debug the expiry check in `auth.js`.

## How to Fix
- Ensure the backend issues a JWT token with a reasonable expiry (e.g., 1 hour or more).
- After login, verify that the token is stored in localStorage and is not expired.
- In `auth.js`, make sure the expiry check is correct and does not clear valid tokens.
- Only clear the token if it is truly expired.
- Avoid running `doInit()` unnecessarily on every navigation.

## Next Steps
- Delete all site data, restart the server, and login from a new browser window.
- If the issue persists, review the login flow and token handling in both frontend and backend.

---

*Created July 9, 2025 by Fractional CTO for BioShift/BioMVP*
