# Adaptive Learning Platform for Rural Schools

## Overview

This is an MVP adaptive learning web application designed for Indian rural schools, targeting students in grades 6-8. The platform provides offline-first educational content with interactive lessons, quizzes, and AI-powered feedback. Built with a focus on accessibility, low-bandwidth environments, and mobile-first design, the system allows students to download educational materials and complete assessments even without continuous internet connectivity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling

**Design System**: 
- Material Design principles adapted for educational simplification
- Mobile-first, touch-friendly interfaces optimized for low-end devices
- Typography using Inter/Noto Sans with excellent Hindi/English support
- Follows design guidelines for maximum readability for young learners (grades 6-8)

**State Management**:
- TanStack Query (React Query) for server state management
- Local React state for UI interactions
- IndexedDB for offline data persistence

**Offline-First Architecture**:
- IndexedDB stores downloaded lesson content (text, images, audio)
- Quiz attempts are cached locally when offline
- Background sync mechanism automatically uploads pending data when connection is restored
- Online/offline status indicator provides real-time feedback to users

**Client-Side Routing**: Single-page application with screen-based state machine navigation between:
- Grade selection
- Chapter selection  
- Content download
- Lesson viewer
- Quiz interface
- Summary/results
- Teacher dashboard

### Backend Architecture

**Runtime**: Node.js with Express server

**Language**: TypeScript with ES modules

**API Design**: RESTful API endpoints for:
- `/api/save-score` - Persisting quiz attempts
- `/api/dashboard` - Retrieving aggregated student performance data
- `/api/ai-feedback` - Generating adaptive learning feedback

**Development vs Production**:
- Development mode uses Vite middleware for HMR and fast refresh
- Production mode serves pre-built static assets from dist/public

### Data Storage Solutions

**Primary Storage**: File-based JSON storage (FileStorage class)
- Quiz scores stored in `scores.json` with chapter/grade keys
- Simple persistence suitable for MVP without database overhead
- Schema defined using Zod for runtime validation

**Database Configuration**: 
- Drizzle ORM configured for PostgreSQL (via Neon serverless)
- Schema definition in `shared/schema.ts`
- Database not actively used in current MVP but infrastructure in place for future scaling

**Client-Side Storage**: 
- IndexedDB for offline content caching with stores for:
  - Lessons (text content)
  - Quizzes (questions and answers)
  - Attempts (student quiz submissions)
  - Images (downloaded visual assets)
  - Audio (pronunciation/lesson audio files)

### Authentication and Authorization

**Current Implementation**: No authentication system in MVP
- Open access for simplicity in rural school environments
- Student identification via simple name input stored with quiz attempts
- Teacher dashboard accessible without login

**Future Considerations**: Schema includes user roles (student/teacher) for future implementation

### External Dependencies

**AI Service Integration**:
- Hugging Face Inference API with Mistral-7B-Instruct model
- Provides adaptive feedback based on quiz performance
- Generates follow-up questions for correct answers
- Provides remedial explanations for incorrect answers
- Graceful fallback to static feedback when API unavailable or API key not configured

**UI Component Libraries**:
- Radix UI primitives for accessible, unstyled components
- Shadcn/ui as component layer with consistent theming
- Lucide React for iconography
- Embla Carousel for content carousels

**Styling Dependencies**:
- Tailwind CSS for utility-first styling
- Class Variance Authority for component variants
- Custom CSS variables for theme customization supporting light/dark modes

**Development Tools**:
- Replit-specific plugins for development banner and error overlay
- TSX for TypeScript execution in development
- ESBuild for production builds

**Font Dependencies**: Google Fonts for educational typography (Inter, Noto Sans, DM Sans, Architects Daughter)

**Content Assets**: 
- Generated images stored in `attached_assets/generated_images/`
- Audio files referenced but not currently in repository
- Static content defined in `client/src/lib/content-data.ts`