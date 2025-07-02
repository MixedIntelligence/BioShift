# Getting Sing App React Working (2025)

## Steps Taken to Fix and Run the Project

### 1. Dependency Issues
- The project originally referenced React 18, but many dependencies (like `connected-react-router`) only supported React 16/17.
- We downgraded React and ReactDOM to version 17 in `package.json` and set the `resolutions` field to enforce this.
- We removed or replaced broken GitHub dependencies (e.g., `bootstrap_calendar`, `flot.dashes`, `messenger`).
- We force-installed dependencies using `--legacy-peer-deps` to bypass peer dependency conflicts.

### 2. SCSS/CSS Issues
- The `awesome-bootstrap-checkbox` library expected Bootstrap 3 variables and mixins, but the project uses Bootstrap 5.
- We defined missing variables and mixins (e.g., `$brand-primary`, `$brand-danger`, `$input-border`, `tab-focus`, `scale`, `transition`, etc.) in `theme.scss` before importing `awesome-bootstrap-checkbox`.
- We removed Messenger CSS imports because the files were missing and the package is outdated.

### 3. React 18+ API Usage
- The codebase used the React 18+ `createRoot` API, which does not exist in React 17.
- We updated `src/index.js` to use `ReactDOM.render` instead of `createRoot`.

### 4. Cleaning and Reinstalling
- We deleted `node_modules` and `package-lock.json` and reinstalled everything to ensure only React 17 was present.
- We ran `npm dedupe` to remove duplicate React installations.

### 5. Final Steps
- After all fixes, the app compiled and ran successfully with `npm start`.

## Potential Problems & Warnings
- Some dependencies are outdated and may not be maintained.
- The SCSS workaround for Bootstrap 3/5 compatibility is fragile; future updates to dependencies may break it.
- If you upgrade to React 18+, you must update all code and dependencies to be compatible.
- If you add new dependencies, always check for React and Bootstrap compatibility.
- There are still some deprecation warnings in the SCSS output (e.g., division, color functions) that should be addressed for long-term maintainability.

## Summary
This project now runs on React 17 and Bootstrap 5, with compatibility shims for legacy SCSS. If you encounter new errors, check for missing variables/mixins or version mismatches.
