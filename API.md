# PlaceX Authentication API

All responses are JSON. Protected routes require `Authorization: Bearer <access-token>`.

Successful responses include `"success": true`. Validation failures return HTTP 400 with:

```json
{
  "success": false,
  "errors": {
    "field_name": ["Error message."]
  }
}
```

## Routes


| Method | Route                        | Auth     | Purpose                                                        |
| ------ | ---------------------------- | -------- | -------------------------------------------------------------- |
| POST   | `/api/auth/register/`        | Public   | Create an account and receive tokens.                          |
| POST   | `/api/auth/login/`           | Public   | Sign in using `identifier` (email or username) and `password`. |
| POST   | `/api/auth/refresh/`         | Public   | Exchange a refresh token for a new token pair.                 |
| POST   | `/api/auth/verify/`          | Public   | Verify that an access or refresh token is valid.               |
| POST   | `/api/auth/logout/`          | Required | Invalidate a refresh token.                                    |
| GET    | `/api/auth/me/`              | Required | Get the authenticated user's profile.                          |
| PATCH  | `/api/auth/me/`              | Required | Update `username`, `email`, `first_name`, or `last_name`.      |
| POST   | `/api/auth/change-password/` | Required | Change the authenticated user's password.                      |




## Registration request

```json
{
  "username": "Shivu",
  "email": "Shivu@example.com",
  "password": "StrongPass123!",
  "password_confirm": "StrongPass123!"
}
```



## Login request

```json
{
  "identifier": "Shivu@example.com",
  "password": "StrongPass123!"
}
```



## Validation rules

- **username**: 3-150 characters; letters, numbers, dots, hyphens, and underscores only; must be unique.
- **email**: Valid email format; must be unique.
- **password**: Minimum 8 characters; must pass Django's built-in password validators.
- **password_confirm / new_password_confirm**: Must match the corresponding password field.
- **identifier** (login): Required; accepts either email or username.

