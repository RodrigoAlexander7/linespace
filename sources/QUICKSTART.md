# Quick Start Guide

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database running
- Git

## Initial Setup

### 1. Backend Setup

```bash
cd apps/backend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env and set:
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
# AUTH_SECRET="your-secret-key-here"
# GOOGLE_CLIENT_ID="your-google-oauth-id" (optional)
# GOOGLE_CLIENT_SECRET="your-google-oauth-secret" (optional)

# Run database migrations
pnpm prisma migrate dev

# Generate Prisma client
pnpm prisma generate

# Start backend server
pnpm start:dev
```

Backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd apps/frontend

# Install dependencies
pnpm install

# Configure environment (if needed)
# The default points to http://localhost:3000
# Create .env.local if you need custom config:
# BACKEND_URL="http://localhost:3000"

# Start frontend development server
pnpm dev
```

Frontend will run on `http://localhost:3001` (or next available port)

## First Time Usage

1. **Create Account**: Navigate to `/login` and register
2. **Login**: Use your credentials to log in
3. **Create Categories**: Start by creating some categories for organizing notes
4. **Create Groups**: Create groups to organize your notes
5. **Create Notes**: Add notes to your groups with categories

## Database Management

### View Data in Prisma Studio
```bash
cd apps/backend
pnpm prisma studio
```
Opens at `http://localhost:5555`

### Reset Database (Development Only!)
```bash
cd apps/backend
pnpm prisma migrate reset
```

### Create New Migration
```bash
cd apps/backend
pnpm prisma migrate dev --name description_of_changes
```

## Testing the API

### Using cURL

```bash
# Login to get cookie
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt

# Create a group (with cookie)
curl -X POST http://localhost:3000/groups \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Work Notes"}'

# Get all groups
curl -X GET http://localhost:3000/groups \
  -b cookies.txt
```

### Using Postman/Insomnia

1. Import the API_REFERENCE.md as a guide
2. Enable "Send cookies automatically"
3. Login first to establish session
4. Make subsequent requests with cookies

## Common Issues

### Backend won't start
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `pnpm prisma generate`
- Check for port conflicts

### Frontend can't reach backend
- Verify backend is running on port 3000
- Check CORS settings if using different domain
- Ensure cookies are being sent (withCredentials: true)

### Migration errors
- Check database connection
- Ensure no conflicting migrations
- Try `pnpm prisma migrate reset` (development only!)

### TypeScript errors
- Run `pnpm install` in both frontend and backend
- Restart TypeScript server in VS Code
- Check for missing dependencies

## Development Workflow

### Making Schema Changes

1. Update `apps/backend/prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name your_change_name`
3. Generated client updates automatically
4. Update TypeScript types if needed
5. Update API services and components

### Adding New Features

Backend:
1. Create module folder in `src/`
2. Add DTOs in `dto/` subfolder
3. Create service with business logic
4. Create controller with endpoints
5. Add module to `app.module.ts`

Frontend:
1. Create feature folder in `src/features/`
2. Add components in `components/` subfolder
3. Create API service in `src/lib/api/`
4. Add to dashboard or route as needed

## Production Deployment

### Backend
```bash
cd apps/backend
pnpm build
pnpm start:prod
```

### Frontend
```bash
cd apps/frontend
pnpm build
pnpm start
```

### Environment Variables for Production
- Set strong AUTH_SECRET
- Use production database URL
- Configure CORS for your domain
- Set NODE_ENV=production
- Use secure cookies (httpOnly, secure, sameSite)

## Useful Commands

```bash
# Backend
pnpm start:dev          # Start dev server with hot reload
pnpm lint               # Run ESLint
pnpm test               # Run tests
pnpm test:watch         # Run tests in watch mode

# Frontend
pnpm dev                # Start dev server
pnpm build              # Build for production
pnpm lint               # Run ESLint

# Database
pnpm prisma studio      # Open database GUI
pnpm prisma db pull     # Pull schema from database
pnpm prisma db push     # Push schema to database (no migration)
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

See [API_REFERENCE.md](./API_REFERENCE.md) for complete API documentation.

## Support

For issues or questions:
1. Check the documentation files
2. Review the code comments
3. Check Prisma/NestJS/Next.js official docs
4. Look at the example implementations in the codebase
