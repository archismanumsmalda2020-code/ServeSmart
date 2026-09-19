# ServeSmart: Campus Service Ticket System

## About

ServeSmart is a campus service dispatch app. Students raise maintenance requests, an admin assigns each request to a technician, and the technician works it through to resolution.

The starter gives you the pages, styling, seeded data, a demo login and a basic API. Your job is to complete the tasks listed below and make every feature work correctly, on both the screen and the server.

**Tech stack:** Next.js 14 (pages router), React 18, plain CSS, in-memory data store (no database).

## Getting started

Requires Node.js 18.17 or newer.

```bash
npm install
cp .env.example .env.local    # Windows: copy .env.example .env.local
npm run dev
```

Open http://localhost:3000.

```bash
npm test          # runs the seed data check
npm run build     # must finish with no errors before you submit
```

The data lives in memory, so it resets every time the server restarts.

## Demo accounts

Pick an account on the home page. There is no password.

| Role       | Accounts                                                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Student    | Ava Patel, Liam Chen, Maya Singh, Noah Kim, Zoe Rivera, Ethan Wood, Priya Nair, Omar Ali, Grace Lin, Jack Ford (`stu1` to `stu10`) |
| Technician | Sam Torres (`tech1`), Dana Brooks (`tech2`), Ravi Desai (`tech3`)                                                                  |
| Admin      | Chris Park (`admin1`)                                                                                                              |

The login only saves the chosen user in the browser. It does not protect any page or API route. Adding that protection is part of your work.

## Project structure

```
components/            Navbar, StatStrip, Tag
lib/auth.js            demo login helpers
lib/meta.js            labels, colours, sorting and date helpers
lib/store.js           seeded users and tickets
pages/index.js         login / role picker
pages/tickets/         student ticket list, new ticket, ticket detail
pages/technician/      technician dashboard
pages/admin/           admin assignment page
pages/api/tickets/     GET and POST tickets, GET and PATCH one ticket
styles/globals.css     all styling
tests/seed.test.js     seed data check
```

## How tickets work

- **Status order:** Open → Assigned → In Progress → Resolved → Closed
- **Priority:** P1 (urgent or safety) to P4 (minor)
- **Ticket fields:** id, title, description, category, location, priority, status, studentId, technicianId, createdAt, updatedAt, activity (history log)

## API

| Method | Route              | What it does                                                                   |
| ------ | ------------------ | ------------------------------------------------------------------------------ |
| GET    | `/api/tickets`     | List tickets. Optional filters: `studentId`, `technicianId`, `unassigned=true` |
| POST   | `/api/tickets`     | Create a ticket                                                                |
| GET    | `/api/tickets/:id` | Get one ticket                                                                 |
| PATCH  | `/api/tickets/:id` | Update `status` and/or `technicianId`                                          |

## Your tasks

### Task 1: Ticket Creation

- Ticket creation form with title, description, category, location and priority.
- POST API stores the new ticket with a default status of Open.
- Required-field validation on all fields.
- Priority is restricted to P1, P2, P3 or P4.
- Description has a minimum length.
- Show clear success and error feedback on submit.
- The new ticket appears immediately in the student's own ticket list.

### Task 2: Ticket Lifecycle

- The status field supports all five states and is wired to the API.
- Only sequential transitions are allowed, in the correct order.
- Invalid or skipped transitions are rejected, for example Closed to Open.
- A technician can only update the status of tickets assigned to them.
- The time of each status change is recorded.
- The UI shows the current status with a correct label or badge.
- A simple status history log is visible on the ticket.

### Task 3: Technician Dashboard

- List the tickets assigned to the logged-in technician.
- Show priority, location and status for each ticket.
- Filter by status.
- Filter by priority.
- The status and priority filters work correctly together.
- Sort so P1 tickets always appear first.

### Task 4: Admin Assignment

- The admin can view all unassigned tickets.
- The admin can assign a ticket to a chosen technician.
- Assigning a ticket automatically changes its status to Assigned.
- The assigned technician's name is shown on the ticket.
- The assignment page and API are restricted to admins only.
- Reassigning a ticket to a different technician is supported.

### Task 5: Debugging

Find and fix these problems:

- Priority sorting is wrong (it sorts as plain text instead of P1 to P4 order).
- Non-owners can update tickets they should not be able to touch.
- Invalid status transitions are being allowed.
- Ticket counts on the dashboard go stale.

### Stretch

- Search tickets by title.
- Search tickets by location.

## Tips

- Enforce every rule on the server too. Hiding a button in the UI is not enough.
- The API does not know who is calling. Decide how to pass the current user (for example a header or a body field), then check the role and ownership on the server.
- Keep the existing project structure and code style. You should not need extra libraries.
- Test each role: log in as a student, the admin and a technician, and try the invalid cases as well as the happy path.
- Run `npm run build` before you submit.
