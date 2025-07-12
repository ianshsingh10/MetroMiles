#  Backend API Documentation

## User Registration Endpoint

`/users/register`

## HTTP Method
`POST`
## Description

Registers a new user in the MetroMiles system. Requires user details including first name, email, and password. Returns a JWT token upon successful registration.

## Request Body

Send a JSON object with the following structure:

```json
{
  "firstName": "John",
  "lastName": "Doe",         // Optional
  "email": "john@example.com",
  "password": "yourpassword"
}
```

### Field Requirements

- `firstName` (string, required): User's first name.
- `lastName` (string, optional): User's last name.
- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.

## Responses

| Status Code | Description                                 | Response Example                                      |
|-------------|---------------------------------------------|-------------------------------------------------------|
| 200         | User registered successfully                | `{ "message": "User registered successfully", "user": { "id": "...", "fullname": { "firstName": "...", "lastName": "..." }, "email": "..." }, "token": "..." }` |
| 400         | Validation error or user already exists     | `{ "errors": [ ... ] }` or `{ "message": "User already exists" }` |
| 500         | Internal server error                       | `{ "message": "Internal server error" }`              |

## Example Request

```http
POST /users/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "securePass123"
}
```

## Example Success Response

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "60f7c2b8e1d2c8a1b8e4d123",
    "fullname": {
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "email": "jane.smith@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## User Login Endpoint

`/users/login`

## HTTP Method
`POST`

## Description

Authenticates a user in the MetroMiles system. Requires email and password. Returns a JWT token upon successful login.

## Request Body

Send a JSON object with the following structure:

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

### Field Requirements

- `email` (string, required): Must be a valid email address.
- `password` (string, required): User's password.

## Responses

| Status Code | Description                                 | Response Example                                      |
|-------------|---------------------------------------------|-------------------------------------------------------|
| 200         | Login successful                            | `{ "message": "Login successful", "user": { "id": "...", "fullname": { "firstName": "...", "lastName": "..." }, "email": "..." }, "token": "..." }` |
| 400         | Validation error or invalid credentials     | `{ "errors": [ ... ] }` or `{ "message": "Invalid email or password" }` |
| 500         | Internal server error                       | `{ "message": "Internal server error" }`              |

## Example Request

```http
POST /users/login
Content-Type: application/json

{
  "email": "jane.smith@example.com",
  "password": "securePass123"
}
```

## Example Success Response

```json
{
  "message": "Login successful",
  "user": {
    "id": "60f7c2b8e1d2c8a1b8e4d123",
    "fullname": {
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "email": "jane.smith@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## User Profile Endpoint

`/users/profile`

## HTTP Method
`GET`

## Description

Returns the authenticated user's profile information. Requires a valid JWT token.

## Authentication

Send the JWT token in the `Authorization` header as `Bearer <token>` or as a cookie named `token`.

## Responses

| Status Code | Description                | Response Example                                      |
|-------------|----------------------------|-------------------------------------------------------|
| 200         | Profile fetched successfully | `{ "id": "...", "fullname": { "firstName": "...", "lastName": "..." }, "email": "..." }` |
| 401         | Unauthorized               | `{ "message": "Authentication required" }`            |
| 500         | Internal server error       | `{ "message": "Internal server error" }`              |

## Example Request

```http
GET /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Example Success Response

```json
{
  "id": "60f7c2b8e1d2c8a1b8e4d123",
  "fullname": {
    "firstName": "Jane",
    "lastName": "Smith"
  },
  "email": "jane.smith@example.com"
}
```

---

## User Logout Endpoint

`/users/logout`

## HTTP Method
`GET`

## Description

Logs out the authenticated user by blacklisting the JWT token and clearing the authentication cookie.

## Authentication

Send the JWT token in the `Authorization` header as `Bearer <token>` or as a cookie named `token`.

## Responses

| Status Code | Description                | Response Example                                      |
|-------------|----------------------------|-------------------------------------------------------|
| 200         | Logout successful          | `{ "message": "Logout successful" }`                  |
| 401         | Authentication token missing| `{ "message": "Authentication token is missing" }`    |
| 500         | Internal server error       | `{ "message": "Internal server error" }`              |

## Example Request

```http
GET /users/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Example Success Response

```json
{
  "message": "Logout successful"
}
```
