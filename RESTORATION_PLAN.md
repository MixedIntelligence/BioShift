# BioShift v9 Frontend Restoration Plan

## Objective
Restore the design and structure of the `v9` development environment to match the `reference-git` folder, while ensuring the blank page/infinite redirect issue is never reintroduced.

## Critical Rule
- **Never re-introduce the blank page or infinite redirect issue.**
  - Redux authentication state (`currentUser`, `isAuthenticated`) must always be set and read correctly.
  - Route guards (like `UserRoute`) must wait for auth state initialization and use Redux props, not `window.store`.
  - All routing and layout logic must be robust against race conditions and state mismatches.

## Step-by-Step Plan

### 1. Audit and Compare
- Compare all relevant files in `v9` and `reference-git`:
  - Sidebar (`Sidebar.js`, `LinksGroup.js`, SCSS)
  - Layout and global styles (`Layout.js`, `app.scss`, `_variables.scss`)
  - Any theme or context providers
  - Route guards and Redux auth logic

### 2. Restore Design
- For each file/component that differs:
  - Restore the code and styles from `reference-git` to `v9`.
  - **BUT:** Carefully preserve the Redux auth flow and route guard logic that fixed the blank page issue.
  - Do not overwrite any logic that was part of the blank page fix.

### 3. Test After Each Change
- After restoring each major component or style:
  - Test login, navigation, and all protected routes.
  - Ensure the blank page/infinite redirect does NOT return.
  - Use Redux DevTools and browser console to verify state and error-free operation.

### 4. Final Review
- Confirm the design in `v9` matches `reference-git` pixel-perfectly.
- Confirm the blank page issue is still resolved.
- Clean up any debug code, console warnings, or missing asset errors.

---

**Summary:**
- The design in `v9` must match `reference-git`.
- The blank page/infinite redirect issue must NOT return.
- Every change will be tested to ensure both goals are met.
