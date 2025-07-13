# Technical Design Document: Context-First Messaging

**Version:** 1.0
**Date:** 2025-07-12
**Author:** Roo, Fractional CTO

## 1. Overview

This document provides the detailed technical design for implementing the "Context-First Communication Protocol" as outlined in `docs/Messaging_Strategy.md`. The primary goal is to build a secure, context-aware messaging system that prevents spam while fostering valuable professional connections.

This design covers the initial implementation for the Alpha, which focuses on **Tier 1 (Direct Contextual Messaging)** and the backend foundation for **Tier 2 (Connection-Based Messaging)**.

## 2. Data Schema

To support this system, we will introduce a new table, `connections`, and ensure our existing tables can support the required relationships.

### `connections` Table

This table establishes a directional link between two users, signifying that a legitimate professional interaction has occurred.

```sql
CREATE TABLE connections (
    id SERIAL PRIMARY KEY,
    user_one_id INTEGER NOT NULL REFERENCES users(id),
    user_two_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- A user cannot be connected to themselves
    CONSTRAINT check_users_not_same CHECK (user_one_id <> user_two_id),
    -- Ensure each connection pair is unique
    CONSTRAINT unique_connection_pair UNIQUE (LEAST(user_one_id, user_two_id), GREATEST(user_one_id, user_two_id))
);
```

### `conversations` Table (Modification)

We will add an optional, nullable column to link a conversation to its originating context.

```sql
ALTER TABLE conversations
ADD COLUMN context_gig_id INTEGER REFERENCES gigs(id) NULL,
ADD COLUMN context_offering_id INTEGER REFERENCES offerings(id) NULL;
```

## 3. API Endpoints

### `POST /api/inbox/conversations` (Modified)

This endpoint will be updated to handle the creation of contextual conversations and establish a connection between the participants.

**Request Body:**

```json
{
  "recipientId": 123,
  "subject": "Inquiry about Gig: Protein Purification",
  "body": "I have a question about the required experience...",
  "context": {
    "gigId": 45,
    "offeringId": null
  }
}
```

**Logic:**

1.  Authenticate the user (sender).
2.  Verify the `recipientId` is valid.
3.  Create the new conversation, filling in the `context_gig_id` or `context_offering_id`.
4.  Call a new function in the `connectionModel`, `connectionModel.createConnection(sender.id, recipientId)`, which will insert a new row into the `connections` table. It will handle potential race conditions and ignore errors if the connection already exists.
5.  Return the new conversation object.

### `GET /api/users/connections` (New)

This new endpoint will be used by the "Compose" feature in Phase 2 to search a user's 1st-degree connections.

**Request Query Parameters:**

*   `search`: (Optional) A string to search for in the connection's name or email.

**Logic:**

1.  Authenticate the user.
2.  Query the `connections` table for all pairs involving the current user's ID.
3.  Join with the `users` table to retrieve the profile information (id, name, avatar) for the connected users.
4.  If a `search` term is provided, filter the results.
5.  Return an array of user objects.

## 4. Frontend Architecture

The frontend implementation will focus on disabling global composition and enabling contextual initiation points.

```mermaid
graph TD
    subgraph User Interface
        A["Gig Details Page"] --> C{"Message Lab Button"};
        B["Offering Details Page"] --> D{"Message Provider Button"};
        F["Inbox Page"] --> G["'Compose' Button (Disabled)"];
    end

    subgraph API Interaction
        C --> E["POST /api/inbox/conversations <br> (with gigId context)"];
        D --> E["POST /api/inbox/conversations <br> (with offeringId context)"];
    end

    subgraph State Management (Redux)
        E --> H["Update Conversations State"];
    end

    style G fill:#f99,stroke:#333,stroke-width:2px
```

## 5. Phased Rollout Plan

1.  **Alpha (Current Task):**
    *   Implement the database changes.
    *   Implement the modified `POST /api/inbox/conversations` endpoint.
    *   Disable the global "Compose" button on the frontend.
    *   Wire the "Message" buttons on the Gig and Offering detail pages to the new API endpoint.
2.  **Beta (Future Task):**
    *   Implement the `GET /api/users/connections` endpoint.
    *   Re-enable and implement the "Compose" page UI with an async search input that uses the new connections endpoint.
    *   Begin design for Tier 3 (Vouched Introductions).