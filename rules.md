# Project Rules

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Hosting**: Cloudflare Pages
- **Database**: Cloudflare D1 (SQL) for pricing, client data, and project metadata
- **Storage**: Cloudflare R2 for high-resolution media (photos/videos)
- **Authentication**: NextAuth.js or Cloudflare Turnstile with JWT for Admin and Client Access

## Design Identity (Deep Noir Theme)
- **Primary Background**: Pure Black (`#000000`)
- **Text**: High-contrast White and `zinc-400` for secondary text
- **Accent Color**: Neutral Titanium Gray (`#A1A1AA`) for buttons, borders, and active states
- **Vibe**: Minimalist, luxury gallery, fast-loading, mobile-optimized

## Architectural Decisions & Naming Conventions
- **JavaScript/TypeScript**: Use `camelCase` for variables and functions. Use `PascalCase` for React components and interfaces/types.
- **CSS**: Use `kebab-case` for custom CSS classes (when Tailwind utilities aren't enough).
- **State Management & Data Fetching**: Prefer server components and React Server Actions where possible. Use `useTransition` hook when invoking Server Actions to prevent UI blocking. Use minimal client-side state hooks (`useState`, `useEffect`) only for highly interactive components or where SSR data fetching would cause a 503 connection timeout.
- **D1 Schema Architecture**: For simple list/array fields (e.g., features, tags), store them as JSON-stringified arrays directly within D1 text columns instead of creating separate normalization mapping tables.

## Deployment Rules
- **Push Changes on Code Change**: After every code change, immediately stage all modified files, commit with a descriptive message, and push to `origin/main`. This triggers Cloudflare Pages to deploy to `shotbyhamadi.com` automatically.

## Optimization Rules
- **Images**: All images MUST be served via the Next.js `<Image />` component or a dedicated worker-based optimization script to ensure lightning-fast loading speeds, especially for the masonry gallery holding R2 assets.
