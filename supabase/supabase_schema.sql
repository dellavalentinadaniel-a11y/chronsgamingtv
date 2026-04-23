-- Supabase Migration Schema
-- Based on firebase-blueprint.json

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: media_items
-- Represents an uploaded image or video in the media library.
CREATE TABLE IF NOT EXISTS public.media_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('image', 'video')),
    size BIGINT NOT NULL,
    uploaded_by TEXT NOT NULL, -- Storing as text to support legacy IDs if needed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Adding a simple search index
    CONSTRAINT media_items_url_key UNIQUE (url)
);

-- Table: articles
-- A news article or review.
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    category TEXT,
    author TEXT,
    author_id UUID, -- Assuming migration to UUID-based Auth
    score NUMERIC,
    platforms TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: comments
-- A user comment on an article.
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL, -- Can be text or UUID
    author_name TEXT NOT NULL,
    author_photo_url TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) - Basic Example
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public Read Comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Public Read Media" ON public.media_items FOR SELECT USING (true);
