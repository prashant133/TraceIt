# SoleTrace 👟

A shoe authenticity verification API that allows admins to register shoes and users to verify ownership, check warranty status, and confirm authenticity via OTP-based verification.

---

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + TypeORM
- **Cache**: Redis
- **Authentication**: JWT (Access + Refresh Token)
- **Email**: Nodemailer + Gmail SMTP
- **Image Upload**: Multer + Cloudinary
- **Validation**: class-validator + class-transformer

---

## Features

- ✅ User registration with email verification
- ✅ JWT authentication with silent token refresh
- ✅ Role-based access control (Admin / User)
- ✅ OTP-based email verification, password reset, and shoe viewing
- ✅ Shoe authenticity verification
- ✅ Redis-based rate limiting

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Redis
- Cloudinary account
- Gmail account with App Password

### Installation

```bash
# clone the repo
git clone https://github.com/yourusername/soletrace.git

# install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Server
PORT=8000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=dbname

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=youremail@gmail.com
MAIL_PASS=your_app_password

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Database Setup

```bash
# generate migration
npm run migration:generate src/migrations/InitialMigration

# run migration
npm run migration:run
```

### Running the App

```bash
# development
npm run dev

# production
npm run build
npm start
```

---

## API Endpoints

### Auth

| Method | Endpoint                  | Description          | Auth |
| ------ | ------------------------- | -------------------- | ---- |
| POST   | `/api/auth/register`      | Register a new user  | ❌   |
| POST   | `/api/auth/login`         | Login user           | ❌   |
| POST   | `/api/auth/logout`        | Logout user          | ✅   |
| POST   | `/api/auth/refresh-token` | Refresh access token | ❌   |

### OTP

| Method | Endpoint                   | Description                | Auth |
| ------ | -------------------------- | -------------------------- | ---- |
| POST   | `/api/otp/verify-email`    | Verify email with OTP      | ❌   |
| POST   | `/api/otp/forgot-password` | Send password reset OTP    | ❌   |
| POST   | `/api/otp/reset-password`  | Reset password with OTP    | ❌   |
| POST   | `/api/otp/view-shoe`       | View shoe details with OTP | ✅   |

### Shoes (Admin)

| Method | Endpoint                  | Description     | Auth     |
| ------ | ------------------------- | --------------- | -------- |
| POST   | `/api/shoes`              | Create a shoe   | ✅ Admin |
| GET    | `/api/shoes`              | Get all shoes   | ✅ Admin |
| GET    | `/api/shoes/:modelNumber` | Get single shoe | ✅ Admin |
| PUT    | `/api/shoes/:modelNumber` | Update shoe     | ✅ Admin |
| DELETE | `/api/shoes/:modelNumber` | Delete shoe     | ✅ Admin |

### Shoes (User)

| Method | Endpoint             | Description            | Auth |
| ------ | -------------------- | ---------------------- | ---- |
| POST   | `/api/shoes/verify`  | Verify shoe + send OTP | ✅   |
| POST   | `/api/otp/view-shoe` | View shoe details      | ✅   |

### Purchases

| Method | Endpoint         | Description     | Auth |
| ------ | ---------------- | --------------- | ---- |
| POST   | `/api/purchases` | Purchase a shoe | ✅   |

---

## Authentication Flow

```
Register → Verify Email → Login → Access Protected Routes
```

### Token Strategy

- **Access Token** — stored in httpOnly cookie, expires in 15 minutes
- **Refresh Token** — stored in httpOnly cookie + hashed in DB, expires in 7 days
- **Silent Refresh** — access token is automatically refreshed using refresh token

---

## Shoe Verification Flow

```
1. User purchases shoe    → POST /api/purchases
2. User searches shoe     → POST /api/shoes/verify (sends OTP)
3. User submits OTP       → POST /api/otp/view-shoe
4. System returns:
   - Shoe details
   - Authenticity status
   - Warranty status + remaining days
```

---

## Rate Limiting

| Route      | Limit        | Window     |
| ---------- | ------------ | ---------- |
| All routes | 100 requests | 15 minutes |
| Login      | 5 attempts   | 10 minutes |
| OTP routes | 3 requests   | 1 minute   |

---

## Audit Logging

Every action is logged in the `audit_logs` table:

| Action            | Trigger                 |
| ----------------- | ----------------------- |
| `USER_REGISTERED` | User registers          |
| `USER_LOGGED_IN`  | User logs in            |
| `USER_LOGGED_OUT` | User logs out           |
| `EMAIL_VERIFIED`  | Email verified          |
| `PASSWORD_RESET`  | Password reset          |
| `SHOE_CREATED`    | Admin creates shoe      |
| `SHOE_UPDATED`    | Admin updates shoe      |
| `SHOE_DELETED`    | Admin deletes shoe      |
| `SHOE_VIEWED`     | User views shoe details |
| `SHOE_PURCHASED`  | User purchases shoe     |

## Scripts

```bash
npm run dev                  # start development server
npm run build                # build for production
npm start                    # start production server
npm run migration:generate   # generate migration
npm run migration:run        # run migrations
npm run migration:revert     # revert last migration
```

---


