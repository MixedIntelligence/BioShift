# LabLeap: Beta Implementation Plan

**Objective:** This document outlines the final engineering tasks required to deliver a feature-complete MVP for the closed beta test. It is based on the architectural decisions made after the initial revival plan.

---

## 1. Core Feature Implementation

### Epic: The "Connect" Workflow

*This epic completes the core marketplace loop by allowing labs to formally accept applicants.*

**Backend Tasks:**
- [x] **Database Migration:** Add `status` (TEXT, default: 'pending') and `accepted_at` (DATETIME, nullable) columns to the `applications` table.
- [x] **Create "Accept" Endpoint:**
    - [x] Build a new endpoint: `POST /api/applications/:applicationId/accept`.
    - [x] This endpoint must be protected and only accessible by the Lab user who owns the corresponding gig.
    - [x] The endpoint will update the application's `status` to 'accepted' and set the `accepted_at` timestamp.
- [x] **Create "Reject" Endpoint:**
    - [x] Build a new endpoint: `POST /api/applications/:applicationId/reject`.
    - [x] This endpoint will update the application's `status` to 'rejected'.

**Frontend Tasks:**
- [x] **Add "Accept" and "Reject" Buttons:** In the "My Applicants" view, add "Accept" and "Reject" buttons to each applicant card.
- [x] **Connect Buttons to API:** Wire the buttons to call the new backend endpoints.
- [x] **Update UI on Action:** Upon successfully accepting or rejecting an applicant, update the UI to reflect the new status. The accepted applicant should be highlighted, and the others should be visually deprioritized.
- [x] **Display Contact Info:** When an application's status is 'accepted', display the scientist's contact email to the lab, and vice-versa.

---

### Epic: Document & Credential Management (MVP)

*This epic provides the basic functionality for scientists to upload documents and for labs to view them, with clear disclaimers.*

**Backend Tasks:**
- [x] **Database Migration:** Create a new `user_documents` table with columns for `document_id`, `user_id`, `file_name`, `file_path`, and `uploaded_at`.
- [x] **Create File Upload Endpoint:**
    - [x] Build a new endpoint: `POST /api/profile/documents`.
    - [x] Use a library like `multer` to handle file uploads and store files in a designated server directory (e.g., `/uploads/documents`).
    - [x] The endpoint will save the file metadata to the `user_documents` table.
- [x] **Create Document List Endpoint:** Build a `GET /api/profile/documents/:userId` endpoint to retrieve a list of a user's uploaded documents.

**Frontend Tasks:**
- [x] **Create `Documents` Component:** Build a new component in the profile section for managing documents.
- [x] **Implement File Upload UI:** Add a file input and "Upload" button to the `Documents` component.
- [x] **Display Document List:** Show a list of uploaded documents with an option to view/download.
- [x] **Add Disclaimers:** Add a prominent, non-dismissible disclaimer in the UI wherever documents are displayed, stating: "BioShift does not verify any uploaded credentials. Labs are responsible for their own due diligence."

---

### Epic: Notification System (MVP)

*This epic implements a simple notification system to keep users informed of key events.*

**Backend Tasks:**
- [x] **Database Migration:** Create a `notifications` table with columns for `notification_id`, `user_id`, `message`, `is_read` (BOOLEAN, default: false), and `created_at`.
- [x] **Create Notification Logic:** In the "Accept" and "Apply" backend logic, add steps to create a new notification in the database for the relevant user.
- [x] **Create Notification Endpoints:**
    - [x] `GET /api/notifications`: Fetches all unread notifications for the authenticated user.
    - [x] `POST /api/notifications/:notificationId/mark-read`: Marks a specific notification as read.

**Frontend Tasks:**
- [x] **Create `Notifications` Component:** Build a dropdown or panel in the main site header to display notifications.
- [x] **Implement Polling:** In the main `Layout.js` component, use `setInterval` to call the `GET /api/notifications` endpoint every 30 seconds.
- [x] **Display Notifications:** When new notifications are received, update a state variable to display a badge in the header. Clicking the notification icon should show the list of messages.
- [x] **Mark as Read:** When a user clicks on a notification, call the `POST /api/notifications/:notificationId/mark-read` endpoint.

---

## 2. Final Architectural Implementation

### Epic: Data Privacy & Visibility Rules

*This epic implements the agreed-upon hybrid data privacy model.*

**Backend Tasks:**
- [x] **Update `GET /api/users/:userId` Endpoint:**
    - [x] Modify the endpoint to check the role of the requesting user.
    - [x] If the requester is not a registered 'Lab', return only the public fields: `name`, `headline`, `skills`.
    - [x] If the requester is a 'Lab', return the extended profile information: `education`, `publications`, `documents`.
- [x] **Secure Contact Info:** Ensure that user email addresses are never returned from any public-facing API endpoint, except after an application is accepted.

---

## 3. Post-Beta Roadmap Considerations

*These items are out of scope for the beta but should inform our work.*

-   **Agreements Table:** Plan to migrate from the enhanced `applications` table to a dedicated `agreements` table to handle contracts and payments.
-   **Commission-Based Monetization:** The long-term goal of a commission-based model confirms the need for a robust `agreements` table with financial details.
-   **Third-Party Verification:** Plan to integrate a professional verification service post-beta to increase platform trust.