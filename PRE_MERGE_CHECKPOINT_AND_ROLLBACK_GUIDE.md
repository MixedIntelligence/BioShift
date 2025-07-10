# BioShiftv9 Pre-Merge Checkpoint & Rollback Guide

## Purpose
This document details the current state of the `BioShiftv9` and `local-dev` branches, the fixes applied, and provides a step-by-step guide for safely merging changes and rolling back if needed. It is intended as a technical checkpoint and operational safety net before finalizing the merge to production.

---

## 1. Current State

### Branches
- **BioShiftv9**: Production branch, currently live and stable.
- **local-dev**: Development branch with latest fixes and improvements.

### Key Files Modified
- `src/components/Layout/Layout.js` (main router, sidebar, route guards)
- `src/pages/landing/Landing.js` (landing page content)
- `src/pages/landing/Landing.module.scss` (landing page styles)

### Main Fixes & Improvements
- **Navigation/Sidebar**: All main routes (Browse Gigs, My Profile, Edit Profile, Chat, Messages) now display real content, not placeholders.
- **Router Fix**: Corrected import path for Messages component in `/app/inbox` route to `../Notifications/notifications-demo/Messages`.
- **Landing Page**: Replaced with pre-alpha pilot marketing content, direct CTA to Google Form, and bio-organic, inviting design.
- **Style Overhaul**: Modern gradients, glows, rounded cards, Orbitron/Exo fonts, improved readability, removed broken SVG references.
- **Manual Edits**: All recent changes in `Layout.js`, `Landing.js`, and `Landing.module.scss` have been manually reviewed and tested locally.

---

## 2. Creating a Checkpoint (Savepoint)

Before merging, create a commit in `local-dev` to mark the current state:

```powershell
git add .
git commit -m "Checkpoint: Pre-production savepoint before merging to BioShiftv9"
git push
```

---

## 3. Recording the Current Production Commit (for Rollback)

Switch to the production branch and record the latest commit hash:

```powershell
git checkout BioShiftv9
git log -1 --oneline
```

- **Copy the commit hash** (e.g., `abcd1234`).
- This is your rollback point if the merge causes issues.

---

## 4. Merging `local-dev` into `BioShiftv9`

```powershell
git checkout BioShiftv9
git merge local-dev
git push
```

- Resolve any merge conflicts if prompted.
- Test the site thoroughly after the merge.

---

## 5. Rollback Procedure (if needed)

If the site is broken after the merge, you can restore the previous production state:

```powershell
git checkout BioShiftv9
git reset --hard <commit-hash>
git push --force
```

- Replace `<commit-hash>` with the hash you recorded earlier.
- This will force the production branch back to its pre-merge state.

---

## 6. Summary of Fixes
- All main routes now render their intended content.
- Landing page is visually and functionally correct for pre-alpha pilot.
- All changes are versioned and ready for production deployment.
- Rollback plan is in place for safety.

---

## 7. Additional Notes
- All commands are for Windows PowerShell.
- Always verify the site after merging.
- Keep this document for future reference and operational safety.

---

**Prepared by GitHub Copilot on July 10, 2025**
