import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArticleCard } from '../components/ArticleCard';
import { Sidebar } from '../components/Sidebar';
import { Article } from '../types';
import { Gamepad2, Monitor, Smartphone, Tv, Loader2 } from 'lucide-react';

const PLATFORM_MAP: Record<string, string> = {
  'playstation': 'PlayStation',
  'xbox': 'Xbox',
  'pc': 'PC',
  'switch': 'Switch'
};

export function PlatformPage() {
  const { platformId } = useParams<{ platformId: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const platformName = platformId ? PLATFORM_MAP[platformId.toLowerCase()] : null;

  useEffect(() => {
    if (!platformName) {
      setLoading(false);
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .contains('platform', [platformName])
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
      } else {
        const fetched = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          category: item.category,
          imageUrl: item.image_url,
          author: item.author,
          authorId: item.author_id,
          commentsCount: item.comments_count,
          tags: item.tags,
          score: item.score,
          platform: item.platform,
          createdAt: item.created_at
        } as Article));
        setArticles(fetched);
      }
      setLoading(false);
    };

    fetchArticles();

    // Realtime subscription
    const channel = supabase
      .channel(`platform_${platformId}_changes`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'articles'
      }, () => {
        fetchArticles();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [platformName, platformId]);

  const getPlatformIcon = () => {
    switch (platformName) {
      case 'PlayStation': return <Gamepad2 className="w-8 h-8 text-orange-500" />;
      case 'Xbox': return <Tv className="w-8 h-8 text-orange-500" />;
      case 'Switch': return <Smartphone className="w-8 h-8 text-orange-500" />;
      case 'PC': return <Monitor className="w-8 h-8 text-orange-500" />;
      default: return <Gamepad2 className="w-8 h-8 text-orange-500" />;
    }
  };

  if (!platformName) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Plataforma no encontrada</h1>
        <p className="text-zinc-400">La plataforma que buscas no existe.</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex items-center gap-4 border-b border-zinc-800 pb-6">
        {getPlatformIcon()}
        <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
          {platformName}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800">
              <p className="text-xl">No hay artículos publicados para esta plataforma todavía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} featured={index === 0} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
