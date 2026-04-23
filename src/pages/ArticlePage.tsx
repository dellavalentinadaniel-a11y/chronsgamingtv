import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Article } from '../types';
import { ArrowLeft, Gamepad2, Monitor, Smartphone, Tv, Loader2, Calendar } from 'lucide-react';
import { ScoreBadge } from '../components/ScoreBadge';
import Markdown from 'react-markdown';
import { Comments } from '../components/Comments';
import { ArticleCard } from '../components/ArticleCard';

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          // Format date from ISO string
          const dateStr = new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }).format(new Date(data.created_at));

          const currentArticle = { 
            id: data.id, 
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category,
            imageUrl: data.image_url,
            author: data.author,
            authorId: data.author_id,
            commentsCount: data.comments_count,
            tags: data.tags,
            score: data.score,
            platform: data.platform,
            date: dateStr,
            createdAt: data.created_at
          } as Article;

          setArticle(currentArticle);

          // Fetch related articles
          fetchRelatedArticles(currentArticle);
        } else {
          setError("El artículo no existe o ha sido eliminado.");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Error al cargar el artículo.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedArticles = async (currentArticle: Article) => {
      try {
        const { data, error: relatedError } = await supabase
          .from('articles')
          .select('*')
          .eq('category', currentArticle.category)
          .limit(10);
        
        if (relatedError) throw relatedError;

        let related: Article[] = (data || [])
          .filter(item => item.id !== currentArticle.id)
          .map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            category: item.category,
            imageUrl: item.image_url,
            author: item.author,
            commentsCount: item.comments_count,
            tags: item.tags,
            score: item.score,
            platform: item.platform,
            createdAt: item.created_at
          } as Article));

        // Sort by tag overlap if tags exist
        if (currentArticle.tags && currentArticle.tags.length > 0) {
          related.sort((a, b) => {
            const aOverlap = (a.tags || []).filter(t => currentArticle.tags?.includes(t)).length;
            const bOverlap = (b.tags || []).filter(t => currentArticle.tags?.includes(t)).length;
            return bOverlap - aOverlap; // Descending order of overlap
          });
        }

        // Keep top 3
        setRelatedArticles(related.slice(0, 3));
      } catch (err) {
        console.error("Error fetching related articles:", err);
      }
    };

    fetchArticle();
  }, [id]);

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'PlayStation': return <Gamepad2 className="w-4 h-4" />;
      case 'Xbox': return <Tv className="w-4 h-4" />;
      case 'Switch': return <Smartphone className="w-4 h-4" />;
      case 'PC': return <Monitor className="w-4 h-4" />;
      default: return <Gamepad2 className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Oops...</h1>
        <p className="text-zinc-400 mb-8">{error || "Artículo no encontrado"}</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  const isReview = article.category === 'Análisis';

  return (
    <article className="min-h-screen bg-zinc-950 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px]">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-4 md:left-8 flex items-center gap-2 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm font-bold uppercase tracking-wider text-white bg-orange-600 rounded-sm">
              {article.category}
            </span>
            {article.platform && article.platform.map(plat => (
              <span 
                key={plat} 
                className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md text-zinc-100 text-sm font-bold px-3 py-1 rounded-lg border border-zinc-700/50"
              >
                {getPlatformIcon(plat)}
                {plat}
              </span>
            ))}
            {article.tags && article.tags.map(tag => (
              <span 
                key={tag} 
                className="flex items-center bg-zinc-800/80 backdrop-blur-md text-zinc-300 text-sm font-medium px-3 py-1 rounded-lg border border-zinc-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-zinc-300">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-orange-500 font-bold">
                {article.author.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
          </div>
        </div>

        {/* Score Badge */}
        {article.score !== undefined && (
          <div className="absolute bottom-12 right-4 md:right-8 z-10">
            <ScoreBadge 
              score={article.score} 
              className={isReview ? "w-24 h-24 text-4xl font-black bg-zinc-950/90 border-4 shadow-[0_0_40px_rgba(0,0,0,0.8)]" : "w-16 h-16 text-2xl"} 
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-12">
        <div className="prose prose-invert prose-orange max-w-none prose-lg prose-headings:font-bold prose-a:text-orange-500 hover:prose-a:text-orange-400 prose-img:rounded-xl">
          <Markdown>{article.content}</Markdown>
        </div>
        
        {/* Comments Section */}
        {id && <Comments articleId={id} />}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12 border-t border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-600 rounded-sm"></span>
            Artículos Relacionados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map(related => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
