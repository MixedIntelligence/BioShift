# LabLeap API Documentation

This document provides a comprehensive overview of the LabLeap API endpoints.

## Authentication

All API endpoints require a valid JSON Web Token (JWT) to be included in the `Authorization` header of the request.

```
Authorization: Bearer <YOUR_JWT>
```

## Gigs

### `GET /api/gigs`

*   **Description:** Retrieves a list of all available gigs.
*   **Method:** `GET`
*   **Response:**
    *   `200 OK`: An array of gig objects.

### `GET /api/gigs/:id`

*   **Description:** Retrieves the details of a specific gig.
*   **Method:** `GET`
*   **Parameters:**
    *   `id` (required): The ID of the gig to retrieve.
*   **Response:**
    *   `200 OK`: A gig object.
    *   `404 Not Found`: If the gig is not found.

### `POST /api/gigs`

*   **Description:** Creates a new gig.
*   **Method:** `POST`
*   **Body:**
    *   `title` (required): The title of the gig.
    *   `description` (required): A description of the gig.
*   **Response:**
    *   `201 Created`: The newly created gig object.

### `POST /api/gigs/:id/apply`

*   **Description:** Applies to a specific gig.
*   **Method:** `POST`
*   **Parameters:**
    *   `id` (required): The ID of the gig to apply to.
*   **Response:**
    *   `200 OK`: A success message.
    *   `400 Bad Request`: If the user has already applied to the gig.

## Applications

### `GET /api/gigs/:id/applications`

*   **Description:** Retrieves a list of all applications for a specific gig.
*   **Method:** `GET`
*   **Parameters:**
    *   `id` (required): The ID of the gig.
*   **Response:**
    *   `200 OK`: An array of application objects.

### `POST /api/applications/:applicationId/accept`

*   **Description:** Accepts an application.
*   **Method:** `POST`
*   **Parameters:**
    *   `applicationId` (required): The ID of the application to accept.
*   **Response:**
    *   `200 OK`: The updated application object.
    *   `404 Not Found`: If the application is not found.

### `POST /api/applications/:applicationId/reject`

*   **Description:** Rejects an application.
*   **Method:** `POST`
*   **Parameters:**
    *   `applicationId` (required): The ID of the application to reject.
*   **Response:**
    *   `200 OK`: A success message.
    *   `404 Not Found`: If the application is not found.

## Users

### `GET /api/users/:userId/profile`

*   **Description:** Retrieves the public profile of a specific user.
*   **Method:** `GET`
*   **Parameters:**
    *   `userId` (required): The ID of the user to retrieve.
*   **Response:**
    *   `200 OK`: A user profile object.
    *   `404 Not Found`: If the user is not found.