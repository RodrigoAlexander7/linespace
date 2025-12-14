# API Proxy Architecture

## Problem Solved

Cross-domain cookies don't work reliably even with `SameSite=None`. When the frontend (Vercel) and backend (Render) are on different domains, browsers don't send cookies in requests, causing 401 Unauthorized errors.

## Solution: API Proxy Pattern

Instead of the browser making requests directly to the backend:

```
Browser → Backend (different domain) ❌ cookies don't send
```

We proxy through Next.js API routes:

```
Browser → Next.js API Route → Backend ✅ cookies work!
```

## How It Works

### 1. Browser makes same-origin requests
- All API calls go to `/api/proxy/*` (same domain as frontend)
- Cookies are automatically included (same-origin)
- No CORS issues

### 2. Next.js API Route acts as proxy
- Located at `src/app/api/proxy/[...path]/route.ts`
- Reads the httpOnly cookie `access_token`
- Forwards request to backend with `Authorization: Bearer {token}` header
- Returns backend response to browser

### 3. Backend processes normally
- Receives standard Bearer token authentication
- No changes needed to backend code

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Browser (linespace-core.vercel.app)                         │
│                                                              │
│  1. GET /api/proxy/notes                                    │
│     Cookie: access_token=xyz (auto-included)                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Next.js API Route (/api/proxy/[...path])                   │
│                                                              │
│  2. Extract cookie: access_token                            │
│  3. Add header: Authorization: Bearer xyz                   │
│  4. Forward to: BACKEND_URL/notes                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend (linespace.onrender.com)                            │
│                                                              │
│  5. Validate JWT token                                      │
│  6. Return data                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
                    (Response flows back)
```

## Files Modified

### `src/lib/apis.ts`
Changed `baseURL` from direct backend URL to `/api/proxy`:

```typescript
export const api = axios.create({
  baseURL: '/api/proxy',  // Routes through our proxy
  withCredentials: true,   // Includes cookies automatically
});
```

### `src/app/api/proxy/[...path]/route.ts` (NEW)
Catch-all proxy route that:
- Handles all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Extracts `access_token` cookie
- Forwards requests with Authorization header
- Preserves query parameters and request body
- Returns backend response transparently

## Benefits

✅ **Secure**: Cookies remain httpOnly (not accessible to JavaScript)  
✅ **Simple**: No client-side token management  
✅ **Flexible**: Frontend and backend can be on any domains  
✅ **Transparent**: Existing API client code works without changes  
✅ **Maintainable**: Clear separation of concerns  

## Configuration

### Production (Vercel)
```bash
BACKEND_URL=https://linespace.onrender.com
```

### Development
```bash
BACKEND_URL=http://localhost:3000
# Optional: bypass proxy for direct backend access
# NEXT_PUBLIC_USE_PROXY=false
```

## Testing

### 1. Verify proxy is working
```bash
# After login, check cookies in DevTools
Application → Cookies → access_token should exist

# Network tab: requests should go to /api/proxy/*
GET /api/proxy/notes → 200 OK
```

### 2. Verify authentication
```bash
# Requests should include Authorization header to backend
# (visible in backend logs, not browser)
```

### 3. Test CRUD operations
- Create a note
- Update a note  
- Delete a note
- Fetch notes/categories/groups

All should work without 401 errors.

## Troubleshooting

### Still getting 401 errors
- Verify cookie exists: DevTools → Application → Cookies
- Check cookie is set after login
- Verify `BACKEND_URL` env var is correct in Vercel

### Proxy not working
- Check Next.js build logs for errors
- Verify route file exists: `src/app/api/proxy/[...path]/route.ts`
- Check backend is accessible from Vercel (not just localhost)

### Development: direct backend access
Set `NEXT_PUBLIC_USE_PROXY=false` to bypass proxy:
```bash
# .env.local
NEXT_PUBLIC_USE_PROXY=false
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## Code Quality

- ✅ **Modular**: Separate functions for headers, methods, error handling
- ✅ **Type-safe**: Full TypeScript types with Next.js Request/Response
- ✅ **Error handling**: Comprehensive try-catch with proper error responses
- ✅ **Documented**: Inline comments explain each part
- ✅ **Maintainable**: Easy to extend with new features (caching, rate limiting, etc.)

## Future Enhancements

Possible improvements:
- Add request/response logging for debugging
- Implement caching for GET requests
- Add rate limiting per user
- Support WebSocket proxying if needed
- Add request retry logic for transient failures
