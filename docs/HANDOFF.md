# LabLeap MVP – Handoff & Technical Guide

## 1. Product Overview

**Vision:**  
LabLeap aims to be the leading, high-trust digital marketplace connecting certified science professionals with laboratories for project-based work, driving innovation and agility in R&D and biotech.

**MVP Goals:**
- Launch a two-sided platform for Lab Professionals and Labs.
- Build trust via verifiable skills and certifications.
- Validate the value proposition: on-demand access to qualified talent for labs, flexible work for professionals.
- Deliver a simple, intuitive user experience for posting, finding, and managing projects.

**Target Audience:**
- **Lab Professionals:** Certified lab techs, scientists, biochemists seeking flexible/project-based work.
- **Labs/Clients:** R&D, biotech, pharma, and academic labs needing specialized, short-term talent.

---

## 2. User Personas

**Persona 1: Dr. Elena Vance (Lab Professional)**
- Freelance Biochemist, PhD, 8 years’ experience.
- Needs: Find credible, short-term lab work; showcase expertise; manage contracts/payments.

**Persona 2: Innovate Bio (Lab/Client)**
- Mid-sized biotech firm, 20 scientists.
- Needs: Quickly hire pre-vetted professionals; reduce hiring overhead; manage multiple projects/applicants.

---

## 3. Core User Journeys & MVP Stories

### Lab Professional

**Onboarding & Profile**
- Signup with email/password (with verification).
- Create profile: name, headline, summary, work experience.
- Add skills from a predefined list.
- Upload certifications (with metadata, status, expiry alerts).

**Project Discovery**
- Search/filter projects by skills, certifications, pay, location.
- View detailed project pages (requirements, lab info).

**Application & Management**
- Apply for projects (with cover letter).
- Dashboard to track applications/gig status (Applied, In Review, Offer, Hired, Declined).
- Notifications for status changes.

### Lab/Client

**Onboarding & Profile**
- Register company, verify email.
- Create company profile (size, industry, description).

**Project Posting**
- Post projects: title, description, duration, location, pay, required skills/certs.
- Save drafts.

**Applicant Management**
- View/filter applicants by skills/certs.
- Flag applicants meeting all requirements.
- View full professional profiles (summary, work, skills, certifications).

**Hiring & Review**
- Award projects, notify all applicants.
- Mark projects as “In Progress.”
- Rate/review professionals post-completion (star + text, double-blind or 14-day window).

---

## 4. Technical Stack & Project Structure

**Frontend:**  
- React 17, Bootstrap 5, Redux, Webpack  
- Based on the open-source [Sing App React](https://github.com/flatlogic/sing-app-react) template (ex-premium, now free).

**Key Folders:**
- `src/components/`: Reusable UI components (forms, tables, cards, user/profile forms, etc.)
- `src/pages/`: Page-level components (dashboard, listings, forms, etc.)
- `src/actions/` & `src/reducers/`: Redux logic for users, auth, projects, etc.
- `docs/`: Project documentation (setup, demo guide, onboarding, etc.)

**Authentication & User Management:**
- Mock user flows for login, registration, and profile management.
- Role-based access (admin, user; can be extended to client/freelancer).
- Profile fields: name, email, phone, avatar, role, certifications, skills.

**Demo Data:**
- Use static/mock data for users, projects, and applications (see `src/pages/gigs/mock.js`, `src/actions/mock.js`).

---

## 5. Documentation & Onboarding

**Key Docs:**
- `docs/GETTING_STARTED_FIXES.md`: Setup steps, dependency fixes, troubleshooting.
- `docs/GIG_MARKETPLACE_DEMO.md`: How to build a clickable gig marketplace demo, user flows, UI/UX mapping, and actionable steps for customization.

**Setup Summary:**
- Use Node 16+ and React 17.
- Install dependencies with `yarn install --legacy-peer-deps` or `npm install --legacy-peer-deps`.
- Start with `yarn start`.
- For backend integration, see Flatlogic’s Node.js backend or use mock data for demo.

**Customization Tips:**
- Adapt user roles and profile fields for lab professionals and labs.
- Use and extend form components for onboarding, project posting, and application flows.
- Map gig/project flows to e-commerce/product components for rapid prototyping.

---

## 6. UI/UX & Feature Mapping

- **Landing Page:** Intro, CTAs for “Find Projects” and “Post a Project.”
- **Gig Listings:** Use card/table components for project lists.
- **Gig Details:** Modal/page with full project info and “Apply” button.
- **Profile Management:** Use user form components for both professionals and labs.
- **Dashboard:** Central view for applications, projects, and status.
- **Admin/User List:** For managing users (can be extended for labs/clients).

---

## 7. Known Gaps & Recommendations

- **User Management:** Based on a deprecated template; for production, consider Flatlogic Generator or custom backend.
- **Social Login:** Not implemented in MVP.
- **Data Persistence:** Demo uses mock data; backend integration required for real use.
- **Advanced Features:** Messaging, payments, notifications, and double-blind reviews are out of MVP scope but can be added.

---

## 8. Next Steps

- Use the demo and documentation as a foundation for user testing and stakeholder feedback.
- Prioritize backend integration for authentication, project/applicant management, and data persistence.
- Expand user roles and permissions as needed.
- Polish UI/UX based on feedback and add visual assets (avatars, icons, etc.).
- Consider Flatlogic’s modern solutions for advanced user management and scalability.

---

## 9. Resources & References

- [Sing App React GitHub](https://github.com/flatlogic/sing-app-react)
- [Flatlogic Node.js Backend](https://github.com/flatlogic/nodejs-backend)
- [Flatlogic Generator](https://flatlogic.com/generator)
- Project Discord/Support: [Flatlogic Discord](https://discord.gg/flatlogic-community)

---

## 10. Demo Implementation Log

Use this section to track the progress, decisions, and notes as you build the clickable demo. Update with each major step, component, or change.

### Log Template
- **Date:**
- **Change/Addition:**
- **Files/Components Affected:**
- **Notes/Decisions:**

### Example Entries
- **2025-07-02:** Created initial Gig Listings page using Card component. Added mock data to `src/pages/gigs/mock.js`.
- **2025-07-02:** Updated routing in `RouteComponents.js` to include `/gigs` and `/gigs/:id`.

---

**For any questions or further onboarding, see the `docs/` folder or contact the project lead.**
