import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Article } from '../types';
import { Gamepad2, Monitor, Smartphone, Tv, Loader2 } from 'lucide-react';
import { ScoreBadge } from '../components/ScoreBadge';
import { cn } from '../lib/utils';

const PLATFORMS = ['Todas', 'PlayStation', 'Xbox', 'Switch', 'PC'];

export function ReviewsPage() {
  const [allReviews, setAllReviews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('Todas');
  const [selectedTag, setSelectedTag] = useState('Todas');
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'Análisis')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
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
        setAllReviews(fetched);
      }
      setLoading(false);
    };

    fetchReviews();

    // Realtime subscription
    const channel = supabase
      .channel('reviews_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'articles',
        filter: "category=eq.Análisis" 
      }, () => {
        fetchReviews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const availableTags = ['Todas', ...Array.from(new Set(allReviews.flatMap(r => r.tags || []))).sort()];

  const filteredReviews = allReviews.filter(review => {
    const matchPlatform = selectedPlatform === 'Todas' || (review.platform && review.platform.includes(selectedPlatform));
    const matchTag = selectedTag === 'Todas' || (review.tags && review.tags.includes(selectedTag));
    return matchPlatform && matchTag;
  });

  const displayedReviews = filteredReviews.slice(0, displayCount);
  const hasMore = displayCount < filteredReviews.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'PlayStation': return <Gamepad2 className="w-3 h-3" />;
      case 'Xbox': return <Tv className="w-3 h-3" />;
      case 'Switch': return <Smartphone className="w-3 h-3" />;
      case 'PC': return <Monitor className="w-3 h-3" />;
      default: return <Gamepad2 className="w-3 h-3" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Análisis</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Descubre nuestras reseñas en profundidad de los últimos lanzamientos. Evaluamos gráficos, jugabilidad, historia y mucho más.
        </p>
      </div>

      {/* Platform Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {PLATFORMS.map((plat) => (
          <button
            key={plat}
            onClick={() => {
              setSelectedPlatform(plat);
              setDisplayCount(6); // Reset pagination on filter change
            }}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
              selectedPlatform === plat
                ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
            )}
          >
            {plat}
          </button>
        ))}
      </div>

      {/* Category/Tag Filters */}
      {availableTags.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                setDisplayCount(6); // Reset pagination on filter change
              }}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                selectedTag === tag
                  ? "bg-zinc-700 text-white"
                  : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 border border-zinc-800"
              )}
            >
              {tag === 'Todas' ? 'Todas las categorías' : `#${tag}`}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl">No se encontraron análisis para esta plataforma.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedReviews.map((review) => (
                <Link 
                  to={`/article/${review.id}`} 
                  key={review.id} 
                  className="block group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 flex flex-col"
                >
                  <article className="flex flex-col h-full">
                    <div className="relative aspect-[16/9] overflow-hidden">
                    <img 
                      src={review.imageUrl} 
                      alt={review.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80"></div>
                    
                    {/* Score Badge */}
                    {review.score !== undefined && (
                      <div className="absolute top-4 right-4 z-10">
                        <ScoreBadge score={review.score} className="w-16 h-16 text-2xl font-black bg-zinc-950/90 border-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]" />
                      </div>
                    )}

                    {/* Platforms */}
                    {review.platform && review.platform.length > 0 && (
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                        {review.platform.map(plat => (
                          <span 
                            key={plat} 
                            className="flex items-center gap-1.5 bg-zinc-950/80 backdrop-blur-md text-zinc-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700/50 shadow-xl"
                          >
                            {getPlatformIcon(plat)}
                            <span className="tracking-wide">{plat}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {review.title}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1">
                      {review.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-orange-500 font-bold text-sm">
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-zinc-300">{review.author}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-16 text-center">
              <button 
                onClick={handleLoadMore}
                className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-orange-500 px-8 py-3 rounded-full font-medium transition-all duration-300"
              >
                Ver más análisis
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
