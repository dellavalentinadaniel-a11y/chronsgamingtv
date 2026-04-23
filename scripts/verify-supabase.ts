import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.error('❌ Error: Supabase credentials not found in .env.local.');
  console.error('Please update .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyConnection() {
  console.log('--- Verificando Conexión a Supabase ---');
  console.log(`URL: ${supabaseUrl}`);

  // 1. Verificar tabla 'articles'
  const { count: articleCount, error: articleError } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  if (articleError) {
    console.error('❌ Error al acceder a la tabla "articles":', articleError.message);
  } else {
    console.log(`✅ Tabla "articles": ${articleCount} registros encontrados.`);
  }

  // 2. Verificar tabla 'comments'
  const { count: commentCount, error: commentError } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true });

  if (commentError) {
    console.error('❌ Error al acceder a la tabla "comments":', commentError.message);
  } else {
    console.log(`✅ Tabla "comments": ${commentCount} registros encontrados.`);
  }

  // 3. Verificar tabla 'media_items'
  const { count: mediaCount, error: mediaError } = await supabase
    .from('media_items')
    .select('*', { count: 'exact', head: true });

  if (mediaError) {
    console.error('❌ Error al acceder a la tabla "media_items":', mediaError.message);
  } else {
    console.log(`✅ Tabla "media_items": ${mediaCount} registros encontrados.`);
  }

  // 4. Verificar Storage
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error('❌ Error al listar buckets:', bucketError.message);
  } else {
    const mediaBucket = buckets.find(b => b.name === 'media');
    if (mediaBucket) {
      console.log('✅ Bucket "media" detectado.');
      const { data: files, error: fileError } = await supabase.storage.from('media').list();
      if (fileError) {
        console.error('❌ Error al listar archivos en "media":', fileError.message);
      } else {
        console.log(`✅ Archivos en "media": ${files.length} archivos encontrados.`);
      }
    } else {
      console.warn('⚠️ Bucket "media" no encontrado. Asegúrate de crearlo en el dashboard.');
    }
  }

  console.log('--- Verificación Finalizada ---');
}

verifyConnection();
