# Quick Test Guide

## 🚀 Quick Start Testing

### 1. Setup (One-time)
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push

# Create admin user
npm run seed:admin
```

### 2. Start Server
```bash
npm run dev
```

### 3. Manual Testing (5 minutes)

#### Test Signup & Login
1. Go to http://localhost:3000
2. Click "Sign up"
3. Create account: `test@example.com` / `Test1234`
4. Should redirect to dashboard
5. Logout and login again to verify

#### Test Admin Panel
1. Login with admin: `admin@example.com` / `admin123` (or your seeded admin)
2. Should auto-redirect to `/admin`
3. Test features:
   - ✅ View users table
   - ✅ Click "+ Create User" → Create a new user
   - ✅ Click "Edit" → Update user name/role
   - ✅ Click "Delete" → Delete a user

#### Test Security
1. Logout
2. Try accessing http://localhost:3000/admin directly
   - Should redirect to login
3. Try accessing http://localhost:3000/dashboard directly
   - Should redirect to login

### 4. Automated API Testing
```bash
npm run test:api
```

This will test:
- ✅ Signup
- ✅ Login
- ✅ Get current user
- ✅ Unauthorized access protection
- ✅ Input validation
- ✅ Admin endpoints (if admin token available)

## ✅ Complete Test Checklist

- [ ] Signup works
- [ ] Login works
- [ ] Dashboard displays user info
- [ ] Admin panel accessible (admin only)
- [ ] Create user (admin)
- [ ] Edit user (admin)
- [ ] Delete user (admin)
- [ ] Logout works
- [ ] Unauthorized access blocked
- [ ] Password validation works
- [ ] Email validation works

## 🐛 Common Issues

**"Cannot find module '@prisma/client'"**
→ Run: `npx prisma generate`

**"Database not found"**
→ Run: `npx prisma db push`

**"Unauthorized" errors**
→ Clear browser cookies and login again

**Port 3000 already in use**
→ Change port: `npm run dev -- -p 3001`

