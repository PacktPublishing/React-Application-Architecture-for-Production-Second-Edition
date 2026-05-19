# AI Ideas API

Backend API for the AI Ideas Community Platform, built with Hono and OpenAPI. Used by chapters 5 through 12 of the book.

## Setup

Run the setup script with the chapter number you are working on (zero-padded, from `05` to `12`):

```sh
node setup.js <chapter-number>
```

For example, to set up the API for chapter 7:

```sh
node setup.js 07
```

This single command will:

1. Install all dependencies (`npm install`)
2. Generate a `.env` file with the correct settings for that chapter
3. Run database migrations and seed the database with sample data

> Chapters 5 and 6 run with `BYPASS_AUTH=true` since authentication is not yet implemented in those chapters.

### Development

Start the API server:

```sh
npm run dev
```

The API will be available at http://localhost:9999.

Interactive API documentation is available at http://localhost:9999/reference.

OpenAPI specification is available at http://localhost:9999/doc.

### Other Commands

Lint:

```sh
npm run lint
```

Test:

```sh
npm run test
```

Reset the database (re-run migrations and seed):

```sh
npm run db:prepare
```

Open Drizzle Studio (database GUI):

```sh
npm run studio
```

## Current Features

### Authentication System

- [x] User registration with email/username validation
- [x] Cookie-based JWT authentication with access tokens (1 hour expiration)
- [x] Refresh token system with token rotation (7 day expiration)
- [x] Multi-device session support (separate refresh tokens per device)
- [x] Logout endpoint (invalidates only current device's refresh token)
- [x] Token refresh endpoint
- [x] Password hashing with bcrypt
- [x] Refresh token hashing for secure storage
- [x] Protected route middleware

### User Profiles

- [x] Get current user profile via `/auth/me` (authenticated)
- [x] Get user by username (public)
- [x] Update bio (authenticated)

### Ideas

- [x] Get all ideas (public) - filter by tags, search(title, description), pagination, sorting (newest, oldest, rating, reviews)
- [x] Create an idea (authenticated)
- [x] Update an idea (authenticated) - only the author can update their own idea
- [x] Delete an idea (authenticated) - only the author can delete their own idea
- [x] Get an idea by id (public)
- [x] Get all ideas by user (public)

### Reviews

- [x] Create a review (authenticated) - one review per user per idea
- [x] Update a review (authenticated) - only the author can update their own review
- [x] Delete a review (authenticated) - only the author can delete their own review
- [x] Get all reviews by user (public)
- [x] Get all reviews by idea (public)

## Data Models

### Users

- id: string
- username: string - unique
- email: string
- bio: string
- createdAt: string
- updatedAt: string

```ts
export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Refresh Tokens

- id: string (UUID)
- tokenHash: string - bcrypt hashed refresh token
- userId: string - foreign key to users table
- expiresAt: Date
- createdAt: Date

```ts
export interface RefreshToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
```

### Ideas

- id: string
- title: string
- shortDescription: string
- description: string
- tags: string[]
- authorId: string
- author: UserSummary (id, email, username)
- createdAt: string
- updatedAt: string
- avgRating: number | null
- reviewsCount: number

```ts
export interface Idea {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  tags: string[];
  authorId: string;
  author: UserSummary;
  createdAt: string;
  updatedAt: string;
  avgRating: number | null;
  reviewsCount: number;
}
```

### Reviews

- id: string
- content: string
- rating: number
- authorId: string
- author: UserSummary (id, email, username)
- ideaId: string
- idea?: IdeaSummary (id, title)
- createdAt: string
- updatedAt: string

```ts
export interface Review {
  id: string;
  content: string;
  rating: number;
  authorId: string;
  author: UserSummary;
  ideaId: string;
  idea?: IdeaSummary;
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### Core

| Method | Path   | Description            | Auth |
| ------ | ------ | ---------------------- | ---- |
| GET    | `/`    | API index/health check | No   |
| GET    | `/doc` | OpenAPI specification  | No   |

### Authentication

| Method | Path             | Description                              | Auth     |
| ------ | ---------------- | ---------------------------------------- | -------- |
| GET    | `/auth/me`       | Get current user profile                 | Required |
| POST   | `/auth/register` | Register new user                        | No       |
| POST   | `/auth/login`    | Login with email/password                | No       |
| POST   | `/auth/logout`   | Logout current device                    | No       |
| POST   | `/auth/refresh`  | Refresh access token using refresh token | No       |

### Profile

| Method | Path                  | Description                    | Auth     |
| ------ | --------------------- | ------------------------------ | -------- |
| GET    | `/profile/{username}` | Get user by username           | No       |
| PATCH  | `/profile`            | Update current user profile (bio) | Required |

### Ideas

| Method | Path                     | Description               | Auth     | Who          |
| ------ | ------------------------ | ------------------------- | -------- | ------------ |
| GET    | `/ideas`                 | Get all ideas             | No       | everyone     |
| GET    | `/ideas/user/{username}` | Get ideas by user         | No       | everyone     |
| GET    | `/ideas/{id}`            | Get an idea by id         | No       | everyone     |
| GET    | `/ideas/current`         | Get ideas by current user | Required | current user |
| POST   | `/ideas`                 | Create an idea            | Required | current user |
| PATCH  | `/ideas/{id}`            | Update an idea            | Required | own          |
| DELETE | `/ideas/{id}`            | Delete an idea            | Required | own          |
| GET    | `/ideas/tags`            | Get idea tags             | No       | everyone     |

### Reviews

| Method | Path                       | Description                 | Auth     | Who          |
| ------ | -------------------------- | --------------------------- | -------- | ------------ |
| POST   | `/reviews`                 | Create a review             | Required | current user |
| PATCH  | `/reviews/{id}`            | Update a review             | Required | own          |
| DELETE | `/reviews/{id}`            | Delete a review             | Required | own          |
| GET    | `/reviews/user/{username}` | Get reviews by user         | No       | everyone     |
| GET    | `/reviews/current`         | Get reviews by current user | Required | current user |
| GET    | `/reviews/idea/{id}`       | Get reviews by idea         | No       | everyone     |

## Authentication Flow

1. **Register**: POST `/auth/register` with email, username, bio (optional), password - returns access token (1h) and refresh token (7d) in httpOnly cookies
2. **Login**: POST `/auth/login` with email and password - returns access token and refresh token in httpOnly cookies
3. **Access Protected Routes**: Access token cookie is automatically sent with requests
4. **Token Refresh**: When access token expires (after 1 hour):
   - Client receives 401 response
   - Client calls POST `/auth/refresh` (browser automatically sends refresh token cookie)
   - Server validates refresh token and issues new access token and new refresh token (token rotation)
   - Client retries original request with new access token
5. **Logout**: POST `/auth/logout` - deletes the specific refresh token from database and clears both cookies (only logs out current device)
6. **Profile Management**: Use authenticated endpoints to view/update profile

### Token System

- **Access Token**: Short-lived JWT (1 hour) used for API requests
- **Refresh Token**: Long-lived JWT (7 days) used to obtain new access tokens
- **Token Storage**: Both tokens stored as httpOnly cookies, refresh tokens also hashed in database
- **Token Rotation**: Each refresh generates a new refresh token and invalidates the old one
- **Multi-Device Support**: Each device gets its own refresh token in the database

### Middleware & Security

- **Auth Middleware**: Validates JWT tokens from httpOnly cookies on protected routes, adds user context to request
- **Cookie Security**: httpOnly, secure (production), sameSite Lax (production) / None (development)
- **Refresh Token Security**: Hashed with bcrypt (cost 12) before storage in database
- **Token Rotation**: Refresh tokens are rotated on each refresh to prevent replay attacks
- **Error Handling**: Comprehensive validation with detailed error messages
- **Type Safety**: All endpoints use Zod schemas for request/response validation
