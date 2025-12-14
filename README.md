# Notes Application - Full-Stack Implementation

A modern, full-stack notes application built with NestJS, Next.js, Prisma, and PostgreSQL.

## 🎯 Overview

This project implements a complete notes management system with groups, categories, and comprehensive CRUD operations. It features a modular backend architecture, feature-based frontend organization, and secure authentication using Passport.js with HTTP-only cookies.

## ✨ Features

### Core Functionality
- ✅ **User Authentication**: Secure login with JWT and HTTP-only cookies
- ✅ **Groups Management**: Organize notes into groups
- ✅ **Notes CRUD**: Create, read, update, delete notes
- ✅ **Archive System**: Archive and unarchive notes
- ✅ **Categories/Tags**: Color-coded categories for note organization
- ✅ **Advanced Filtering**: Filter notes by status, category, and group
- ✅ **Responsive UI**: Modern, responsive design with Tailwind CSS

### User Stories Implemented
1. ✅ Create, edit, and delete notes
2. ✅ Archive/unarchive notes
3. ✅ List active notes
4. ✅ List archived notes
5. ✅ Add/remove categories to notes
6. ✅ Filter notes by category

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Groups     │  │    Notes     │  │  Categories  │      │
│  │   Feature    │  │   Feature    │  │   Feature    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │               │                   │              │
│           └───────────────┴───────────────────┘              │
│                           │                                  │
│                   ┌───────▼────────┐                        │
│                   │  API Services   │                        │
│                   │    (Axios)      │                        │
│                   └───────┬────────┘                        │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTP + Cookies
┌───────────────────────────▼─────────────────────────────────┐
│                      Backend (NestJS)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Groups     │  │    Notes     │  │  Categories  │      │
│  │   Module     │  │   Module     │  │   Module     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │               │                   │              │
│           └───────────────┴───────────────────┘              │
│                           │                                  │
│                   ┌───────▼────────┐                        │
│                   │ Prisma Service  │                        │
│                   └───────┬────────┘                        │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────────────┐   │
│  │  User  │  │ Group  │  │  Note  │  │    Category    │   │
│  └────────┘  └────────┘  └────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
.
├── apps/
│   ├── backend/              # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/         # Authentication module
│   │   │   ├── users/        # Users module
│   │   │   ├── groups/       # Groups module (NEW)
│   │   │   ├── notes/        # Notes module (NEW)
│   │   │   ├── categories/   # Categories module (NEW)
│   │   │   └── prisma/       # Prisma service
│   │   └── prisma/
│   │       └── schema.prisma # Database schema
│   │
│   └── frontend/             # Next.js frontend
│       └── src/
│           ├── features/
│           │   ├── groups/   # Groups feature (NEW)
│           │   ├── notes/    # Notes feature (NEW)
│           │   └── categories/ # Categories feature (NEW)
│           └── lib/
│               └── api/      # API client services (NEW)
│
├── ARCHITECTURE.md           # Detailed architecture docs
├── API_REFERENCE.md          # Complete API documentation
├── QUICKSTART.md             # Setup and development guide
├── IMPLEMENTATION_SUMMARY.md # Implementation summary
└── MIGRATION_CHECKLIST.md    # Setup verification checklist
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL database

### Backend Setup
```bash
cd apps/backend
pnpm install
cp .env.example .env
# Edit .env with your DATABASE_URL and AUTH_SECRET
pnpm prisma migrate dev
pnpm prisma generate
pnpm start:dev
```

### Frontend Setup
```bash
cd apps/frontend
pnpm install
pnpm dev
```

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture overview, database schema, and design decisions
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API endpoint documentation with examples
- **[QUICKSTART.md](./QUICKSTART.md)** - Setup instructions and development workflow
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Summary of all implemented features
- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Verification checklist for setup

## 🛠️ Technology Stack

### Backend
- **NestJS** - Modular Node.js framework
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **class-validator** - DTO validation

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **lucide-react** - Icon library

## 🎨 Key Features

### Backend
- Modular architecture with clear separation of concerns
- Service layer for business logic
- DTO validation on all inputs
- Proper error handling with status codes
- User authorization on all endpoints
- Cascade delete support for referential integrity

### Frontend
- Feature-based organization
- Reusable component library
- Type-safe API clients
- Optimistic UI updates
- Responsive design
- Color-coded category system

## 📊 Database Schema

```
User (1) ─────< (∞) Groups (1) ─────< (∞) Notes
 │                                          ╱ │ ╲
 │                                        ╱   │   ╲
 └─────< (∞) Categories ────< (∞) NoteCategory (junction)
```

- Users have multiple Groups and Categories
- Groups belong to Users and contain multiple Notes
- Notes belong to Groups and can have multiple Categories
- Categories belong to Users and can be applied to multiple Notes
- NoteCategory is a junction table for the many-to-many relationship

## 🔐 Security

- JWT authentication with HTTP-only cookies
- User ownership validation on all operations
- Input validation with class-validator
- CORS configuration
- SQL injection protection via Prisma
- Authorization checks on all endpoints

## 🧪 Testing

See [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) for manual testing checklist.

### Run Tests (when implemented)
```bash
# Backend
cd apps/backend
pnpm test
pnpm test:e2e

# Frontend
cd apps/frontend
pnpm test
```

## 📦 Building for Production

```bash
# Backend
cd apps/backend
pnpm build
pnpm start:prod

# Frontend
cd apps/frontend
pnpm build
pnpm start
```

## 🤝 Contributing

1. Follow the modular architecture patterns
2. Add DTOs for new endpoints
3. Validate all inputs
4. Add proper error handling
5. Update documentation
6. Add tests for new features

## 📝 License

This project is [MIT licensed](LICENSE).

## 🎯 Project Status

✅ **Complete** - All user stories and requirements have been implemented.

- ✅ Modular backend architecture
- ✅ Feature-based frontend organization
- ✅ Full CRUD operations for Groups, Notes, and Categories
- ✅ Archive/unarchive functionality
- ✅ Category filtering
- ✅ Active/archived note lists
- ✅ HTTP-only cookie authentication
- ✅ Comprehensive documentation

## 🔗 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Built with ❤️ using modern web technologies**
