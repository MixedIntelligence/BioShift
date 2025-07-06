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

### `GET /api/users/me/applications`

*   **Description:** Retrieves a list of all applications submitted by the current user.
*   **Method:** `GET`
*   **Authentication:** Required (Bearer token)
*   **Response:**
    *   `200 OK`: An array of application objects with gig and lab details.
    *   `401 Unauthorized`: If authentication token is invalid.
    *   `500 Internal Server Error`: If there was an error fetching applications.

**Response Example:**
```json
[
  {
    "application_id": 7,
    "status": "pending",
    "applied_at": "2025-07-06 03:06:45",
    "accepted_at": null,
    "gig_id": 7,
    "title": "Research Assistant Position",
    "description": "Lab research opportunity",
    "location": "Boston, Massachusetts",
    "pay_rate": "15000",
    "duration": "4 weeks",
    "gig_status": "open",
    "gig_created": "2025-07-06 00:50:38",
    "lab_email": "lab@example.com",
    "lab_first_name": "John",
    "lab_last_name": "Doe",
    "lab_name": "Research Lab"
  }
]
```

### `GET /api/users/:id/applications`

*   **Description:** Retrieves a list of applications for a specific user (Admin only or self).
*   **Method:** `GET`
*   **Parameters:**
    *   `id` (required): The ID of the user whose applications to retrieve.
*   **Authentication:** Required (Bearer token)
*   **Authorization:** Admin role or must be requesting own applications
*   **Response:**
    *   `200 OK`: An array of application objects.
    *   `403 Forbidden`: If user is not authorized to view these applications.
    *   `404 Not Found`: If the user is not found.

## Offerings

### `GET /api/offerings`

*   **Description:** Retrieves a list of all available offerings (public endpoint).
*   **Method:** `GET`
*   **Authentication:** Not required
*   **Response:**
    *   `200 OK`: An array of offering objects.

### `GET /api/offerings/:id`

*   **Description:** Retrieves the details of a specific offering (public endpoint).
*   **Method:** `GET`
*   **Authentication:** Not required
*   **Parameters:**
    *   `id` (required): The ID of the offering to retrieve.
*   **Response:**
    *   `200 OK`: An offering object.
    *   `404 Not Found`: If the offering is not found.

### `GET /api/offerings/my-offerings`

*   **Description:** Retrieves all offerings created by the current provider.
*   **Method:** `GET`
*   **Authentication:** Required (Provider role)
*   **Response:**
    *   `200 OK`: An array of offering objects.

### `POST /api/offerings`

*   **Description:** Creates a new offering.
*   **Method:** `POST`
*   **Authentication:** Required (Provider role)
*   **Body:**
    *   `title` (required): The title of the offering.
    *   `description` (required): A description of the offering.
    *   `category` (required): The category of the offering.
    *   `offering_type` (required): The type of offering.
    *   `price` (required): The price of the offering.
    *   `pricing_model` (optional): The pricing model (e.g., 'fixed', 'hourly').
*   **Response:**
    *   `201 Created`: The newly created offering object.

### `PUT /api/offerings/:id`

*   **Description:** Updates an existing offering.
*   **Method:** `PUT`
*   **Authentication:** Required (Provider role, must own the offering)
*   **Parameters:**
    *   `id` (required): The ID of the offering to update.
*   **Body:** Same as POST /api/offerings
*   **Response:**
    *   `200 OK`: The updated offering object.
    *   `404 Not Found`: If the offering is not found.

### `DELETE /api/offerings/:id`

*   **Description:** Deletes an offering.
*   **Method:** `DELETE`
*   **Authentication:** Required (Provider role, must own the offering)
*   **Parameters:**
    *   `id` (required): The ID of the offering to delete.
*   **Response:**
    *   `200 OK`: A success message.
    *   `404 Not Found`: If the offering is not found.