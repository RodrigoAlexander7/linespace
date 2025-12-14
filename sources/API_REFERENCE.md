# API Reference

Base URL: `http://localhost:3000`

All endpoints require authentication via JWT token in HTTP-only cookie.

## Groups

### Create Group
```http
POST /groups
Content-Type: application/json

{
  "name": "Work Projects"
}
```

### Get All Groups
```http
GET /groups

Response:
[
  {
    "id": "clx...",
    "name": "Work Projects",
    "userId": "clx...",
    "createdAt": "2025-12-14T...",
    "updatedAt": "2025-12-14T...",
    "_count": {
      "notes": 5
    }
  }
]
```

### Get Group by ID
```http
GET /groups/:id

Response:
{
  "id": "clx...",
  "name": "Work Projects",
  "userId": "clx...",
  "notes": [...],
  "_count": {
    "notes": 5
  }
}
```

### Update Group
```http
PATCH /groups/:id
Content-Type: application/json

{
  "name": "Updated Name"
}
```

### Delete Group
```http
DELETE /groups/:id

Response:
{
  "message": "Group deleted successfully"
}
```

## Notes

### Create Note
```http
POST /notes
Content-Type: application/json

{
  "title": "Meeting Notes",
  "content": "Discussed project timeline and milestones...",
  "groupId": "clx...",
  "categoryIds": ["clx...", "clx..."]  // optional
}
```

### Get All Notes
```http
GET /notes?status=ACTIVE&categoryId=clx...&groupId=clx...

Query Parameters:
- status: ACTIVE | ARCHIVED | TRASHED (optional)
- categoryId: string (optional)
- groupId: string (optional)

Response:
[
  {
    "id": "clx...",
    "title": "Meeting Notes",
    "content": "Discussed...",
    "status": "ACTIVE",
    "groupId": "clx...",
    "createdAt": "2025-12-14T...",
    "updatedAt": "2025-12-14T...",
    "categories": [
      {
        "category": {
          "id": "clx...",
          "name": "Work",
          "color": "#3B82F6"
        }
      }
    ],
    "group": {
      "id": "clx...",
      "name": "Work Projects"
    }
  }
]
```

### Get Note by ID
```http
GET /notes/:id

Response: Same as single note object above
```

### Update Note
```http
PATCH /notes/:id
Content-Type: application/json

{
  "title": "Updated Title",        // optional
  "content": "Updated content...",  // optional
  "status": "ARCHIVED",             // optional
  "categoryIds": ["clx..."]         // optional
}
```

### Archive Note
```http
PATCH /notes/:id/archive

Response: Updated note object with status: "ARCHIVED"
```

### Unarchive Note
```http
PATCH /notes/:id/unarchive

Response: Updated note object with status: "ACTIVE"
```

### Delete Note
```http
DELETE /notes/:id

Response:
{
  "message": "Note deleted successfully"
}
```

## Categories

### Create Category
```http
POST /categories
Content-Type: application/json

{
  "name": "Work",
  "color": "#3B82F6"  // optional, hex color
}
```

### Get All Categories
```http
GET /categories

Response:
[
  {
    "id": "clx...",
    "name": "Work",
    "color": "#3B82F6",
    "userId": "clx...",
    "createdAt": "2025-12-14T...",
    "updatedAt": "2025-12-14T...",
    "_count": {
      "notes": 3
    }
  }
]
```

### Get Category by ID
```http
GET /categories/:id

Response:
{
  "id": "clx...",
  "name": "Work",
  "color": "#3B82F6",
  "userId": "clx...",
  "notes": [...],
  "_count": {
    "notes": 3
  }
}
```

### Update Category
```http
PATCH /categories/:id
Content-Type: application/json

{
  "name": "Updated Name",  // optional
  "color": "#EF4444"       // optional
}
```

### Delete Category
```http
DELETE /categories/:id

Response:
{
  "message": "Category deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Category with this name already exists"
}
```

## Validation Rules

### Groups
- `name`: required, string, max 100 characters

### Notes
- `title`: required, string, max 200 characters
- `content`: required, string
- `groupId`: required, valid group ID
- `categoryIds`: optional, array of valid category IDs
- `status`: optional, must be ACTIVE | ARCHIVED | TRASHED

### Categories
- `name`: required, string, max 50 characters, unique per user
- `color`: optional, must be valid hex color format (#RRGGBB)

## Status Codes

- `200 OK`: Successful GET, PATCH
- `201 Created`: Successful POST
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Duplicate resource (e.g., category name)
- `500 Internal Server Error`: Server error
