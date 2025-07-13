# Checkpoint: BioShift v9.95 Alpha Release

**Date:** 2025-07-13

## Summary
- Added Lab Info and FAQ support for gigs (backend, database, frontend)
- Updated database schema: gigs table now includes `lab_info` and `faq` columns
- Backend API and model updated to support new fields
- Frontend Gig Details page now displays and allows labs to edit Lab Info and FAQ
- Migration script updated and executed successfully
- Fixed ESLint errors and removed deprecated components

## Migration Steps
- Ran migration script to add `lab_info` and `faq` columns to gigs table
- Verified schema update

## Release Steps
1. Commit all changes
2. Merge local-dev into BioShiftv9 branch
3. Push BioShiftv9 branch to remote
4. Tag as v9.95 alpha

## Next Actions
- Test Lab Info and FAQ workflow in production
- Collect feedback from labs and users
- Prepare for v10 feature planning

---
This checkpoint marks the official release of BioShift v9.95 alpha, with enhanced gig management and lab communication features.
