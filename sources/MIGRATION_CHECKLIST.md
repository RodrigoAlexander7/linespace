# Migration Checklist - Notes Application

Use this checklist to ensure everything is properly set up.

## ✅ Backend Checklist

- [ ] PostgreSQL database is running
- [ ] `.env` file exists in `apps/backend/`
- [ ] `DATABASE_URL` is set in `.env`
- [ ] `AUTH_SECRET` is set in `.env`
- [ ] Dependencies installed: `cd apps/backend && pnpm install`
- [ ] Prisma Client generated: `pnpm prisma generate`
- [ ] Database migrated: `pnpm prisma migrate dev`
- [ ] Backend starts without errors: `pnpm start:dev`
- [ ] Backend accessible at `http://localhost:3000`

## ✅ Frontend Checklist

- [ ] Dependencies installed: `cd apps/frontend && pnpm install`
- [ ] `lucide-react` installed for icons
- [ ] Frontend starts without errors: `pnpm dev`
- [ ] Frontend accessible at `http://localhost:3001` (or next available port)
- [ ] Can navigate to login page
- [ ] Can navigate to dashboard (after login)

## ✅ Database Schema Verification

Run these commands to verify the schema:

```bash
cd apps/backend
pnpm prisma studio
```

Check that these tables exist:
- [ ] User
- [ ] Group
- [ ] Note
- [ ] Category
- [ ] NoteCategory
- [ ] _prisma_migrations

## ✅ Backend Modules Verification

Check these folders exist in `apps/backend/src/`:
- [ ] `groups/` with controller, service, module, dto/
- [ ] `notes/` with controller, service, module, dto/
- [ ] `categories/` with controller, service, module, dto/
- [ ] `auth/` (existing)
- [ ] `users/` (existing)
- [ ] `prisma/` (existing)

Check `app.module.ts` imports:
- [ ] GroupsModule
- [ ] NotesModule
- [ ] CategoriesModule

## ✅ Frontend Features Verification

Check these folders exist in `apps/frontend/src/features/`:
- [ ] `groups/components/` (GroupCard, GroupForm, GroupsList)
- [ ] `notes/components/` (NoteCard, NoteForm, NotesList)
- [ ] `categories/components/` (CategoryCard, CategoryForm, CategoriesList)

Check API services exist in `apps/frontend/src/lib/api/`:
- [ ] `groups.ts`
- [ ] `notes.ts`
- [ ] `categories.ts`
- [ ] `index.ts`

## ✅ Functionality Testing

### Groups
- [ ] Can create a new group
- [ ] Can view all groups
- [ ] Can edit a group name
- [ ] Can delete a group
- [ ] Group shows note count

### Notes
- [ ] Can create a note in a group
- [ ] Can edit a note
- [ ] Can delete a note
- [ ] Can archive a note
- [ ] Can unarchive a note
- [ ] Active notes show in "Active Notes" section
- [ ] Archived notes show in "Archived Notes" section
- [ ] Can assign categories to notes
- [ ] Categories show as colored badges on notes

### Categories
- [ ] Can create a category
- [ ] Can choose a color for category
- [ ] Can edit category name/color
- [ ] Can delete a category
- [ ] Category shows note count

### Filters
- [ ] Can filter notes by status (Active/Archived)
- [ ] Can filter notes by category
- [ ] Can filter notes by group (when viewing from group)
- [ ] Filters work in combination

### Navigation
- [ ] Can switch between Notes, Groups, and Categories tabs
- [ ] Clicking a group navigates to filtered notes view
- [ ] Dashboard is accessible after login

## ✅ API Testing (Optional but Recommended)

Test with cURL or Postman:

```bash
# Login (replace with actual user)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -c cookies.txt

# Create a category
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Work","color":"#3B82F6"}'

# Create a group
curl -X POST http://localhost:3000/groups \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Project Notes"}'

# Create a note (use actual IDs)
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test Note","content":"Test content","groupId":"GROUP_ID","categoryIds":["CATEGORY_ID"]}'

# Get all notes
curl -X GET http://localhost:3000/notes -b cookies.txt

# Archive a note
curl -X PATCH http://localhost:3000/notes/NOTE_ID/archive -b cookies.txt

# Filter notes by status
curl -X GET "http://localhost:3000/notes?status=ARCHIVED" -b cookies.txt
```

## ✅ Error Handling Verification

- [ ] Creating duplicate category name shows error
- [ ] Deleting group with notes shows confirmation
- [ ] Accessing non-existent resource shows 404
- [ ] Unauthorized access shows 401
- [ ] Validation errors show clear messages

## ✅ Code Quality Checks

Run these commands:

```bash
# Backend
cd apps/backend
pnpm lint              # No critical errors
pnpm build            # Builds successfully

# Frontend
cd apps/frontend
pnpm lint              # No critical errors
pnpm build            # Builds successfully (may take a while)
```

## 🎉 Final Verification

- [ ] All backend endpoints respond correctly
- [ ] All frontend pages load without errors
- [ ] User can complete full workflow: login → create group → create category → create note → archive note → filter notes
- [ ] No console errors in browser
- [ ] No TypeScript errors in VS Code
- [ ] Documentation files are present (ARCHITECTURE.md, API_REFERENCE.md, QUICKSTART.md)

## 🐛 Common Issues and Solutions

### "Cannot find module 'class-validator'"
```bash
cd apps/backend
pnpm install
```

### "Table does not exist" error
```bash
cd apps/backend
pnpm prisma migrate dev
pnpm prisma generate
```

### "401 Unauthorized" on API calls
- Check cookies are being sent (withCredentials: true)
- Verify user is logged in
- Check JWT token is valid

### Frontend "Cannot find module" errors
```bash
cd apps/frontend
pnpm install
```

### "lucide-react" not found
```bash
cd apps/frontend
pnpm add lucide-react
```

## 📝 Notes

- All features from user stories have been implemented
- Database uses cascade deletes for referential integrity
- Authentication uses HTTP-only cookies for security
- Frontend uses feature-based organization
- Backend uses modular architecture
- All code is TypeScript with proper types

## 🎯 Success Criteria Met

✅ Modular backend architecture (NestJS)
✅ Feature-based frontend organization (Next.js)
✅ HTTP-only cookie authentication (Passport + JWT)
✅ Axios for API calls
✅ Complete CRUD for Groups, Notes, and Categories
✅ Archive/unarchive functionality
✅ Category filtering
✅ Active/archived note lists
✅ Proper database relations with Prisma
✅ Comprehensive documentation

---

**Status**: All features implemented and ready for use! 🚀
