import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Supabase credentials not found.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSQL() {
  const sql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/temp_insert.sql'), 'utf8');
  
  // Split SQL by semicolon to execute multiple statements (basic approach)
  // Note: This is a simple split, might fail with complex SQL but should work for this case
  const statements = sql.split(';').filter(s => s.trim().length > 0);

  console.log(`--- Ejecutando ${statements.length} bloques SQL ---`);

  for (const statement of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
    
    if (error) {
      // If RPC fails (likely because exec_sql doesn't exist), try direct queries via postgrest
      // Since supabase-js doesn't have a direct 'query' method for arbitrary SQL, 
      // we'll try to use the MCP tool instead now that you've authenticated.
      console.error('❌ Error ejecutando SQL vía RPC:', error.message);
      console.log('Intentando vía MCP...');
      process.exit(2);
    }
  }

  console.log('✅ SQL ejecutado correctamente.');
}

runSQL();
