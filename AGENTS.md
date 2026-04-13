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
| Animation | Framer Motion |
| Testing | Vitest 3.2+ with jsdom |
| Linting | ESLint 9 with typescript-eslint |

## Project Structure

```
src/
├── components/
│   ├── ui/              # 48 shadcn/ui components
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
│   ├── ProjectsSection.tsx
│   └── RichTextEditor.tsx  # Custom rich text editor component
├── pages/               # 8 route-level components
│   ├── Index.tsx        # Homepage
│   ├── AperInsud.tsx    # AperInsud event page
│   ├── Lumina.tsx       # Article listing (static - legacy)
│   ├── LuminaDynamic.tsx # Article listing (Supabase-powered)
│   ├── ArticlePage.tsx  # Static article detail (legacy)
│   ├── ArticleDynamicPage.tsx # Dynamic article from DB
│   ├── ArticleSubmission.tsx # Article submission/management interface
│   └── NotFound.tsx     # 404 page
├── hooks/
│   ├── use-mobile.tsx   # Mobile breakpoint detection (768px)
│   └── use-toast.ts     # Toast notification hook
├── lib/
│   ├── utils.ts         # cn() utility for Tailwind classes
│   ├── supabase.ts      # Supabase client & TypeScript types
│   ├── articleApi.ts    # Article CRUD operations
│   └── articleSubmission.tsx # Article submission utilities
├── data/
│   └── articles.ts      # Static article data (legacy articles)
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

**Security Note**: The `.env.local` file is already in `.gitignore` and should never be committed. The Supabase anon key is safe to use in client-side code (it's publishable).

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode is disabled** (`strict: false` in tsconfig.app.json)
- `noImplicitAny: false` - allows implicit any types
- `noUnusedLocals: false` - unused variables are allowed
- `noUnusedParameters: false` - unused parameters are allowed
- Path aliases use `@/*` pointing to `./src/*`
- Vitest globals are enabled (no need to import `describe`, `it`, `expect`)

### Component Patterns
```typescript
// Use function declarations for components
const ComponentName = () => {
  return <div>...</div>;
};

export default ComponentName;
```

### Import Order
1. React imports
2. Third-party libraries
3. `@/` aliases (project imports)
4. Relative imports

### Styling Conventions
- Use Tailwind CSS utility classes
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Custom color tokens defined in `tailwind.config.ts` and `src/index.css`:
  - `--navy`: Primary brand color (hsl(213 70% 15%))
  - `--sky`: Accent color (hsl(213 80% 55%))
- Custom utility classes in `index.css`:
  - `.text-gradient`: Gradient text effect
  - `.bg-navy-gradient`: Navy gradient background
  - `.bg-navy-solid`: Solid navy background
  - `.article-content`: Rich text content styling
  - `.rich-text-content`: Rich text editor output styling

### shadcn/ui Components
All shadcn/ui components are located in `src/components/ui/`. These are:
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Fully typed with TypeScript
- Use the `cn()` utility for class merging

## Testing Instructions

Tests are written using **Vitest** with **jsdom** environment and **Testing Library**.

- Test files: `src/**/*.{test,spec}.{ts,tsx}`
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

The test setup includes a mock for `window.matchMedia` for responsive component testing.

## Routing Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Homepage with all sections |
| `/aperinsud` | AperInsud | Event information page |
| `/lumina` | LuminaDynamic | Article listing (DB-powered) |
| `/lumina/:slug` | ArticleDynamicPage | Dynamic article detail |
| `/lumina/submit` | ArticleSubmission | Article submission/management interface |
| `*` | NotFound | 404 error page |

**Note**: Legacy routes (`/lumina` with static data) have been replaced with dynamic Supabase-powered versions.

## Data Architecture

### Static Articles (Legacy)
Stored in `src/data/articles.ts`
- Simple array of article objects
- Used only for reference/historical purposes
- Each article has: slug, title, series, author, date, summary, content[]

### Dynamic Articles (Current)
Stored in Supabase with the following schema:

**Tables:**
- `articles`: Main article data
  - id, title, slug, content, excerpt, author_id, category_id, published_at, content_blocks (JSON)
- `authors`: Article authors
  - id, name
- `categories`: Article categories
  - id, name, slug, description
- `tags`: Article tags
  - id, name, slug
- `article_tags`: Many-to-many junction table
  - article_id, tag_id

**TypeScript Types** (in `src/lib/supabase.ts`):
```typescript
type ContentBlock = 
  | { type: 'paragraph'; content: string }
  | { type: 'textbox'; title: string; content: string; style?: 'default' | 'info' | 'warning' | 'success' };

type ArticleWithRelations = Article & {
  author: Author;
  tags: Tag[];
  category?: Category;
  content_blocks?: ContentBlock[];
};
```

### API Functions (src/lib/articleApi.ts)
- `submitArticle()` - Create new article with content blocks
- `getArticles()` - Fetch all articles with relations
- `getArticleBySlug()` - Fetch single article by slug
- `getArticlesByTag()` - Fetch articles by tag
- `updateArticle()` - Update article data
- `updateArticleTags()` - Update article tags
- `deleteArticle()` - Delete article and tag associations
- `getAllTags()` - Fetch all tags with article count
- `getAllAuthors()` - Fetch all authors with article count

## Rich Text Editor

The project includes a custom rich text editor (`RichTextEditor.tsx`) for article content:

**Features:**
- Bold, italic formatting
- Link insertion (with `[text](url)` markdown syntax support)
- Paste handling that cleans unwanted formatting
- Automatic markdown link conversion
- SSR-safe rendering

**Content Blocks:**
Articles can be composed using content blocks:
- **Paragraph**: Standard text block with rich formatting
- **TextBox**: Styled callout boxes (default, info, warning, success variants)

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control (it's in `.gitignore`)
2. **Supabase Keys**: The anon key is safe to use in client-side code (it's publishable)
3. **No Server Secrets**: This is a static SPA; all Supabase operations use Row Level Security
4. **Form Validation**: All forms use Zod schemas for client-side validation
5. **HTML Sanitization**: Rich text content is sanitized in `RichTextContent` component
6. **XSS Protection**: Links automatically get `target="_blank"` and `rel="noopener noreferrer"`

## Deployment Notes

This project was initially created with **Lovable.dev**, a visual editor for React applications. The Lovable integration includes:
- A `lovable-tagger` plugin in development mode for component tagging
- Deployment through the Lovable platform

**Build Configuration:**
- Build output goes to `dist/` directory
- Static hosting compatible (Vercel, Netlify, etc.)
- Requires environment variables to be set in hosting platform

**Vite Configuration:**
- Dev server runs on port 8080
- Uses `@vitejs/plugin-react-swc` for fast compilation
- Path alias `@` resolves to `./src`

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

### Working with the Article Editor
The article submission interface (`/lumina/submit`) provides:
- **Publish Tool**: Create new articles with content builder
- **Manage Tool**: Edit, update, and delete existing articles
- Content blocks support drag-and-drop reordering
- Real-time preview of content blocks

## External Dependencies

Key external services:
- **Supabase**: Database and backend (PostgreSQL)
- **Google Fonts**: Inter font family loaded via CSS
- **Lovable.dev**: Optional visual editing platform

## Mobile Responsiveness

- Mobile breakpoint: 768px (`useIsMobile()` hook)
- Navbar collapses to hamburger menu on mobile
- Article editor has mobile-optimized sidebar
- All sections use responsive Tailwind classes

---

*Last updated: March 2026*
