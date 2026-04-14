# Project Organization Guidelines

## Folder Structure (Atomic Design)

Follow atomic design principles for frontend components:

```
src/
├── components/
│   ├── atoms/        # Basic building blocks (Button, Input, Label, Icon)
│   ├── molecules/    # Combinations of atoms (SearchBar, FormField, Card)
│   ├── organisms/    # Complex UI sections (Header, Footer, Sidebar, Form)
│   └── templates/    # Page layouts without data
├── app/              # Next.js App Router pages
│   └── [locale]/     # i18n route segments
├── hooks/            # Custom React hooks (useAuth, useFetch)
├── utils/            # Pure utility functions
├── lib/              # Third-party library wrappers/configs
├── services/         # API calls and external service integrations
├── store/            # State management (if using)
├── types/            # Shared TypeScript types/interfaces
├── styles/           # Global styles and CSS variables
└── constants/        # App-wide constants and enums
```

## Naming Conventions

### Files & Folders
- **Components**: PascalCase (`Button.tsx`, `UserCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useLocalStorage.ts`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Constants**: camelCase file, SCREAMING_SNAKE_CASE exports (`apiEndpoints.ts`)
- **Types**: PascalCase with descriptive suffix (`UserProps.ts`, `ApiResponse.ts`)

### Components
- Component name must match filename: `Button.tsx` exports `Button`
- Props interface: `ComponentNameProps` (e.g., `ButtonProps`)
- One component per file (except tightly coupled sub-components)

### Functions & Variables
- Functions: camelCase, verb-first (`getUserById`, `formatCurrency`)
- Boolean variables: prefix with `is`, `has`, `should` (`isLoading`, `hasError`)
- Event handlers: prefix with `handle` (`handleClick`, `handleSubmit`)
- Constants: SCREAMING_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)

## Code Organization Patterns

### Component Structure
Order elements within components consistently:
1. Imports
2. Type definitions (if component-specific)
3. Component function
4. Hooks (useState, useEffect, custom hooks)
5. Derived state / computed values
6. Event handlers
7. Render helpers (if needed)
8. Return JSX

### Import Ordering
Group and sort imports in this order:
1. React/Next.js imports
2. External libraries (npm packages)
3. Internal aliases (`@/components`, `@/utils`, etc.)
4. Relative imports (parent `../`, sibling `./`)
5. Style imports
6. Type imports (use `import type` when possible)

```tsx
// 1. React/Next
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { clsx } from 'clsx';

// 3. Internal aliases
import { Button } from '@/components/atoms/Button';
import { cn } from '@/utils/utils';

// 4. Relative imports
import { CardHeader } from './CardHeader';

// 5. Styles (if applicable)
import styles from './Card.module.css';

// 6. Types
import type { CardProps } from './Card.types';
```

## General Principles

- **Colocation**: Keep related files together (component + styles + tests + types)
- **Single Responsibility**: Each file/function should do one thing well
- **DRY**: Extract repeated logic into hooks or utilities
- **Explicit over implicit**: Prefer clear, descriptive names over clever abbreviations
- **TypeScript**: Always type props, function parameters, and return values

## Server Components (Next.js 16)

**Default to Server Components** unless you need:
- Event handlers (`onClick`, `onChange`)
- React hooks (`useState`, `useEffect`, `useContext`)
- Browser-only APIs (`localStorage`, `window`)

```tsx
// ✅ Server Component (default) - no directive needed
async function UserProfile({ id }: { id: string }) {
  const user = await fetchUser(id); // Direct data fetching
  return <div>{user.name}</div>;
}

// ✅ Client Component - only when necessary
'use client';
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Rules:**
- Fetch data in Server Components, pass as props to Client Components
- Keep Client Components small and leaf-level
- Never add `'use client'` to a component that doesn't need interactivity

## Internationalization (i18n)

**IMPORTANT:** When adding ANY user-facing text, always add translations to BOTH:
- `messages/en.json`
- `messages/fr.json`

### Translation Key Naming
```json
{
  "PageName": {
    "sectionName": {
      "elementDescription": "Text value"
    }
  }
}
```

Example:
```json
// messages/en.json
{
  "HomePage": {
    "hero": {
      "title": "Welcome to our app",
      "subtitle": "Get started today"
    }
  }
}

// messages/fr.json
{
  "HomePage": {
    "hero": {
      "title": "Bienvenue sur notre application",
      "subtitle": "Commencez aujourd'hui"
    }
  }
}
```

**Never hardcode user-facing strings.** Always use `useTranslations()` or `getTranslations()`.

## Performance

- **Images**: Always use `next/image` with explicit `width`/`height` or `fill`
- **Fonts**: Use `next/font` for automatic optimization
- **Dynamic imports**: Use `next/dynamic` for heavy components not needed on initial load
- **Bundle size**: Avoid importing entire libraries (`import { specific } from 'lib'` not `import lib`)
- **Memoization**: Use `useMemo`/`useCallback` only when there's a measured performance issue

## Security

- **Environment Variables**:
  - Only create env vars for secrets and environment-specific config
  - Use `NEXT_PUBLIC_` prefix ONLY for values that MUST be in the browser
  - Never expose API keys, database URLs, or secrets to the client
  - Prefer hardcoding non-sensitive config values directly in code

```tsx
// ❌ Don't create env vars for everything
const BUTTON_COLOR = process.env.NEXT_PUBLIC_BUTTON_COLOR;
const MAX_ITEMS = process.env.NEXT_PUBLIC_MAX_ITEMS;

// ✅ Hardcode non-sensitive config
const BUTTON_COLOR = 'blue';
const MAX_ITEMS = 10;

// ✅ Only use env vars for actual secrets/environment-specific values
const apiKey = process.env.FIREBASE_API_KEY; // Server-only secret
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL; // Varies by environment
```

- **Input Validation**: Validate all user input on the server
- **Firebase Rules**: Keep security rules strict; deny by default
