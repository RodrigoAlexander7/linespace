# Notes Application - Architecture & Implementation Guide

## 🏗️ Architecture Overview

This is a full-stack notes application with a modular architecture:

- **Backend**: NestJS with modular organization
- **Frontend**: Next.js with feature-based organization
- **Authentication**: Passport.js with HTTP-only cookies
- **Database**: PostgreSQL with Prisma ORM
- **API Communication**: Axios

## 📊 Database Schema

### Models

#### User
- Stores user information (email, name, password, OAuth data)
- Has many Groups and Categories

#### Group
- Organizes notes into collections
- Belongs to a User
- Has many Notes
- Cascade delete: Deleting a group deletes all its notes

#### Note
- Individual notes with title and content
- Belongs to a Group
- Has a status: ACTIVE, ARCHIVED, or TRASHED
- Can have multiple Categories (many-to-many relationship)
- Cascade delete: Deleting a note removes its category associations

#### Category
- Tags/labels for organizing notes
- Belongs to a User
- Has a name and optional color (hex format)
- Can be applied to multiple Notes (many-to-many)
- Unique constraint: (userId, name) - prevents duplicate category names per user

#### NoteCategory (Join Table)
- Junction table for many-to-many relationship between Notes and Categories
- Cascade delete on both sides

## 🔧 Backend Structure (NestJS)

### Modular Organization

```
src/
├── auth/               # Authentication module (Passport strategies)
├── users/              # User management
├── groups/             # Group CRUD operations
├── notes/              # Note CRUD operations with filtering
├── categories/         # Category management
├── prisma/             # Prisma service (database access)
└── configs/            # Configuration and validation
```

### Features by Module

#### Groups Module
- **Create Group**: POST `/groups`
- **Get All Groups**: GET `/groups` (with note count)
- **Get Single Group**: GET `/groups/:id` (with notes)
- **Update Group**: PATCH `/groups/:id`
- **Delete Group**: DELETE `/groups/:id` (cascades to notes)

#### Notes Module
- **Create Note**: POST `/notes` (with optional categories)
- **Get All Notes**: GET `/notes` (with filters: status, categoryId, groupId)
- **Get Single Note**: GET `/notes/:id`
- **Update Note**: PATCH `/notes/:id` (including categories)
- **Archive Note**: PATCH `/notes/:id/archive`
- **Unarchive Note**: PATCH `/notes/:id/unarchive`
- **Delete Note**: DELETE `/notes/:id`

#### Categories Module
- **Create Category**: POST `/categories` (with color)
- **Get All Categories**: GET `/categories` (with note count)
- **Get Single Category**: GET `/categories/:id`
- **Update Category**: PATCH `/categories/:id`
- **Delete Category**: DELETE `/categories/:id`

### Security
- All endpoints require JWT authentication (JwtAuthGuard)
- User ID extracted from JWT token
- Authorization checks ensure users can only access their own data
- ForbiddenException thrown for unauthorized access
- NotFoundException for missing resources

### Validation
- DTOs with class-validator decorators
- Max length constraints on strings
- Enum validation for status fields
- Hex color validation for categories

## 🎨 Frontend Structure (Next.js)

### Feature-Based Organization

```
src/
├── app/
│   ├── (protected)/
│   │   └── (owner)/
│   │       └── dashboard/    # Main dashboard page
│   └── (public)/
│       └── login/            # Authentication pages
├── features/
│   ├── groups/               # Group management feature
│   │   └── components/
│   │       ├── GroupCard.tsx
│   │       ├── GroupForm.tsx
│   │       └── GroupsList.tsx
│   ├── notes/                # Note management feature
│   │   └── components/
│   │       ├── NoteCard.tsx
│   │       ├── NoteForm.tsx
│   │       └── NotesList.tsx
│   └── categories/           # Category management feature
│       └── components/
│           ├── CategoryCard.tsx
│           ├── CategoryForm.tsx
│           └── CategoriesList.tsx
├── lib/
│   ├── api/                  # API client services
│   │   ├── groups.ts
│   │   ├── notes.ts
│   │   └── categories.ts
│   └── apis.ts               # Axios instance
└── middleware/               # Auth and role middleware
```

### UI Components

#### Dashboard Page
- Tab navigation between Notes, Groups, and Categories
- Integrated views with state management
- Group selection flows to filtered notes view

#### Groups Feature
- Grid layout of group cards
- Inline create/edit forms
- Note count display
- Cascade delete warnings

#### Notes Feature
- Separate sections for active and archived notes
- Filter panel (status, category, group)
- Category badges with colors
- Archive/unarchive toggle
- Full CRUD operations
- Multi-category assignment

#### Categories Feature
- Color picker with presets
- Visual color indicators
- Note count per category
- Duplicate name prevention

### State Management
- Local component state with React hooks
- Automatic data reloading after mutations
- Optimistic UI updates
- Error handling with user feedback

### Styling
- Tailwind CSS utility classes
- Responsive grid layouts
- Hover states and transitions
- Color-coded category system
- Accessible form controls

## 🔐 Authentication Flow

1. User logs in via `/login` (local or OAuth)
2. Backend validates credentials
3. JWT token stored in HTTP-only cookie
4. Frontend axios instance sends cookie with every request
5. Backend validates JWT on protected routes
6. User ID extracted from token for authorization

## 🚀 User Stories Implemented

✅ **Create, Edit, and Delete Notes**
- Full CRUD operations through NotesList component
- Inline editing with NoteForm
- Confirmation dialogs for destructive actions

✅ **Archive/Unarchive Notes**
- Archive button on each note card
- Separate sections for active and archived notes
- Quick toggle between states

✅ **List Active Notes**
- Default view shows active notes
- Filter by status: ACTIVE

✅ **List Archived Notes**
- Dedicated section in notes view
- Filter by status: ARCHIVED
- Visual indicator for archived state

✅ **Add/Remove Categories to Notes**
- Multi-select category picker in note form
- Update categories without recreating note
- Visual category badges on note cards

✅ **Filter Notes by Category**
- Filter dropdown in notes view
- Instant filtering on selection
- Combined with status filters

## 🛠️ Setup Instructions

### Backend

```bash
cd apps/backend

# Install dependencies
pnpm install

# Setup environment variables
# Create .env file with:
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
# JWT_SECRET="your-secret-key"

# Run migrations
pnpm prisma migrate dev

# Generate Prisma client
pnpm prisma generate

# Start development server
pnpm start:dev
```

### Frontend

```bash
cd apps/frontend

# Install dependencies
pnpm install

# Setup environment variables
# Create .env.local file with:
# NEXT_PUBLIC_API_URL="http://localhost:3000"

# Start development server
pnpm dev
```

## 📝 API Usage Examples

### Create a Group
```typescript
const group = await groupsApi.create({ name: 'Work Notes' });
```

### Create a Note with Categories
```typescript
const note = await notesApi.create({
  title: 'Meeting Notes',
  content: 'Discussed project timeline...',
  groupId: 'group-id',
  categoryIds: ['cat-1', 'cat-2']
});
```

### Filter Notes
```typescript
const notes = await notesApi.getAll({
  status: NoteStatus.ACTIVE,
  categoryId: 'specific-category',
  groupId: 'specific-group'
});
```

### Archive a Note
```typescript
await notesApi.archive(noteId);
```

## 🎯 Key Design Decisions

1. **Modular Architecture**: Each feature is self-contained with its own controllers, services, and DTOs
2. **Feature-Based Frontend**: UI components organized by feature for better maintainability
3. **Cascade Deletes**: Database constraints ensure referential integrity
4. **Color-Coded Categories**: Visual organization with customizable colors
5. **Status Enum**: Clear note lifecycle (ACTIVE → ARCHIVED → TRASHED)
6. **HTTP-Only Cookies**: Secure authentication token storage
7. **Comprehensive Validation**: Input validation at both DTO and database levels
8. **Optimistic UI**: Immediate feedback with background data synchronization

## 📦 Dependencies

### Backend
- @nestjs/common, @nestjs/core
- @nestjs/passport, passport, passport-jwt, passport-local
- @prisma/client, prisma
- class-validator, class-transformer
- bcrypt (for password hashing)

### Frontend
- next, react, react-dom
- axios
- lucide-react (icons)
- tailwindcss

## 🔄 Next Steps / Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] Rich text editor for note content
- [ ] Drag-and-drop note organization
- [ ] Note sharing between users
- [ ] Full-text search
- [ ] Export notes to PDF/Markdown
- [ ] Dark mode support
- [ ] Mobile app with React Native
- [ ] Note templates
- [ ] Reminders and due dates

## 📄 License

This project follows best practices for scalable web applications and can be adapted for various use cases beyond note-taking.
