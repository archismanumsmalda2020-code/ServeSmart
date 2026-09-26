# ServeSmart: Campus Service Ticket System

ServeSmart is a campus service dispatch app. Students raise maintenance requests, an admin assigns each request to a technician, and the technician works it through to resolution.

## Overview

ServeSmart is a starter project for a campus maintenance ticketing system with three roles:

- **Students** raise maintenance requests.
- **Admins** assign each request to a technician.
- **Technicians** work each assigned request through to resolution.

The starter gives you the pages, styling, seeded data, a demo login, and a basic API. Your job is to complete the tasks listed below and make every feature work correctly, on both the screen and the server.

## What Has Already Been Built

The starter project already includes the following functionality. Participants should build the remaining functionality described in the tasks below.

- **Pages**
  - Login / role picker (`pages/index.js`)
  - Student ticket list, new ticket, and ticket detail (`pages/tickets/`)
  - Technician dashboard (`pages/technician/`)
  - Admin assignment page (`pages/admin/`)
- **Components:** Navbar, StatStrip, and Tag (`components/`)
- **Styling:** all styling in `styles/globals.css`
- **Seed data:** seeded users and tickets in an in-memory store (`lib/store.js`)
- **Demo login:** login helpers in `lib/auth.js` (see [Demo Accounts](#demo-accounts))
- **Helpers:** labels, colours, sorting, and date helpers (`lib/meta.js`)
- **Basic API:** ticket routes under `pages/api/tickets/` (see [API](#api))
- **Tests:** a seed data check (`tests/seed.test.js`)

## Features

### Existing Features

- Demo login with a role picker
- Seeded users and tickets
- Pages for students, technicians, and admins
- A basic tickets API

### Features to Be Implemented

- Ticket creation with validation and feedback
- Ticket lifecycle with sequential status transitions and a status history log
- Technician dashboard with filtering and priority sorting
- Admin assignment and reassignment of tickets
- Role and ownership protection on pages and API routes
- Fixes for the known bugs listed under [Debugging Tasks](#debugging-tasks)

## Tech Stack

- **Framework:** Next.js 14 (pages router)
- **Library:** React 18
- **Styling:** Plain CSS
- **Data storage:** In-memory data store (no database)
- **Package manager:** npm

## Getting Started

**Prerequisite:** Node.js 18.17 or newer.

### 1. Fork the Repository

Fork this repository to your own GitHub account using the **Fork** button at the top of the repository page.

### 2. Clone the Repository

```bash
git clone <your-forked-repository-url>
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### 5. Run Tests

```bash
npm test
```

This runs the seed data check.

### 6. Build the Project

```bash
npm run build
```

The build must finish with no errors before you submit.

## Project Structure

```text
.
├── components/          # Navbar, StatStrip, Tag
├── lib/
│   ├── auth.js          # Demo login helpers
│   ├── meta.js          # Labels, colours, sorting and date helpers
│   └── store.js         # Seeded users and tickets
├── pages/
│   ├── index.js         # Login / role picker
│   ├── tickets/         # Student ticket list, new ticket, ticket detail
│   ├── technician/      # Technician dashboard
│   ├── admin/           # Admin assignment page
│   └── api/
│       └── tickets/     # GET and POST tickets, GET and PATCH one ticket
├── styles/
│   └── globals.css      # All styling
└── tests/
    └── seed.test.js     # Seed data check
```

## How Tickets Work

- **Status order:** Open → Assigned → In Progress → Resolved → Closed
- **Priority:** P1 (urgent or safety) to P4 (minor)
- **Ticket fields:** `id`, `title`, `description`, `category`, `location`, `priority`, `status`, `studentId`, `technicianId`, `createdAt`, `updatedAt`, `activity` (history log)

## API

| Method | Route              | What it does                                                                   |
| ------ | ------------------ | ------------------------------------------------------------------------------ |
| GET    | `/api/tickets`     | List tickets. Optional filters: `studentId`, `technicianId`, `unassigned=true` |
| POST   | `/api/tickets`     | Create a ticket                                                                |
| GET    | `/api/tickets/:id` | Get one ticket                                                                 |
| PATCH  | `/api/tickets/:id` | Update status and/or `technicianId`                                            |

## Demo Accounts

Pick an account on the home page. There is no password.

- **Student:** Ava Patel, Liam Chen, Maya Singh, Noah Kim, Zoe Rivera, Ethan Wood, Priya Nair, Omar Ali, Grace Lin, Jack Ford (`stu1` to `stu10`)
- **Technician:** Sam Torres (`tech1`), Dana Brooks (`tech2`), Ravi Desai (`tech3`)
- **Admin:** Chris Park (`admin1`)

## What Participants Need to Build

The starter project intentionally leaves gaps. Complete the tasks below and make every feature work correctly on both the screen and the server.

Key gaps to be aware of:

- **No access protection:** the demo login only saves the chosen user in the browser. It does not protect any page or API route. Adding that protection is part of your work.
- **Unknown caller:** the API does not know who is calling. Decide how to pass the current user (for example, a header or a body field), then check role and ownership on the server.
- **Known bugs:** see [Debugging Tasks](#debugging-tasks).

## Participant Tasks

### Task 1 — Ticket Creation

- Provide a ticket creation form with title, description, category, location, and priority
- Make the POST API store the new ticket with a default status of Open
- Add required-field validation on all fields
- Restrict priority to P1, P2, P3, or P4
- Enforce a minimum length for the description
- Show clear success and error feedback on submit
- Make the new ticket appear immediately in the student's own ticket list

### Task 2 — Ticket Lifecycle

- Support all five statuses in the status field and wire it to the API
- Allow only sequential transitions, in the correct order
- Reject invalid or skipped transitions (for example, Closed to Open)
- Allow a technician to update the status only of tickets assigned to them
- Record the time of each status change
- Show the current status in the UI with a correct label or badge
- Show a simple status history log on the ticket

### Task 3 — Technician Dashboard

- List the tickets assigned to the logged-in technician
- Show priority, location, and status for each ticket
- Filter by status
- Filter by priority
- Make the status and priority filters work correctly together
- Sort so that P1 tickets always appear first

### Task 4 — Admin Assignment

- Let the admin view all unassigned tickets
- Let the admin assign a ticket to a chosen technician
- Automatically change the ticket's status to Assigned when it is assigned
- Show the assigned technician's name on the ticket
- Restrict the assignment page and API to admins only
- Support reassigning a ticket to a different technician

## Debugging Tasks

### Task 5 — Debugging

Find and fix these problems:

- Priority sorting is wrong (it sorts as plain text instead of P1 to P4 order)
- Non-owners can update tickets they should not be able to touch
- Invalid status transitions are being allowed
- Ticket counts on the dashboard go stale

## Stretch / Optional Tasks

These tasks are optional and separate from the required tasks above.

- Search tickets by title
- Search tickets by location

## Expected Behavior

- **Validation:** all ticket fields are required, priority must be P1 to P4, and the description must meet a minimum length. The form shows clear success and error feedback.
- **State changes:** tickets only move forward one step at a time through the status order. Each change is timestamped and appears in the ticket's status history. Assigning a ticket sets its status to Assigned.
- **Authorization:** technicians can only update tickets assigned to them, and assignment is admin-only. These rules are enforced on the server, not just in the UI.
- **Live data:** new tickets appear immediately in the student's list, and dashboard ticket counts stay current.

## How to Approach the Project

1. Run the application with `npm run dev` and open [http://localhost:3000](http://localhost:3000).
2. Explore the existing pages by logging in with the demo accounts.
3. Run the existing tests with `npm test`.
4. Inspect the relevant files: the pages, the API routes in `pages/api/tickets/`, `lib/store.js`, `lib/auth.js`, and `lib/meta.js`.
5. Decide how the current user is passed to the API, then check role and ownership on the server.
6. Implement the required tasks.
7. Test each role (student, technician, and admin), covering both the invalid cases and the happy path.
8. Run `npm run build` and confirm it finishes with no errors before you submit.

## Important Notes and Constraints

- The data lives in memory, so it resets every time the server restarts. There is no database.
- Keep the existing project structure and code style. You should not need extra libraries.
- Enforce every rule on the server as well. Hiding a button in the UI is not enough.

## Links

- How to clone and fork this GitHub Repository:
- https://drive.google.com/file/d/12V_ONDBT5kH3ELC0_wWJcPfjsLmpR3KR/view?usp=sharing

- Directly download zip file:
- https://drive.google.com/file/d/1V9EqaQ_3s2oOB_eCeA2Ok4D0-2IAbJpL/view?usp=sharing
