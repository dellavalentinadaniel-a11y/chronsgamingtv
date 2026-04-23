import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Sparkles, Gamepad2, Monitor, Smartphone, Tv } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Article } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { summarizeGameVibe } from '../services/geminiService';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const [vibe, setVibe] = useState<string | null>(null);
  const [isLoadingVibe, setIsLoadingVibe] = useState(false);

  const handleVibeCheck = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (vibe) return;
    
    setIsLoadingVibe(true);
    const result = await summarizeGameVibe(article.title);
    setVibe(result);
    setIsLoadingVibe(false);
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

  const isReview = article.category === 'Análisis';

  return (
    <Link to={`/article/${article.id}`} className={`block group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}>
      <article className="h-full flex flex-col">
        <div className={`relative ${featured ? 'aspect-[21/9] md:aspect-[16/9]' : 'aspect-video'} overflow-hidden`}>
        <LazyLoadImage 
          src={article.imageUrl} 
          alt={article.title}
          effect="blur"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          wrapperClassName="w-full h-full"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-orange-600 rounded-sm">
            {article.category}
          </span>
        </div>

        {/* Score Badge */}
        {article.score !== undefined && (
          <div className="absolute top-4 right-4 z-10">
            <ScoreBadge 
              score={article.score} 
              className={isReview ? "w-16 h-16 text-2xl font-black bg-zinc-950/90 border-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]" : ""} 
            />
          </div>
        )}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 p-4 ${featured ? 'md:p-8' : ''}`}>
        {/* Platforms & Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {article.platform && article.platform.map(plat => (
            <span 
              key={plat} 
              className="flex items-center gap-1.5 bg-zinc-950/80 backdrop-blur-md text-zinc-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700/50 shadow-xl"
            >
              {getPlatformIcon(plat)}
              <span className="tracking-wide">{plat}</span>
            </span>
          ))}
          {article.tags && article.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className="flex items-center bg-zinc-800/80 backdrop-blur-md text-zinc-300 text-xs font-medium px-2 py-1 rounded-md border border-zinc-700/50"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h3 className={`font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors ${featured ? 'text-2xl md:text-4xl' : 'text-lg'}`}>
          {article.title}
        </h3>
        
        {featured && (
          <p className="text-zinc-300 mb-4 line-clamp-2 hidden md:block">
            {article.excerpt}
          </p>
        )}

        {vibe && (
          <div className="mb-4 p-3 bg-orange-950/50 border border-orange-900/50 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">AI Vibe Check</span>
            </div>
            <p className="text-sm text-zinc-300">{vibe}</p>
          </div>
        )}

        <div className="flex items-center text-xs text-zinc-400 space-x-4">
          <span>{article.author}</span>
          <span>•</span>
          <span>{article.date}</span>
          <div className="flex items-center space-x-1 ml-auto">
            <button 
              onClick={handleVibeCheck}
              disabled={isLoadingVibe || !!vibe}
              className="mr-2 flex items-center gap-1 hover:text-orange-400 transition-colors disabled:opacity-50"
              title="Generar resumen con IA"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">{isLoadingVibe ? 'Pensando...' : 'AI Vibe'}</span>
            </button>
            <MessageSquare className="w-4 h-4" />
            <span>{article.commentsCount}</span>
          </div>
        </div>
      </div>
    </article>
  </Link>
  );
}
