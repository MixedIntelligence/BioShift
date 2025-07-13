# LabLeap Messaging Strategy: The Context-First Communication Protocol

## 1. Guiding Philosophy

The messaging system is a core feature of the LabLeap marketplace, but it is not a social network. Its primary purpose is to facilitate professional transactions and collaborations. Communication should be an earned privilege based on professional context and reputation, not a default capability. This approach is designed to maximize signal, prevent spam, and build a high-trust professional graph.

## 2. The Three Tiers of Communication

### Tier 1: Direct Contextual Messaging (First Contact)

This is the only way for two users who have no prior relationship to initiate a conversation.

- **Trigger:** A user clicks a "Message" button on a specific marketplace entity.
- **Examples:**
    - On a Gig page: "Message Lab"
    - On a Gig Application: "Message Applicant"
    - On an Offering page: "Message Provider"
- **Result:** A new conversation is created, and its subject is pre-filled with the context (e.g., "Inquiry about Gig: Protein Purification"). The two participants are now considered **1st-degree connections**.

### Tier 2: Connection-Based Messaging (Follow-Up)

This allows users who have already established a professional context to communicate freely.

- **Trigger:** A user opens the main Inbox and uses the "Compose" feature.
- **Functionality:** The "To" field will be a search box that *only* returns the user's 1st-degree connections.
- **Result:** Users can easily re-engage with past clients, collaborators, and applicants for new opportunities or follow-up discussions.

### Tier 3: Vouched Introductions (Network Expansion)

This is our key strategic differentiator, designed to empower users by leveraging their reputation and work history.

- **Trigger:** A user (the "Requester") views the profile of another user (the "Target") with whom they have no 1st-degree connection.
- **Functionality:**
    1. The system checks if the Requester and Target share one or more mutual 1st-degree connections (a "Voucher").
    2. If a Voucher exists, a "Request Introduction" button is displayed on the Target's profile.
    3. The Requester clicks the button and sends a short, private message to the Voucher explaining why they want the introduction.
    4. The Voucher receives the request and can either "Approve" or "Decline".
    5. If approved, a new three-way conversation is created between the Requester, Target, and Voucher. The Voucher is expected to make a brief introduction and can then choose to leave the conversation.
- **Result:** This creates a high-trust referral system. Requesters can leverage their professional network to access new opportunities, and Targets are protected from unsolicited contact.

## 3. Implementation Plan

- **Alpha (Current Phase):**
    - Implement the technical backend for **Tier 1 (Direct Contextual Messaging)**.
    - Implement the UI for the "Message" buttons on the Gig and Offering pages.
    - Implement the basic backend logic for **Tier 2 (Connection-Based Messaging)**. The "Compose" UI will remain disabled for now, but the database will be ready.
- **Beta (Phase 2):**
    - Fully implement the "Compose" UI with the connection-search functionality.
    - Design and implement the database schema and backend logic for **Tier 3 (Vouched Introductions)**.
- **Post-Beta:**
    - Build the full UI for Vouched Introductions.