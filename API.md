# TraceIT API Documentation

Base URL: `http://localhost:8000/api`

---

## Table of Contents

- [Authentication](#authentication)
- [OTP](#otp)
- [Shoes](#shoes)
- [Purchases](#purchases)

---

## Authentication

### Register

```http
POST /auth/register
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "P@ssw0rd1234"
}
```

**Success Response:** `201`
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful. Please verify your email.",
  "data": {}
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | Validation error |
| 409 | Email already in use |
| 429 | Too many requests |

---

### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "P@ssw0rd1234"
}
```

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "isEmailVerified": true
    }
  }
}
```

> ℹ️ Access token and refresh token are set as httpOnly cookies automatically.

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | Validation error |
| 401 | Invalid credentials. X attempts remaining |
| 403 | Please verify your email first |
| 423 | Account locked. Please reset your password |
| 429 | Too many login attempts |

---

### Logout

```http
POST /auth/logout
```

**Auth:** ✅ Required (httpOnly cookie)

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully",
  "data": null
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | Unauthorized |

---


## OTP

### Verify Email

```http
POST /otp/verify-email
```

**Request Body:**
```json
{
  "code": "1234"
}
```

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Email verified successfully",
  "data": {
    "message": "Email verified successfully"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | OTP already used |
| 400 | OTP has expired |
| 404 | Invalid OTP |
| 429 | Too many requests |

---

### Forgot Password

```http
POST /otp/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP sent successfully",
  "data": {
    "message": "If this email is registered you will receive an OTP"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 403 | Please verify your email first |
| 423 | Account locked |
| 429 | Too many requests |

---

### Reset Password

```http
POST /otp/reset-password
```

**Request Body:**
```json
{
  "code": "1234",
  "newPassword": "NewP@ssw0rd1234"
}
```

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully",
  "data": {
    "message": "Password reset successfully"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | OTP already used |
| 400 | OTP has expired |
| 404 | Invalid OTP |
| 429 | Too many requests |

---

### View Shoe

```http
POST /otp/view-shoe
```

**Auth:** ✅ Required (httpOnly cookie)

**Request Body:**
```json
{
  "code": "1234"
}
```

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Shoe details fetched successfully",
  "data": {
    "shoe": {
      "id": "uuid",
      "modelNumber": "NK-AIR-001",
      "brand": "Nike",
      "name": "Air Max",
      "description": "Classic Nike Air Max shoes",
      "manufactureAt": "2024-01-15T00:00:00.000Z",
      "imageUrl": "https://res.cloudinary.com/your-cloud/shoes/abc123.jpg"
    },
    "authenticity": {
      "isAuthentic": true,
      "reason": "This shoe is genuine and registered to you"
    },
    "warranty": {
      "isActive": true,
      "warrantyExpiresAt": "2025-01-15T00:00:00.000Z",
      "remainingDays": 265,
      "status": "Active ✅"
    }
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | OTP already used |
| 400 | OTP has expired |
| 400 | Invalid OTP |
| 401 | Unauthorized |
| 404 | Shoe not found |
| 429 | Too many requests |

---

## Shoes

### Create Shoe (Admin)

```http
POST /shoes
```

**Auth:** ✅ Required (Admin only)

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| modelNumber | string | ✅ | Unique model number |
| brand | string | ✅ | Brand name |
| name | string | ✅ | Shoe name |
| description | string | ✅ | Shoe description |
| manufactureAt | string | ✅ | Format: YYYY/MM/DD |
| image | file | ❌ | Shoe image (jpeg, jpg, png, gif, webp) max 5MB |

**Success Response:** `201`
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Shoe created successfully",
  "data": {
    "id": "uuid",
    "modelNumber": "NK-AIR-001",
    "brand": "Nike",
    "name": "Air Max",
    "description": "Classic Nike Air Max shoes",
    "manufactureAt": "2024-01-15T00:00:00.000Z",
    "imageUrl": "https://res.cloudinary.com/your-cloud/shoes/abc123.jpg",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden - Insufficient permissions |
| 409 | Shoe with this model number already exists |

---

### Get All Shoes (Admin)

```http
GET /shoes?page=1&limit=10
```

**Auth:** ✅ Required (Admin only)

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Shoes fetched successfully",
  "data": {
    "shoes": [
      {
        "id": "uuid",
        "modelNumber": "NK-AIR-001",
        "brand": "Nike",
        "name": "Air Max",
        "description": "Classic Nike Air Max shoes",
        "manufactureAt": "2024-01-15T00:00:00.000Z",
        "imageUrl": "https://res.cloudinary.com/your-cloud/shoes/abc123.jpg",
        "createdBy": {
          "id": "uuid",
          "fullName": "Admin User",
          "email": "admin@example.com"
        },
        "createdAt": "2024-01-15T00:00:00.000Z",
        "updatedAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "meta": {
      "total": 20,
      "page": 1,
      "limit": 10,
      "totalPages": 2,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Get Single Shoe (Admin)

```http
GET /shoes/:modelNumber
```

**Auth:** ✅ Required (Admin only)

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| modelNumber | string | Shoe model number |

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Shoe fetched successfully",
  "data": {
    "id": "uuid",
    "modelNumber": "NK-AIR-001",
    "brand": "Nike",
    "name": "Air Max",
    "description": "Classic Nike Air Max shoes",
    "manufactureAt": "2024-01-15T00:00:00.000Z",
    "imageUrl": "https://res.cloudinary.com/your-cloud/shoes/abc123.jpg",
    "createdBy": {
      "id": "uuid",
      "fullName": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 404 | Shoe not found |

---

### Update Shoe (Admin)

```http
PUT /shoes/:modelNumber
```

**Auth:** ✅ Required (Admin only)

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| modelNumber | string | Shoe model number |

**Request Body:** (all fields optional)
```json
{
  "brand": "Nike",
  "name": "Air Max 2024",
  "description": "Updated description",
  "manufactureAt": "2024/06/01"
}
```

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Shoe updated successfully",
  "data": {
    "id": "uuid",
    "modelNumber": "NK-AIR-001",
    "brand": "Nike",
    "name": "Air Max 2024",
    "description": "Updated description",
    "manufactureAt": "2024-06-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 404 | Shoe not found |

---

### Delete Shoe (Admin)

```http
DELETE /shoes/:modelNumber
```

**Auth:** ✅ Required (Admin only)

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| modelNumber | string | Shoe model number |

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Shoe deleted successfully",
  "data": {
    "message": "Shoe deleted successfully"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 404 | Shoe not found |

---

### Verify Shoe (User)

```http
POST /shoes/verify
```

**Auth:** ✅ Required (httpOnly cookie)

**Request Body:**
```json
{
  "modelNumber": "NK-AIR-001"
}
```

**Success Response:** `200`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP sent successfully",
  "data": {
    "message": "OTP sent to your email"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 403 | You have not purchased this shoe |
| 404 | Shoe not found |
| 429 | Too many requests |

---

## Purchases

### Purchase Shoe

```http
POST /purchases
```

**Auth:** ✅ Required (httpOnly cookie)

**Request Body:**
```json
{
  "modelNumber": "NK-AIR-001"
}
```

**Success Response:** `201`
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Shoe Purchase Successful",
  "data": {
    "message": "Shoe purchased successfully"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 404 | Shoe not found |
| 409 | Shoe already purchased |

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [],
  "stack": "Error stack trace (development only)"
}
```

---

## Rate Limiting

| Route | Limit | Window |
|-------|-------|--------|
| All routes | 100 requests | 15 minutes |
| Login | 5 attempts | 10 minutes |
| OTP routes | 3 requests | 1 minute |
| Shoe verify | 3 requests | 1 minute |

> ℹ️ When rate limit is exceeded, the API returns `429 Too Many Requests` with a message indicating how many seconds to wait.

---

## Cookie Strategy

| Cookie | Expiry | Description |
|--------|--------|-------------|
| `accessToken` | 15 minutes | JWT access token |
| `refreshToken` | 7 days | JWT refresh token |

> ℹ️ Both cookies are `httpOnly` and `sameSite: strict` for security. The access token is automatically refreshed using the refresh token when it expires.
