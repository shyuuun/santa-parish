# System Instruction

-   You will become a full stack developer.
-   You will be given a project description and you will generate code for the project.
-   You will generate code in a### Registration & Authentication

-   Register with document submission (for admin approval)
-   Login (email/password or phone number)
    -   🚫 Unverified users cannot log in
    -   Message: "Your account is pending approval."
-   Forgot password / password reset
-   Profile update (with optional file re-submission)

### 🔒 Security Settings

-   Change password with strength validation
-   View account security status
-   Security tips and best practices
-   Emergency contact information for security issues

### 💸 Loan Applicationay, meaning you will create components, services, and utilities as needed.
-   You will use the latest technologies and best practices in web development.
-   You will write code that is easy to read, maintain, and extend.
-   You will write code that is secure and follows best practices for authentication and authorization.
-   You will write code that is responsive and works on all devices.
-   You will write code that is performant and optimized for speed.

# Tech Stack

-   Frontend: React, Next.js, Tailwind CSS and (will use a UI library Shadcn/ui)
-   Backend: Supabase (PostgreSQL)
-   Database: Supabase (PostgreSQL)
-   Authentication: Supabase Auth
-   Hosting: Planned to be hosted on Cloudflare Workers

# Development Guidelines

-   Use TypeScript for all code.
-   Follow best practices for code organization and modularity.
-   Use functional components and hooks in React.
-   Use Tailwind CSS for styling and ensure the application is responsive.
-   Use Supabase for authentication and database management.
-   Ensure all sensitive data is handled securely and follows best practices for security.

# Project Description

-   Project Name: Santa Lucia Parish Multipurpose Cooperative
-   Project Type: Full Stack Web Application
-   Project Description: A web application for a community-driven financial institution that allows members to manage their accounts, apply for loans, and access financial services. The application will have a user-friendly interface and will be built using modern web technologies. It will include features such as user authentication, account management, loan applications, and financial reporting. The application will be designed to be secure, responsive, and performant.
-   Project Goal: To create a web application that provides a platform for members of the cooperative to manage their financial activities, apply for loans, and access various financial services in a user-friendly manner.

# About the Project

-   There will be two main user roles: Admin and User.
-   Admins will have full control over the application, including user management, loan management, and announcements.
-   Users will be able to manage their accounts, apply for loans, and access financial services
-   The application will include a chatbot (will be in a seperate page) that can assist users with common queries, account management, and financial advice.

# Database Schema

-   The database will be managed using Supabase, which provides a PostgreSQL database with built-in authentication.
-   If you are looking for my database structure. You
    can refer to `database.types.ts` in `utils` folder.
-   Run `npm run gen-type-supabase` to generate the latest types in my database

# Routes

-   There are route that are publicly available to the users even they are not logged in
-   Please refer also to my `app` folder since we are using App Router in NextJS

# Types (TypeScript)

-   Always create types on `src/utils/types.ts` for the application.
-   Use `src/utils/database.types.ts` for the types generated from Supabase.
-   When touching the database, always use the types from `src/utils/database.types.ts` to ensure type safety. and run `npm run gen-type-supabase` to generate the latest types.

## Public Routes

-   `/`
-   `/login`
-   `/register`
-   `/announcements`

## Admin Routes

-   `/dashboard/*`

## Verified Users

-   `/home/*`

# Users

-   There will be two users (`Admin` and `User`)

## User

-   There will be two types of User. One is `verified` and one is `unverified`.
    To be `verified`. Admin should be check the the information then need to approve.
-   Users in `unverified` status should not be able to login.
-   Users should not able to access the `/dashboard` as this is only for the admin
-   After users logged in. (which is in `verified` state) they will be redirected to `/home` route

## Admin

-   Admin should be access the `/dashboard` route.
-   Admin is the one controls everything. Such as deleting other admin or creating a new one.
    View user info, deletes user, approve users who are in `unverified` state

# Folder Structure

/src
├── app/ # Next.js App Router routes
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ ├── (auth)/ # Auth group
│ │ ├── actions.ts # Server actions for auth
│ │ ├── layout.tsx # Auth layout
│ │ ├── components/ # Auth-specific components
│ │ ├── login/ # Login page
│ │ └── register/ # Register page
│ ├── home/ # User account pages (protected)
│ ├── announcements/ # Public announcements
│ └── dashboard/ # Admin dashboard (protected)
| └── chat/ # AI Chat
│ └── (overview)/ # Dashboard features
│
├── components/ # Shared components
│ ├── Alert.tsx # Alert messages
│ ├── AnnouncementCard.tsx
│ ├── AnnouncementsSection.tsx
│ ├── Badge.tsx
│ ├── Button.tsx
│ ├── Footer.tsx
│ ├── Loader.tsx
│ ├── Navbar.tsx
│ ├── PostViewer.tsx
│ └── shadcn/ # UI component library
│
├── hooks/ # Custom React hooks
│
├── middleware.ts # Next.js middleware for auth/routes
│
└── utils/ # Utility functions and types
├── database.types.ts # Supabase database types
├── functions.ts # Helper functions
├── globals.ts # Global constants
├── route.ts # Route definitions
├── supabaseUtils.ts # Supabase utility functions
├── types.ts # TypeScript types
├── provider/ # React context providers
└── supabase/ # Supabase client configs

-   Take note on the `shadcn` folder. Usually when I adding a component from `shadcn`
    `npx shadcn@latest add alert` it goes outside of the `src` folder. You need to move it to `src/components/shadcn`

# Component

-   Each routes has a `component` folder for the specific needs.
-   Strictly use the existing global component (`src/components/`)

# Routes

-   We have constants route `src/utils/route.ts` that contains the routes of the application.

# Project Features

## Chatbot

-   Chatbot that can answer questions about the cooperative, its services, and financial literacy.
-   Chatbot that can assist members with account management and loan applications.
-   Chatbot that can will calculate loan amotization schedules and provide financial advice.
-   Chatbot that can provide financial reporting and insights.

## Admin Panel

### Dashboard

-   Show summaries (e.g., total members, active loans, pending applications)

### User Management

-   Full CRUD operations for users
-   Approve or Deny user registrations
-   Approve or Deny loan applications
-   Search and filter users (by status, email, name)

### Announcements

-   Create, Update, Delete announcements
-   Publish to homepage / landing page

### Loan Management

-   View all loan applications
-   Filter loans by status (pending, approved, denied)
-   Set loan terms (amount, interest rate, duration)

## User Features

### Registration & Authentication

-   Register with document submission (for admin approval)
-   Login (email/password or phone number)
    -   🚫 Unverified users cannot log in
    -   Message: “Your account is pending approval.”
-   Forgot password / password reset
-   Profile update (with optional file re-submission)

### 💸 Loan Application

-   Submit loan application
-   Display notice: “Approval may take 1–2 business days.”
-   View loan history and status
-   Cancel pending applications

### Transaction History

-   View transaction history (deposits, withdrawals, loans)
-   Filter transactions by date, type, amount

### 📢 Announcements

-   View announcements from admin on dashboard or home screen
