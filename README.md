# Forma — Template Store

Forma is a full-stack template store built for the Gnxtace Technologies Software Engineering Intern assessment. It lets visitors explore website templates and lets registered users save and manage favorites.

## Live project

- **Frontend:** [forma-template-store-client.vercel.app](https://forma-template-store-client.vercel.app/)
- **API health:** [forma-template-store-api.vercel.app/api/health](https://forma-template-store-api.vercel.app/api/health)
- **Source code:** [github.com/davidShalom-git/fullstack-intern-task](https://github.com/davidShalom-git/fullstack-intern-task)
- **Assessment write-up:** [Software Engineering Intern Assessment](output/pdf/Software-Engineering-Intern-Assessment-David-Shalom-M.pdf)
- **Candidate:** David Shalom M · davidshalomswe@gmail.com · 7539943015

The React frontend and Express API are deployed as separate Vercel projects. The hosted API connects to MongoDB Atlas. The API ensures seven starter templates are available without replacing templates that are already in the database, including a custom SaaS dashboard preview.

## What it does

- Creates accounts and signs users in with hashed passwords and JWT authentication.
- Shows a responsive template gallery with search and category filters.
- Includes a SaaS workspace example with a purpose-made dashboard interface preview.
- Lets signed-in users add and remove favorites and view their saved list.
- Validates incoming data and returns clear HTTP status codes and JSON errors.
- Prevents duplicate favorites with a unique database index for each user/template pair.

## Built with

- **Frontend:** React, Vite, React Router, Zustand, Axios, Lucide icons, and custom CSS.
- **Backend:** Node.js and Express using CommonJS modules.
- **Database:** MongoDB with Mongoose models.
- **Authentication:** bcryptjs password hashing and JSON Web Tokens.
- **Hosting:** Vercel for the frontend and API; MongoDB Atlas for the hosted database.

## Run locally

Requirements: Node.js 20 or newer, npm, and a local MongoDB instance or MongoDB Atlas connection string.

The repository has separate `client` and `server` applications. Install dependencies in both folders. Create `server/.env` from `server/.env.example`, then set `MONGODB_URI` and a private `JWT_SECRET` with at least 24 characters. Keep `.env` out of version control. Start the API using the server's `dev` script and the frontend using the client's `dev` script. The API uses port `4000`; Vite prints the frontend address when it starts.

## Deployment configuration

Both Vercel projects use this GitHub repository:

| Project | Root directory | Environment variable |
| --- | --- | --- |
| Frontend | `client` | `VITE_API_URL` — the API URL ending in `/api` |
| API | `server` | `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` — the deployed frontend origin |

Use MongoDB Atlas or another database reachable by the hosted API. A local MongoDB address is only reachable from your own computer. Never commit real connection strings, passwords, or signing secrets.

## API routes

All routes use the `/api` prefix. Routes marked **Bearer token** require an `Authorization: Bearer <token>` header.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create an account and return a token |
| `POST` | `/api/auth/login` | Public | Verify credentials and return a token |
| `GET` | `/api/auth/me` | Bearer token | Return the current user's profile |
| `GET` | `/api/templates` | Public | List templates |
| `GET` | `/api/templates/:id` | Public | Return one template |
| `GET` | `/api/favorites` | Bearer token | List the current user's favorites |
| `POST` | `/api/favorites/:templateId` | Bearer token | Add a favorite |
| `DELETE` | `/api/favorites/:templateId` | Bearer token | Remove a favorite |
| `GET` | `/api/health` | Public | Check API availability |

Successful API responses use JSON. Error responses include a `message` field.

## Project structure

```text
client/
  src/App.jsx                 Page routes
  src/Auth/                   Authentication UI and Zustand store
  src/Components/             Navigation, gallery, favorites, and reusable UI
  src/config/api.js           Shared Axios client
server/
  index.js                    Local startup and Vercel entry point
  Server.js                   Express app, middleware, routes, and startup
  api/[...path].js            Vercel handler for API routes
  config/                     MongoDB connection and authentication middleware
  models/                     User, Template, and Favorite schemas
  router/                     Authentication, template, and favorite routes
```

## Design notes

- Mongoose schemas define the document structure and validation for users, templates, and favorites.
- Passwords are hashed before storage; login compares the submitted password against the stored hash.
- The API validates JWTs before returning a user's favorites.
- A favorite stores references to a user and a template. A unique compound index prevents duplicate pairs.
- The API returns MongoDB identifiers as plain `id` strings so the UI does not need to depend on database-specific fields.
- Search and category filtering run in the browser because this assessment's catalog is small.

## Further improvements

Automated tests, pagination for a larger catalog, and moving authentication from local storage to secure HTTP-only cookies would be good next steps before supporting production users.
