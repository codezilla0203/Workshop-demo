# Complete Testing Guide

This guide will help you test all features of the AI-Augmented Development Demo application.

## Prerequisites

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Create and initialize the database**:
   ```bash
   npx prisma db push
   ```

## Step-by-Step Testing

### 1. Start the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

---

### 2. Test User Signup

1. **Open** http://localhost:3000 in your browser
2. **Click** "Sign up" (or the signup link)
3. **Fill in the form**:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test1234` (must be 8+ chars with uppercase, lowercase, and number)
4. **Click** "Sign Up"
5. **Expected**: You should be redirected to `/dashboard`

**Test Cases**:
- ✅ Valid signup should succeed
- ✅ Duplicate email should show error
- ✅ Weak password (less than 8 chars) should show validation error
- ✅ Password without uppercase/lowercase/number should show error

---

### 3. Test User Login

1. **Go to** http://localhost:3000
2. **Fill in login form**:
   - Email: `test@example.com`
   - Password: `Test1234`
3. **Click** "Sign In"
4. **Expected**: Redirected to `/dashboard`

**Test Cases**:
- ✅ Valid credentials should log in successfully
- ✅ Wrong password should show error
- ✅ Non-existent email should show error

---

### 4. Test User Dashboard

1. **After logging in**, you should see:
   - Welcome message with your name
   - Your email and role (USER)
   - Logout button

**Test Cases**:
- ✅ Dashboard displays user information correctly
- ✅ Logout button works and redirects to home

---

### 5. Create Admin User

**Option A: Using Seed Script**
```bash
npm run seed:admin
```

**Option B: Manual Database Update**
1. Sign up a new user (e.g., `admin@example.com`)
2. Open Prisma Studio:
   ```bash
   npm run db:studio
   ```
3. Find the user and change `role` from `"USER"` to `"ADMIN"`
4. Save changes

**Option C: Via API (after creating first admin)**
- Use the admin panel to create additional admin users

---

### 6. Test Admin Panel

1. **Log in** with an admin account
2. **You should be automatically redirected** to `/admin`
3. **Admin Panel Features to Test**:

#### 6.1 View All Users
- ✅ Table displays all users
- ✅ Shows: Name, Email, Role, Created Date
- ✅ Role badges show correct colors (ADMIN = purple, USER = gray)

#### 6.2 Create New User
1. **Click** "+ Create User" button
2. **Fill in the form**:
   - Name: `New User`
   - Email: `newuser@example.com`
   - Password: `NewPass123`
   - Role: Select `USER` or `ADMIN`
3. **Click** "Create"
4. **Expected**: User appears in the table

**Test Cases**:
- ✅ Creating user with valid data succeeds
- ✅ Duplicate email shows error
- ✅ Password validation works

#### 6.3 Edit User
1. **Click** "Edit" button next to any user
2. **Modify** name or role
3. **Click** "Update"
4. **Expected**: Changes reflected in the table

**Test Cases**:
- ✅ Updating name works
- ✅ Changing role works
- ✅ Empty form shows validation error

#### 6.4 Delete User
1. **Click** "Delete" button next to a user
2. **Confirm** the deletion
3. **Expected**: User removed from table

**Test Cases**:
- ✅ Deletion works correctly
- ✅ Cannot delete yourself (if implemented)
- ✅ Confirmation dialog appears

---

### 7. Test API Endpoints

You can test API endpoints using:
- **Browser** (for GET requests)
- **Postman/Insomnia**
- **curl** commands
- **Thunder Client** (VS Code extension)

#### 7.1 Authentication Endpoints

**Signup**:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"API User","email":"api@example.com","password":"ApiPass123"}'
```

**Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"api@example.com","password":"ApiPass123"}'
```

**Get Current User**:
```bash
curl http://localhost:3000/api/auth/me \
  -H "Cookie: token=YOUR_TOKEN_HERE"
```

**Logout**:
```bash
curl -X POST http://localhost:3000/api/auth/logout
```

#### 7.2 User Management Endpoints (Admin Only)

**List All Users**:
```bash
curl http://localhost:3000/api/users \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

**Create User**:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN_HERE" \
  -d '{"name":"New User","email":"new@example.com","password":"NewPass123","role":"USER"}'
```

**Get User by ID**:
```bash
curl http://localhost:3000/api/users/USER_ID \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

**Update User**:
```bash
curl -X PATCH http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN_HERE" \
  -d '{"name":"Updated Name","role":"ADMIN"}'
```

**Delete User**:
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

---

### 8. Test Security Features

#### 8.1 Authentication
- ✅ **Unauthenticated access**: Try accessing `/dashboard` or `/admin` without logging in
  - **Expected**: Redirected to home page

- ✅ **Invalid token**: Try accessing API with invalid token
  - **Expected**: 401 Unauthorized error

#### 8.2 Authorization
- ✅ **User accessing admin panel**: Log in as regular USER, try to access `/admin`
  - **Expected**: Redirected to `/dashboard`

- ✅ **User accessing admin API**: Try calling `/api/users` as regular user
  - **Expected**: 403 Forbidden error

#### 8.3 Input Validation
- ✅ **Weak passwords**: Try signing up with passwords like:
  - `12345678` (no uppercase/lowercase)
  - `password` (no numbers, too short)
  - `PASSWORD` (no lowercase/numbers)
  - **Expected**: Validation errors

- ✅ **Invalid email**: Try signing up with invalid email format
  - **Expected**: Validation error

- ✅ **SQL Injection**: Try entering SQL in form fields
  - **Expected**: Safely handled by Prisma

---

### 9. Test Error Handling

#### 9.1 API Error Responses
All API endpoints should return consistent error format:
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

**Test Cases**:
- ✅ 400 Bad Request (validation errors)
- ✅ 401 Unauthorized (missing/invalid token)
- ✅ 403 Forbidden (insufficient permissions)
- ✅ 404 Not Found (user doesn't exist)
- ✅ 500 Internal Server Error (server errors)

#### 9.2 Frontend Error Display
- ✅ Error messages display clearly to users
- ✅ Loading states work correctly
- ✅ Forms disable during submission

---

### 10. Test Database Operations

**Using Prisma Studio**:
```bash
npm run db:studio
```

**Test Cases**:
- ✅ Users are stored correctly
- ✅ Passwords are hashed (not plain text)
- ✅ Roles are stored as strings
- ✅ Timestamps (createdAt, updatedAt) work correctly

---

### 11. Test UI/UX

#### 11.1 Responsive Design
- ✅ Test on different screen sizes
- ✅ Mobile view works correctly
- ✅ Tables are scrollable on small screens

#### 11.2 User Experience
- ✅ Loading indicators appear during operations
- ✅ Buttons are disabled during loading
- ✅ Success/error messages are clear
- ✅ Navigation works smoothly

---

### 12. Performance Testing

- ✅ **Page load times**: Check initial page load
- ✅ **API response times**: Monitor API endpoint performance
- ✅ **Database queries**: Check Prisma query logs in development

---

## Quick Test Checklist

- [ ] Signup with valid data
- [ ] Signup with duplicate email (should fail)
- [ ] Signup with weak password (should fail)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Access dashboard as regular user
- [ ] Create admin user
- [ ] Access admin panel as admin
- [ ] View all users in admin panel
- [ ] Create new user via admin panel
- [ ] Edit user via admin panel
- [ ] Delete user via admin panel
- [ ] Test logout functionality
- [ ] Test unauthorized access (should redirect)
- [ ] Test API endpoints with Postman/curl
- [ ] Verify password hashing in database
- [ ] Test error handling and validation

---

## Troubleshooting

### Database Issues
- **Error**: "Cannot find module '@prisma/client'"
  - **Solution**: Run `npx prisma generate`

- **Error**: "Database not found"
  - **Solution**: Run `npx prisma db push`

### Authentication Issues
- **Error**: "Unauthorized" when logged in
  - **Solution**: Clear browser cookies and log in again

- **Error**: Token expired
  - **Solution**: Log out and log in again

### Build Issues
- **Error**: TypeScript errors
  - **Solution**: Run `npm run build` to see all errors

---

## Additional Resources

- **Prisma Studio**: `npm run db:studio` - Visual database browser
- **API Documentation**: Check `README.md` for API endpoint details
- **Database Schema**: See `prisma/schema.prisma`

---

## Automated Testing (Future Enhancement)

Consider adding:
- Unit tests (Jest/Vitest)
- Integration tests
- E2E tests (Playwright/Cypress)
- API tests (Supertest)

