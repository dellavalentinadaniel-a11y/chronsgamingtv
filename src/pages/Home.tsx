import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/articleService';
import { Hero } from '../components/Hero';
import { ArticleCard } from '../components/ArticleCard';
import { Sidebar } from '../components/Sidebar';
import { SEO } from '../components/SEO';
import { FEATURED_ARTICLE } from '../constants';
import { Article } from '../types';
import { Star, MessageSquare } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(7); // 1 featured + 6 regular

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getAllArticles();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Combinamos con las constantes locales por si hiciera falta de respaldo, 
  // pero ya la base de datos local articlesData incluye todos los contenidos premium.
  const displayArticles = articles;
  
  // Encontramos el artículo con más comentarios para destacarlo
  const featured = displayArticles.length > 0 ? displayArticles.reduce((prev, current) => {
    return (current.commentsCount || 0) > (prev.commentsCount || 0) ? current : prev;
  }, displayArticles[0]) : FEATURED_ARTICLE;

  // Filtramos el destacado del resto
  const restArticles = displayArticles.filter(a => a.id !== featured.id).slice(0, displayCount - 1);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  return (
    <main>
      <SEO 
        title="Inicio" 
        description="Bienvenidos a ChronsGamingtv, tu portal de referencia sobre videojuegos. Encuentra las últimas noticias, guías de juegos populares, trucos y análisis detallados en español."
      />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-6 bg-orange-600 rounded-sm"></span>
                Últimas Noticias
              </h2>
            </div>
            
            {loading ? (
              <div className="text-zinc-400 text-center py-12">Cargando noticias...</div>
            ) : (
              <>
                {/* Featured Article Custom Layout */}
                {featured && (
                  <div className="mb-10">
                    <Link to={`/article/${featured.id}`} className="group relative block rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all shadow-2xl">
                      <div className="aspect-[16/9] md:aspect-[2.5/1] relative">
                        <LazyLoadImage
                          src={featured.imageUrl}
                          alt={featured.title}
                          effect="blur"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          wrapperClassName="w-full h-full"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent md:bg-gradient-to-r md:from-zinc-950 md:via-zinc-950/90 md:to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 md:w-2/3 md:top-0 md:flex md:flex-col md:justify-center">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-orange-600 rounded-sm flex items-center gap-1.5 shadow-lg shadow-orange-600/20">
                            <Star className="w-3.5 h-3.5 fill-current" /> Destacado
                          </span>
                          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-300 bg-zinc-800 rounded-sm border border-zinc-700">
                            {featured.category}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors line-clamp-2 md:line-clamp-3 leading-tight">
                          {featured.title}
                        </h3>
                        <p className="text-zinc-300 mb-6 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                          {featured.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-orange-500 font-bold text-xs">
                              {featured.author.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-zinc-300">{featured.author}</span>
                          </div>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4" />
                            {featured.commentsCount || 0} comentarios
                          </span>
                          <span>•</span>
                          <span>{featured.date || (featured.createdAt?.toDate && featured.createdAt.toDate().toLocaleDateString()) || 'Reciente'}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {restArticles.map((article, index) => (
                    <ArticleCard key={article.id || index} article={article} />
                  ))}
                </div>
                
                {displayCount < displayArticles.length && (
                  <div className="flex justify-center mt-8">
                    <button 
                      onClick={handleLoadMore}
                      className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl border border-zinc-800 hover:border-orange-500/50 transition-all duration-300"
                    >
                      Cargar más
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
