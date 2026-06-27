-- 1. Crear Tipos Enum si no existen
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_articulo') THEN
        CREATE TYPE public.estado_articulo AS ENUM ('publicado', 'borrador', 'revision');
    END IF;
END $$;

-- 2. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Tabla: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    website TEXT,
    xp INT4 DEFAULT 0,
    role public.user_role DEFAULT 'user'::public.user_role,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    custom_badge TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    skills_tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- 4. Tabla: blog_categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT
);

-- 5. Tabla: articles (Fusión de referencia + local)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    content_html TEXT,
    featured_image TEXT,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author TEXT,
    status TEXT DEFAULT 'published',
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    fts TSVECTOR,
    reading_time INT4,
    views INT4 DEFAULT 0,
    featured_image_alt TEXT,
    section TEXT,
    social_meta JSONB,
    -- Columnas requeridas localmente por el frontend actual:
    excerpt TEXT,
    image_url TEXT,
    comments_count INT4 DEFAULT 0,
    score NUMERIC,
    platforms TEXT[] DEFAULT '{}'::TEXT[],
    tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- 6. Tabla: articulos (Opcional - Tabla en español)
CREATE TABLE IF NOT EXISTS public.articulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    contenido TEXT,
    resumen TEXT,
    autor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    estado public.estado_articulo DEFAULT 'borrador'::public.estado_articulo,
    imagen_destacada_url TEXT,
    imagen_destacada_alt TEXT,
    meta_titulo TEXT,
    meta_descripcion TEXT,
    estrategia_keywords JSONB,
    fecha_creacion TIMESTAMPTZ DEFAULT now(),
    fecha_actualizacion TIMESTAMPTZ DEFAULT now()
);

-- 7. Tabla: article_comments
CREATE TABLE IF NOT EXISTS public.article_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT,
    user_avatar TEXT,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Tabla: article_likes
CREATE TABLE IF NOT EXISTS public.article_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT article_likes_user_article_key UNIQUE (user_id, article_id)
);

-- 9. Tabla: contact_submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    phone TEXT,
    status TEXT DEFAULT 'pending',
    user_agent TEXT
);

-- 10. Tabla: team_members
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    role TEXT,
    bio TEXT,
    avatar_url TEXT,
    order_index INT4 DEFAULT 0
);

-- 11. Tabla: ad_settings
CREATE TABLE IF NOT EXISTS public.ad_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_name TEXT UNIQUE,
    is_enabled BOOLEAN DEFAULT true,
    ad_client TEXT,
    ad_slot TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Tabla: resources
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    category TEXT,
    link TEXT,
    file_type TEXT,
    file_size TEXT,
    status TEXT DEFAULT 'active',
    published_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Tabla: blog_news
CREATE TABLE IF NOT EXISTS public.blog_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    slug TEXT UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    category TEXT,
    status TEXT DEFAULT 'published',
    reading_time INT4,
    published_at TIMESTAMPTZ DEFAULT now(),
    views INT4 DEFAULT 0
);

-- 14. Tabla: media_items (Biblioteca de Medios local)
CREATE TABLE IF NOT EXISTS public.media_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('image', 'video')),
    size BIGINT NOT NULL,
    uploaded_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS en las tablas principales
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- 15. Políticas RLS básicas (Lectura pública, Escritura autenticados)
CREATE POLICY "Lectura pública de perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Actualizar propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lectura pública de artículos" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Modificación de artículos para autenticados" ON public.articles FOR ALL TO authenticated USING (true);

CREATE POLICY "Lectura pública de articulos_es" ON public.articulos FOR SELECT USING (true);
CREATE POLICY "Modificación de articulos_es para autenticados" ON public.articulos FOR ALL TO authenticated USING (true);

CREATE POLICY "Lectura pública de comentarios" ON public.article_comments FOR SELECT USING (true);
CREATE POLICY "Insertar comentarios para autenticados" ON public.article_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Lectura pública de likes" ON public.article_likes FOR SELECT USING (true);
CREATE POLICY "Insertar likes para autenticados" ON public.article_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Borrar propio like" ON public.article_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Lectura pública de medios" ON public.media_items FOR SELECT USING (true);
CREATE POLICY "Modificación de medios para autenticados" ON public.media_items FOR ALL TO authenticated USING (true);

-- 16. Función y disparador para generar SLUG automáticamente si no se provee
CREATE OR REPLACE FUNCTION public.generate_slug()
RETURNS TRIGGER AS $$
DECLARE
    new_slug TEXT;
    base_text TEXT;
BEGIN
    IF TG_TABLE_NAME = 'articulos' THEN
        base_text := NEW.titulo;
    ELSE
        base_text := NEW.title;
    END IF;

    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        new_slug := lower(regexp_replace(base_text, '[^a-zA-Z0-9\s]', '', 'g'));
        new_slug := regexp_replace(new_slug, '\s+', '-', 'g');
        NEW.slug := new_slug || '-' || floor(random() * 100000)::text;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_generate_slug_articles
    BEFORE INSERT ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.generate_slug();

CREATE OR REPLACE TRIGGER trg_generate_slug_articulos
    BEFORE INSERT ON public.articulos
    FOR EACH ROW EXECUTE FUNCTION public.generate_slug();

-- 17. Función y disparador para crear un perfil automáticamente al registrarse un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name'),
        NEW.raw_user_meta_data->>'avatar_url',
        'user'::public.user_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sincronizar usuarios existentes por si acaso
INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)),
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'display_name'),
    raw_user_meta_data->>'avatar_url',
    'user'::public.user_role
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 18. Crear los buckets de storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- 19. Políticas para los buckets
DO $$ 
BEGIN
    -- article-images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Select policy for article-images') THEN
        CREATE POLICY "Public Select policy for article-images" ON storage.objects FOR SELECT USING (bucket_id = 'article-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Insert policy for article-images') THEN
        CREATE POLICY "Authenticated Insert policy for article-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'article-images' AND auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Delete policy for article-images') THEN
        CREATE POLICY "Authenticated Delete policy for article-images" ON storage.objects FOR DELETE USING (bucket_id = 'article-images' AND auth.role() = 'authenticated');
    END IF;

    -- videos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Select policy for videos') THEN
        CREATE POLICY "Public Select policy for videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Insert policy for videos') THEN
        CREATE POLICY "Authenticated Insert policy for videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Delete policy for videos') THEN
        CREATE POLICY "Authenticated Delete policy for videos" ON storage.objects FOR DELETE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');
    END IF;
END $$;
