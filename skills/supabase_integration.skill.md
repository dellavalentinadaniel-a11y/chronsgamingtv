# Supabase Integration Skill

This skill outlines how to use and integrate Supabase into the project.

## MCP Tools Usage

The `supabase` MCP server provides the following capabilities:
- `create_project`: Initialize a new Supabase project.
- `execute_sql`: Run migrations or queries directly.
- `list_tables`: Inspect the database schema.

## Integration Guidelines

1. **Client Setup**:
    - Build a `src/services/supabaseClient.ts` using `@supabase/supabase-js`.
    - Use environment variables for `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

2. **Data Fetching**:
    - Use React Query (or similar) for robust state management.
    - Leverage Supabase Realtime for live updates if required.

3. **Authentication**:
    - Implement Supabase Auth for user management.
    - Use the Supabase Auth UI components for rapid development if appropriate.

## Example Configuration

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
