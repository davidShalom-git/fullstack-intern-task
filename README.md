# Forma - Mini SaaS Template Store

A small full-stack template gallery built for the Gnxtace Technologies Software Engineering Intern assessment. People can create an account, browse and search website templates, save favorites, and manage their shortlist.

## Candidate

- Name: **David Shalom M**
- Contact: **7539943015 · davidshalomswe@gmail.com**

## Features

- User registration and login with hashed passwords and signed JWTs
- A responsive template gallery with search and category filtering
- Favorite and unfavorite actions, with a unique database constraint per user/template pair
- A protected favorites page and a logout action
- Six sample templates seeded automatically on the first server start
- Input validation, useful HTTP status codes, and JSON error responses

## Tech stack

- Frontend: React, Vite, React Router, Zustand, Axios, Lucide icons, custom responsive CSS
- Backend: Node.js, Express, CommonJS modules
- Database: MongoDB, modeled with Mongoose
- Authentication: bcryptjs password hashing and JSON Web Tokens

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## Run locally

The project uses separate `client` and `server` applications. Install their dependencies, configure the server with the values in `server/.env.example`, and start MongoDB before launching both applications. The API connects to MongoDB and adds six sample templates when the collection is empty. The website is available at the local address shown by Vite.

## API routes

All routes are prefixed with `/api`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Create an account and return a token |
| `POST` | `/auth/login` | No | Check credentials and return a token |
| `GET` | `/auth/me` | Bearer token | Return the current user's profile |
| `GET` | `/templates` | No | List available templates |
| `GET` | `/templates/:id` | No | Return one template |
| `GET` | `/favorites` | Bearer token | List the current user's favorites |
| `POST` | `/favorites/:templateId` | Bearer token | Add a favorite (safe to repeat) |
| `DELETE` | `/favorites/:templateId` | Bearer token | Remove a favorite |
| `GET` | `/health` | No | Basic API health response |

For protected routes, send `Authorization: Bearer <token>`. Successful API responses use JSON. Errors have a `message` field.

## Project layout

```text
client/                     React application
  src/App.jsx               Page routes and shared authentication provider
  src/Auth/                 Sign-in, sign-up, and Zustand auth store
  src/Components/           Navigation, gallery, favorites, and reusable cards
  src/config/api.js          Shared Axios setup
server/                     Express API (CommonJS)
  Server.js                 Middleware, route mounting, and server startup
  config/                    MongoDB connection, JWT middleware, and reset utility
  models/                    Mongoose User, Template, and Favorite models
  router/                    Authentication, template, and favorite endpoints
```

## Notes

- MongoDB stores three collections: `users`, `templates`, and `favorites`.
- Copy `.env.example` to `.env` for local configuration. Do not commit `.env` or real secrets.
- The assessment asks for a public GitHub repository named `fullstack-intern-task`, with both `client/` and `server/` folders. Create the repository and push this project when you are ready; review this README and fill in the candidate details first.
- The assessment email gives a deadline of **11 October 2026 before 6 pm**. Its attachment separately describes the task as a 48-hour assessment.

## Design decisions to explain

- MongoDB stores users, templates, and favorites as documents. Mongoose schemas describe the shape and validation rules of those documents.
- Passwords are never stored directly. `bcryptjs` hashes them, and login compares a submitted password with the stored hash.
- A JWT carries the user's id and is sent as a Bearer token. The API checks it before allowing access to favorites.
- A favorite document links a user's ObjectId to a template's ObjectId. A unique compound index prevents duplicate favorites.
- MongoDB's internal `_id` values are ObjectIds. The API returns them as a plain `id` string so the React components do not need database-specific details.
- Search and category filtering happen in the browser because the sample catalog is small. The API remains the source of the template and favorite data.

## Possible next steps

- Add pagination and server-side filters if the catalog grows.
- Move the JWT from local storage to a secure, HTTP-only cookie for a production deployment.
- Add automated tests and deployment configuration before using real users.
