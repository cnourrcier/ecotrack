# EcoTrack API Documentation

## Authentication Endpoints

### Register User

URL: /api/register
Method: POST
Body:
jsonCopy{
  "username": "string",
  "email": "string",
  "password": "string"
}

Success Response:

Code: 201
Content: { "message": "User registered successfully" }


Error Response:

Code: 400
Content: { "error": "Error message" }



### Login User

URL: /api/login
Method: POST
Body:
jsonCopy{
  "email": "string",
  "password": "string"
}

Success Response:

Code: 200
Content: { "message": "Logged in successfully", "user": {...} }


Error Response:

Code: 401
Content: { "error": "Invalid credentials" }



### Request Password Reset

URL: /api/reset-password-request
Method: POST
Body:
jsonCopy{
  "email": "string"
}

Success Response:

Code: 200
Content: { "message": "Password reset email sent" }


Error Response:

Code: 404
Content: { "message": "User not found" }



### Confirm Password Reset

URL: /api/reset-password-confirm
Method: POST
Body:
jsonCopy{
  "token": "string",
  "newPassword": "string"
}

Success Response:

Code: 200
Content: { "message": "Password has been reset" }


Error Response:

Code: 400
Content: { "message": "Password reset token is invalid or has expired" }



## Protected Endpoints

### Get Dashboard Data

URL: /api/dashboard
Method: GET
Headers:

Authorization: Bearer [access_token]


Success Response:

Code: 200
Content: { "message": "Welcome to your dashboard", "user": {...} }


Error Response:

Code: 401
Content: { "message": "Authentication required" }



### Get User Profile

URL: /api/profile
Method: GET
Headers:

Authorization: Bearer [access_token]


Success Response:

Code: 200
Content: { "message": "You have access to the profile", "user": {...} }


Error Response:

Code: 401
Content: { "message": "Authentication required" }



Note: All endpoints are subject to rate limiting. Excessive requests may result in a 429 (Too Many Requests) response.