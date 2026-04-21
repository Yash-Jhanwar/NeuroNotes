# College Notes Management System Backend

This backend uses `Node.js`, `Express`, and `PostgreSQL` with `pg`.

The current setup includes:
- server bootstrap
- database connection with `DATABASE_URL`
- basic Express middleware
- health check route
- Clerk middleware integration for protected routes

No business logic or database schema generation is included here.

## Recommended MVC Folder Structure

```text
backend/
├── server.js
├── package.json
├── .env
├── config/
│   └── db.js
└── src/
    ├── app.js
    ├── routes/
    │   ├── healthRoutes.js
    │   ├── userRoutes.js
    │   ├── semesterRoutes.js
    │   ├── subjectRoutes.js
    │   ├── unitRoutes.js
    │   ├── topicRoutes.js
    │   └── noteRoutes.js
    ├── controllers/
    │   ├── userController.js
    │   ├── semesterController.js
    │   ├── subjectController.js
    │   ├── unitController.js
    │   ├── topicController.js
    │   └── noteController.js
    ├── models/
    │   ├── userModel.js
    │   ├── semesterModel.js
    │   ├── subjectModel.js
    │   ├── unitModel.js
    │   ├── topicModel.js
    │   └── noteModel.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   └── notFound.js
    ├── services/
    │   └── noteService.js
    ├── validators/
    │   └── noteValidator.js
    └── utils/
        └── apiResponse.js
```

## File Responsibilities

### Current Core Files

- `server.js`
  Starts the backend server and checks that PostgreSQL is reachable before listening for requests.

- `config/db.js`
  Creates and exports a shared PostgreSQL connection pool using `pg` and `DATABASE_URL`.

- `src/app.js`
  Creates the Express app, adds common middleware, mounts routes, and applies error handlers.

- `src/routes/healthRoutes.js`
  Contains the `/api/health` endpoint used to verify the API is running.

- `src/middleware/authMiddleware.js`
  Reads the authenticated Clerk user from the request, attaches `req.user`, and blocks unauthenticated access with `401`.

- `src/middleware/notFound.js`
  Returns a clean `404` response for unknown routes.

- `src/middleware/errorHandler.js`
  Central place for formatting and returning API errors.

### Future MVC Files

- `routes/`
  Define endpoints and connect them to controller functions.

- `controllers/`
  Handle request and response logic.

- `models/`
  Run SQL queries and return database results.

- `services/`
  Hold reusable business logic when controllers become larger.

- `validators/`
  Validate request body, params, and query values before controller logic runs.

## Request to Response Flow

1. Frontend sends a request to the Express API.
2. Express matches the route.
3. Clerk middleware reads the auth token from the request.
4. Auth middleware gets `userId` and attaches it to `req.user`.
5. The route calls the controller.
6. The controller calls a model or service.
7. The model runs a PostgreSQL query using `pg`.
8. PostgreSQL returns data.
9. The controller sends a JSON response back to the frontend.
10. If an error happens, the global error handler sends a clean error response.

## How Clerk Integrates With Backend

Clerk handles identity, while Express handles route protection and database access.

Backend flow:
- Clerk middleware checks the incoming session token.
- `getAuth(req)` reads the current authentication state.
- If the user is signed in, `userId` is available.
- The middleware attaches it as `req.user = { userId }`.
- Protected routes use `requireAuth`.
- If the user is not authenticated, the backend returns `401 Unauthorized`.

## How Frontend Sends Auth Token

From the frontend, Clerk provides a session token.

The frontend sends that token in the request header:

```http
Authorization: Bearer <token>
```

That token is then read and validated by Clerk on the Express backend.

## API Design Overview

### Health
- `GET /api/health`

### Users
- `GET /api/users/me`
- `POST /api/users/sync`

### Semesters
- `GET /api/semesters`
- `GET /api/semesters/:semesterId`
- `POST /api/semesters`
- `PUT /api/semesters/:semesterId`
- `DELETE /api/semesters/:semesterId`

### Subjects
- `GET /api/subjects`
- `GET /api/subjects/:subjectId`
- `GET /api/semesters/:semesterId/subjects`
- `POST /api/subjects`
- `PUT /api/subjects/:subjectId`
- `DELETE /api/subjects/:subjectId`

### Units
- `GET /api/units`
- `GET /api/units/:unitId`
- `GET /api/subjects/:subjectId/units`
- `POST /api/units`
- `PUT /api/units/:unitId`
- `DELETE /api/units/:unitId`

### Topics
- `GET /api/topics`
- `GET /api/topics/:topicId`
- `GET /api/units/:unitId/topics`
- `POST /api/topics`
- `PUT /api/topics/:topicId`
- `DELETE /api/topics/:topicId`

### Notes
- `GET /api/notes`
- `GET /api/notes/:noteId`
- `GET /api/topics/:topicId/notes`
- `POST /api/notes`
- `PUT /api/notes/:noteId`
- `DELETE /api/notes/:noteId`

## Current Completion Status

### Completed
- Express server bootstrap
- PostgreSQL pool setup with `DATABASE_URL`
- `dotenv` usage
- basic middleware setup
- `/api/health` route
- Clerk middleware integration for protected routes
- beginner-friendly backend architecture documentation

### Not Added Yet
- business logic
- controllers implementation
- models and services implementation
- validation layer
- protected feature route wiring
