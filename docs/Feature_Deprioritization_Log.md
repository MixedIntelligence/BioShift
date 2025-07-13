# Feature Deprioritization Log

**Date:** July 11, 2025
**Author:** Fractional CTO

This document logs features that have been intentionally deprioritized to focus resources on core product stabilization and the most critical new functionality.

## 1. Real-time Chat

*   **Decision:** The implementation of a real-time chat feature using a third-party service (e.g., Stream) is postponed.
*   **Reasoning:** The current priority is to stabilize the core platform. Introducing a new, complex feature like real-time chat would create unnecessary technical debt and security risks at this stage. The existing persistent inbox system, once secured, will provide a reliable communication channel for our users.
*   **Next Steps:** This feature will be revisited after the public beta launch and once the core platform is deemed stable and secure.

## 2. Cloud-Based Document Uploads

*   **Decision:** The refactoring of the document upload system to use a cloud-based storage solution (e.g., AWS S3) is postponed.
*   **Reasoning:** While the current local storage implementation is not a viable long-term solution, it is a self-contained issue that does not pose an immediate threat to the overall stability of the platform. The effort required to implement a cloud-based solution is significant, and it is more important to focus on stabilizing the existing Gigs Marketplace and other core features.
*   **Next Steps:** This feature will be implemented as part of a dedicated development push after the initial alpha stabilization phase is complete.