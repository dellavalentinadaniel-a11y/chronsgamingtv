# Project Management Skill

This skill provides the operational framework for managing the **ChronsGamingtv** project.

## Core Responsibilities

1. **Dependency Management**:
    - Use `npm install` for new dependencies.
    - Keep `package.json` clean and organized.
    - Ensure all types are installed for TypeScript support.

2. **Project Structure**:
    - `src/components`: Reusable UI components.
    - `src/hooks`: Custom React hooks.
    - `src/services`: Integration logic (Supabase, Firebase).
    - `src/styles`: CSS modules or global styles.

3. **Deployment Flow**:
    - Build the project using `npm run build`.
    - Deploy to the specified environment (Cloud Run, Vercel, or Firebase Hosting).

## Commands

- `npm run dev`: Start local development server on port 3000.
- `npm run build`: Generate production bundle.
- `npm run lint`: Check for TypeScript errors.

## Best Practices

- **Atomic Commits**: Make small, logical commits.
- **Documentation**: Update the README when adding significant features.
- **Environment Variables**: Never hardcode secrets. Use `.env.local`.
