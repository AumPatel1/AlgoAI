# Algo AI - AI Phone Calls Platform

## Overview

This is a full-stack TypeScript application that creates an AI phone calls platform similar to Bland AI. The application provides a modern web interface for managing AI-powered phone calls with features like call logging, analytics, and user authentication.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom dark theme and CSS variables
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: 
  - TanStack Query for server state management
  - React Context for authentication state
  - React Hook Form with Zod validation for forms

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **External Services**: Twilio integration for phone call functionality

### Build and Development
- **Build Tool**: Vite with React plugin for fast development
- **Development**: Hot module replacement with error overlay
- **Production**: Static file serving with Express server
- **Database Migrations**: Drizzle Kit for schema management

## Key Components

### Authentication System
- JWT token-based authentication stored in localStorage
- Password hashing using bcrypt
- Protected routes with token verification middleware
- User session persistence across browser sessions

### Database Schema
Two main tables using PostgreSQL:
- **Users**: Stores user credentials, profile information, and credit balances
- **Calls**: Tracks phone call records with metadata, transcripts, and status

The schema uses Drizzle ORM for type safety and automatic TypeScript type generation.

### UI Design System
- Dark theme matching modern AI platform aesthetics
- Responsive design with mobile-first approach
- Custom CSS variables for consistent theming
- Component library following atomic design principles

### Page Structure
- **Public Pages**: Home (landing), Login, Signup
- **Protected Dashboard**: Analytics, Call Logs, Send Call functionality
- **Layout System**: Reusable dashboard layout with sidebar navigation

## Data Flow

1. **Authentication Flow**: User signs up/logs in → JWT token generated → Token stored in localStorage → Protected routes accessible
2. **Call Management**: User initiates call → Request sent to backend → Twilio service processes call → Call record stored in database
3. **Data Fetching**: TanStack Query handles API calls with caching and background updates
4. **State Updates**: Real-time updates through query invalidation and refetching

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Routing**: Wouter for client-side navigation
- **HTTP Client**: Built-in fetch with TanStack Query wrapper
- **UI Components**: Full Radix UI suite with shadcn/ui styling
- **Styling**: Tailwind CSS with PostCSS processing

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL adapter
- **Authentication**: jsonwebtoken, bcryptjs for security
- **Phone Services**: Twilio SDK for call functionality
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Build Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type checking and compilation
- **ESBuild**: Fast bundling for production server
- **Drizzle Kit**: Database migration and schema management

## Deployment Strategy

### Development Environment
- Uses Vite dev server for frontend with hot reloading
- tsx for running TypeScript server directly
- In-memory storage fallback when database is unavailable
- Environment variables for configuration

### Production Build
- Frontend built to static files using Vite
- Backend bundled using ESBuild for Node.js deployment
- PostgreSQL database required for production
- Environment variables for database connection and JWT secrets

### Database Setup
- Drizzle migrations stored in `/migrations` directory
- Database URL required via environment variable
- Automatic table creation on first run
- Connection pooling for production performance

## Changelog
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.