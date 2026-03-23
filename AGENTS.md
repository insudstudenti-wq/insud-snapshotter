# InSud Bocconi - AI Agent Guide

This document provides essential information for AI coding agents working on the InSud Bocconi student association website.

## Project Overview

**InSud Bocconi** is the official website of InSud, a student association at Bocconi University in Milan, Italy. The website serves as a digital presence for the association, featuring information about their initiatives, events, and a digital magazine called "Lumina" that publishes articles about Southern Italy topics.

- **Language**: Italian (content), English (code)
- **Primary Domain**: https://www.insud.eu
- **Target Audience**: Bocconi University students, prospective members, and anyone interested in Southern Italian culture and issues

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 18.3+ |
| Language | TypeScript 5.8+ |
| Build Tool | Vite 5.4+ |
| Routing | React Router DOM 6.30+ |
| Styling | Tailwind CSS 3.4+ |
| UI Components | shadcn/ui (Radix UI primitives) |
| State Management | TanStack Query (React Query) 5.83+ |
| Backend | Supabase |
| Forms | React Hook Form + Zod |
| Testing | Vitest 3.2+ with jsdom |
| Linting | ESLint 9 with typescript-eslint |

## Project Structure

```
src/
├── components/
│   ├── ui/              # 40+ shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (full component library)
│   ├── CTASection.tsx   # Call-to-action section
│   ├── Footer.tsx       # Site footer
│   ├── HeroSection.tsx  # Landing hero
│   ├── MissionSection.tsx
│   ├── Navbar.tsx       # Navigation component
│   ├── NavLink.tsx      # Navigation link helper
│   └── ProjectsSection.tsx
├── pages/               # Route-level components
│   ├── Index.tsx        # Homepage
│   ├── AperInsud.tsx    # AperInsud event page
│   ├── Lumina.tsx       # Article listing (static)
│   ├── LuminaDynamic.tsx # Article listing (Supabase)
│   ├── ArticlePage.tsx  # Static article detail
│   ├── ArticleDynamicPage.tsx # Dynamic article from DB
│   ├── ArticleSubmission.tsx # Article submission form
│   └── NotFound.tsx     # 404 page
├── hooks/
│   ├── use-mobile.tsx   # Mobile breakpoint detection
│   └── use-toast.ts     # Toast notification hook
├── lib/
│   ├── utils.ts         # cn() utility for Tailwind classes
│   ├── supabase.ts      # Supabase client & TypeScript types
│   └── articleApi.ts    # Article CRUD operations
├── data/
│   └── articles.ts      # Static article data
├── assets/              # Images and logos
├── test/
│   ├── setup.ts         # Test environment setup
│   └── example.test.ts  # Sample test
├── App.tsx              # Root component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles & CSS variables
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: These are required for the dynamic article features (LuminaDynamic, ArticleDynamicPage, ArticleSubmission) to function.

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode is disabled** (`strict: false` in tsconfig)
- Unused variables and parameters are allowed (configured in eslint)
- Type checking is relaxed for faster development
- Path aliases use `@/*` pointing to `./src/*`

### Component Patterns
```typescript
// Use function declarations for components
const ComponentName = () => {
  return <div>...</div>;
};

export default ComponentName;
```

### Styling Conventions
- Use Tailwind CSS utility classes
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Custom color tokens defined in `tailwind.config.ts`:
  - `--navy`: Primary brand color (hsl(213 70% 15%))
  - `--sky`: Accent color (hsl(213 80% 55%))
- Custom utility classes:
  - `.text-gradient`: Gradient text effect
  - `.bg-navy-gradient`: Navy gradient background
  - `.bg-navy-solid`: Solid navy background

### Import Order
1. React imports
2. Third-party libraries
3. `@/` aliases (project imports)
4. Relative imports

## Testing Instructions

Tests are written using **Vitest** with **jsdom** environment and **Testing Library**.

- Test files: `src/**/*.test.ts` or `src/**/*.spec.ts`
- Setup file: `src/test/setup.ts`
- Globals are enabled (no need to import `describe`, `it`, `expect`)

Example test:
```typescript
describe("feature", () => {
  it("should work correctly", () => {
    expect(true).toBe(true);
  });
});
```

## Key Features and Architecture

### Routing Structure
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Homepage with all sections |
| `/aperinsud` | AperInsud | Event information page |
| `/lumina` | Lumina | Static article listing |
| `/lumina/:slug` | ArticlePage | Static article detail |
| `/lumina/submit` | ArticleSubmission | Article submission form |
| `/lumina_dynamic` | LuminaDynamic | DB-powered article listing |
| `/article_dynamic/:slug` | ArticleDynamicPage | DB-powered article detail |
| `*` | NotFound | 404 error page |

### Data Architecture

**Static Articles**: Stored in `src/data/articles.ts`
- Simple array of article objects
- Used by `/lumina` and `/lumina/:slug` routes

**Dynamic Articles**: Stored in Supabase
- Tables: `articles`, `authors`, `categories`, `tags`, `article_tags`
- Used by `/lumina_dynamic` and `/article_dynamic/:slug` routes
- Full CRUD operations in `src/lib/articleApi.ts`

### UI Components

The project uses **shadcn/ui** components located in `src/components/ui/`. These are:
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Fully typed with TypeScript
- Can be customized as needed

Available components include: Accordion, Alert Dialog, Avatar, Badge, Button, Calendar, Card, Carousel, Chart, Checkbox, Command, Dialog, Dropdown Menu, Form, Input, Navigation Menu, Popover, Select, Sheet, Sidebar, Table, Tabs, Toast, Tooltip, and more.

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control (it's in `.gitignore`)
2. **Supabase Keys**: The anon key is safe to use in client-side code (it's publishable)
3. **No Server Secrets**: This is a static SPA; all Supabase operations use Row Level Security
4. **Form Validation**: All forms use Zod schemas for client-side validation

## Deployment Notes

This project was initially created with **Lovable.dev**, a visual editor for React applications. The Lovable integration includes:
- A `lovable-tagger` plugin in development mode for component tagging
- Deployment through the Lovable platform

For manual deployment:
- Build output goes to `dist/` directory
- Static hosting compatible (Vercel, Netlify, etc.)
- Requires environment variables to be set in hosting platform

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Navbar.tsx` if needed

### Adding a New shadcn/ui Component
Use the shadcn CLI (if available) or manually copy from the shadcn registry:
1. Create file in `src/components/ui/component-name.tsx`
2. Follow existing component patterns
3. Export from the file

### Modifying the Database Schema
When working with Supabase:
1. Types are manually defined in `src/lib/supabase.ts`
2. Update both the database AND the TypeScript types
3. Update `src/lib/articleApi.ts` if API changes are needed

## External Dependencies

Key external services:
- **Supabase**: Database and backend
- **Google Fonts**: Inter font family loaded via CSS
- **Lovable.dev**: Optional visual editing platform

---

*Last updated: March 2026*
