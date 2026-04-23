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
    <Link to={`/article/${article.id}`} className={`block group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/50 transition-all duration-300 hover:border-orange-500/30 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-orange-500/5 ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}>
      <article className="h-full flex flex-col">
        <div className={`relative ${featured ? 'aspect-[21/9] md:aspect-[16/9]' : 'aspect-[16/10]'} overflow-hidden`}>
        <LazyLoadImage 
          src={article.imageUrl} 
          alt={article.title}
          effect="blur"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          wrapperClassName="w-full h-full"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-orange-600 rounded-sm shadow-lg shadow-orange-600/20">
            {article.category}
          </span>
        </div>

        {/* Score Badge */}
        {article.score !== undefined && (
          <div className="absolute top-4 right-4 z-10">
            <ScoreBadge 
              score={article.score} 
              className={isReview ? "w-14 h-14 text-xl font-black bg-zinc-950/90 border-2 border-orange-500/50" : "w-10 h-10 text-sm"} 
            />
          </div>
        )}
      </div>

      <div className={`p-5 ${featured ? 'md:p-8' : ''} flex flex-col flex-grow`}>
        {/* Platforms */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.platform && article.platform.map(plat => (
            <span 
              key={plat} 
              className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider"
            >
              {getPlatformIcon(plat)}
              {plat}
            </span>
          ))}
        </div>

        <h3 className={`font-serif font-bold text-white mb-3 leading-tight group-hover:text-orange-400 transition-colors ${featured ? 'text-2xl md:text-4xl' : 'text-xl'}`}>
          {article.title}
        </h3>
        
        <p className="text-zinc-400 text-sm line-clamp-2 mb-4 font-sans leading-relaxed">
          {article.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="text-zinc-300">{article.author}</span>
            <span>{article.date}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleVibeCheck}
              disabled={isLoadingVibe || !!vibe}
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>{isLoadingVibe ? '...' : 'Vibe'}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{article.commentsCount}</span>
            </div>
          </div>
        </div>

        {vibe && (
          <div className="mt-4 p-3 bg-orange-950/20 border border-orange-500/10 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
            <p className="text-xs text-orange-200/80 italic leading-relaxed">"{vibe}"</p>
          </div>
        )}
      </div>
    </article>
  </Link>
  );
}
