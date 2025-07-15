# Focus App

## Overview

A productivity-focused web application built with React and Express that provides a distraction-free workspace with tools for time management, note-taking, task management, and ambient audio. The app features a clean, customizable interface with draggable modals and background themes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state, local state with React hooks
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: Hot reload with Vite middleware integration
- **API**: RESTful endpoints for CRUD operations

### Key Components

#### Core Features
1. **Pomodoro Timer**: Focus timer with customizable duration and visual progress indicator
2. **Notes System**: Simple note-taking with auto-save functionality
3. **Task Management**: Todo list with completion tracking
4. **Quotes Module**: Inspirational quotes with random selection
5. **Audio Integration**: YouTube audio embedding for ambient sounds
6. **Background Themes**: Customizable backgrounds including image uploads

#### UI Components
- **Draggable Modals**: Custom draggable modal system for floating windows
- **Floating Bar**: Central navigation bar with tool access
- **Theme System**: Dynamic background and color scheme switching
- **Responsive Design**: Mobile-friendly with adaptive layouts

#### Database Schema
- **Users**: User authentication and profile management
- **Notes**: User-specific note storage with timestamps
- **Tasks**: Task management with completion status
- **User Settings**: Personalized preferences (themes, pomodoro time, audio settings)

### Data Flow

1. **Client-Server Communication**: React Query manages API calls and caching
2. **Real-time Updates**: Optimistic updates with query invalidation
3. **Local Storage**: Theme preferences and custom backgrounds stored locally
4. **Session Management**: In-memory storage for development (extendable to proper auth)

### External Dependencies

#### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Form Handling**: React Hook Form with Zod validation
- **Date/Time**: date-fns for date manipulation
- **Carousel**: Embla Carousel for image galleries

#### Backend Dependencies
- **Database**: Neon Database (PostgreSQL) for cloud hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Session**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for runtime type validation

### Deployment Strategy

#### Development
- **Local Development**: Vite dev server with Express API proxy
- **Hot Reload**: Vite middleware integration for seamless development
- **Database**: Environment-based DATABASE_URL configuration

#### Production
- **Build Process**: Vite builds the client, esbuild bundles the server
- **Static Assets**: Client files served from dist/public
- **Database Migrations**: Drizzle migrations in ./migrations directory
- **Environment**: Production configuration with proper session handling

#### Configuration
- **TypeScript**: Unified tsconfig.json for client, server, and shared code
- **Path Aliases**: Organized imports with @ for client, @shared for common code
- **CSS Processing**: PostCSS with Tailwind CSS and autoprefixer

The application follows a modular architecture with clear separation between client and server code, shared type definitions, and a scalable database structure. The development setup prioritizes developer experience with hot reloading and type safety throughout the stack.