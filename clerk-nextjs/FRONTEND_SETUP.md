# Frontend Setup

## Folder Structure

```text
clerk-nextjs/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   └── dashboard-shell.tsx
│   └── layout/
│       └── app-header.tsx
├── hooks/
│   └── use-api-client.ts
├── lib/
│   ├── api/
│   │   └── axios.ts
│   └── config/
│       └── env.ts
└── .env.example
```

## What This Setup Includes

- Clerk mounted globally in `app/layout.tsx`
- a protected dashboard page
- sign-in and sign-up pages
- a shared Axios client
- a Clerk-aware API hook that attaches the auth token automatically

## What Is Not Added Yet

- notes, syllabus, resources, and AI feature pages
- global state management
- dashboard widgets connected to live backend data
