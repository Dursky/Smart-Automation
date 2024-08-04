# Smart Automation

## REST API

### Authentication

#### Register a new user

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "newuser",
    "password": "password123",
    "email": "user@example.com"
  }
  ```

Success Response:

```json
Code: 201
Content:
json{
"message": "User registered successfully",
"user": {
"id": "user_id",
"username": "newuser",
"email": "user@example.com"
}
}
```

Login

```json
URL: /api/auth/login
Method: POST
Body:
json{
"username": "newuser",
"password": "password123"
}
```

Success Response:

```json
Code: 200
Content:
json{
"token": "JWT_TOKEN_HERE",
"user": {
"id": "user_id",
"username": "newuser",
"email": "user@example.com"
}
}
```

Devices
Get all devices

```json
URL: /api/devices
Method: GET
Headers:

Authorization: Bearer JWT_TOKEN_HERE
```

Success Response:

```json
Code: 200
Content:
json[
{
"id": "device_1",
"name": "Living Room Light",
"state": "ON"
},
{
"id": "device_2",
"name": "Bedroom Light",
"state": "OFF"
}
]
```

## WebSocket API

Connect to WebSocket server at `ws://your-server-url` with the following query parameter:
?token=JWT_TOKEN_HERE
Events
Get Devices

```json
Emit Event: getDevices
Listen Event: deviceList
Response:
[
{
"id": "device_1",
"name": "Living Room Light",
"state": "ON"
},
{
"id": "device_2",
"name": "Bedroom Light",
"state": "OFF"
}
]
```

Toggle Device

```json
Emit Event: toggleDevice
Payload:
{
"deviceId": "device_1",
"state": "ON"
}

Listen Event: toggleResult
Response:
{
"success": true,
"deviceId": "device_1",
"state": "ON"
}
```

Create Scene

```json
Emit Event: createScene
Payload:
{
"name": "Evening Mode",
"actions": [
{ "deviceId": "device_1", "state": "ON" },
{ "deviceId": "device_2", "state": "OFF" }
]
}
```

Listen Event: sceneCreated
Response:

```json
{
  "success": true,
  "sceneId": "scene_1"
}
```

Get Scenes

```json
Emit Event: getScenes
Listen Event: sceneList
Response:
[
{
"id": "scene_1",
"name": "Evening Mode",
"actions": [
{ "deviceId": "device_1", "state": "ON" },
{ "deviceId": "device_2", "state": "OFF" }
]
}
]
```

Execute Scene

```json
Emit Event: executeScene
Payload: "scene_1"
Listen Event: sceneExecuted
Response:
{
"success": true,
"sceneId": "scene_1"
}
```

Real-time Updates
The server will emit the following events without client request:

```json
Event: deviceUpdated
json{
"id": "device_1",
"name": "Living Room Light",
"state": "ON"
}
```

Event: deviceLost
`"device_1"`

Error Handling
All API endpoints and WebSocket events will return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Notes

All requests requiring authentication should include the JWT token in the Authorization header for REST API calls or as a query parameter for WebSocket connections.
WebSocket connections will be closed if the token is invalid or expired.
Ensure to handle connection errors and implement reconnection logic in your WebSocket client.
