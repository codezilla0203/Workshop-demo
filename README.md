# AI-Augmented Development Demo

A professional, production-ready full-stack web application demonstrating AI-augmented development capabilities. This demo showcases a complete user management system with authentication, authorization, and admin functionality built using modern best practices.

## ✨ Features

- ✅ **User Authentication** - Secure signup/login with JWT tokens
- ✅ **Session Management** - HTTP-only cookies for secure token storage
- ✅ **Role-Based Access Control** - USER/ADMIN roles with middleware protection
- ✅ **User Management API** - Complete CRUD operations with proper validation
- ✅ **Admin Panel** - Beautiful, responsive UI for user management
- ✅ **Type Safety** - Full TypeScript coverage with no `any` types
- ✅ **Error Handling** - Centralized, consistent error handling
- ✅ **Input Validation** - Strong validation with Zod schemas
- ✅ **Security** - Enhanced password requirements, secure JWT handling
- ✅ **Database** - SQLite with Prisma ORM (easily switchable to PostgreSQL)

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens with HTTP-only cookies
- **Validation**: Zod with type inference
- **Security**: bcrypt for password hashing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up the database:**
```bash
npx prisma generate
npx prisma db push
```

3. **Create a `.env` file** (optional for development):
```env
JWT_SECRET=your-secret-key-minimum-32-characters-long
```

**Note**: For production, `JWT_SECRET` must be at least 32 characters. The app will validate this on startup.

4. **Run the development server:**
```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Usage

### Creating Your First Admin User

**Option 1: Using the seed script**
```bash
npm run seed:admin
```

**Option 2: Manual database update**
1. Sign up a new account at the homepage
2. Use Prisma Studio: `npm run db:studio`
3. Update the user's role to `ADMIN` in the database

**Option 3: Via API (after creating first admin)**
Use the admin panel to create additional admin users.

### Application Routes

- `/` - Login/Signup page
- `/dashboard` - User dashboard (requires authentication)
- `/admin` - Admin panel (requires ADMIN role)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Management (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user by ID
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### API Response Format

All API responses follow a consistent format:
```typescript
{
  success: boolean
  data?: T        // Present when success is true
  error?: string  // Present when success is false
  details?: any   // Optional additional error details
}
```

## 🔒 Security Features

- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, and number
- **JWT Security**: Environment-validated secrets, secure cookie settings
- **Input Validation**: All inputs validated with Zod schemas
- **Type Safety**: Full TypeScript coverage prevents common vulnerabilities
- **HTTP-Only Cookies**: Tokens stored securely, not accessible via JavaScript

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── users/          # User management endpoints
│   ├── admin/              # Admin panel page
│   ├── dashboard/          # User dashboard page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── lib/                    # Utility libraries
│   ├── api-response.ts     # Standardized API responses
│   ├── auth.ts             # Authentication utilities
│   ├── constants.ts        # Application constants
│   ├── env.ts              # Environment validation
│   ├── middleware.ts       # Auth middleware
│   ├── prisma.ts           # Prisma client
│   └── validation.ts       # Zod validation schemas
├── types/                  # TypeScript type definitions
│   └── user.ts
├── prisma/                 # Database schema
│   └── schema.prisma
└── scripts/                # Utility scripts
    └── seed-admin.ts
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable: `JWT_SECRET` (minimum 32 characters)
4. Vercel will automatically detect Next.js and deploy

### Other Platforms

The application can be deployed to any platform supporting Node.js:
- Render
- Railway
- AWS
- DigitalOcean

**Important**: For production deployments:
- Set `JWT_SECRET` environment variable (minimum 32 characters)
- Run `prisma generate` and `prisma db push` during build
- Consider using PostgreSQL instead of SQLite for production

## 🎯 Professional Features

This application demonstrates professional development practices:

1. **Centralized Error Handling** - Consistent error responses across all endpoints
2. **Type Safety** - No `any` types, proper TypeScript interfaces
3. **Environment Validation** - Validates required environment variables on startup
4. **Input Validation** - Strong validation with helpful error messages
5. **Security Best Practices** - Enhanced password requirements, secure JWT handling
6. **Code Organization** - Clear structure, separation of concerns
7. **Maintainability** - Constants, reusable utilities, clear patterns
8. **Accessibility** - Proper labels, roles, semantic HTML

## 📝 Development Notes

This application was built using AI-augmented development tools (Cursor/Copilot) to demonstrate:
- Rapid full-stack development with AI assistance
- Type-safe API design
- Modern React patterns
- Database schema design
- Authentication/authorization implementation
- Professional code structure and best practices
