import { Article, TrendingGame } from '../types';
import { ARTICLES_DATA, TRENDING_GAMES_DATA } from '../data/articlesData';

// Helper to simulate network latency if needed, but resolved immediately for maximum speed.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const articleService = {
  /**
   * Obtiene todos los artículos ordenados por fecha de creación descendente
   */
  async getAllArticles(): Promise<Article[]> {
    await delay(100);
    return [...ARTICLES_DATA].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  },

  /**
   * Obtiene un artículo específico por su ID / Slug
   */
  async getArticleById(id: string): Promise<Article | null> {
    await delay(50);
    const article = ARTICLES_DATA.find(a => a.id === id);
    return article ? { ...article } : null;
  },

  /**
   * Obtiene artículos pertenecientes a una categoría específica (e.g. Análisis, Guías, Noticias)
   */
  async getArticlesByCategory(category: string): Promise<Article[]> {
    await delay(100);
    const filtered = ARTICLES_DATA.filter(
      a => a.category.toLowerCase() === category.toLowerCase()
    );
    return filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  },

  /**
   * Obtiene artículos pertenecientes a una plataforma específica (e.g. PlayStation, Xbox, Switch, PC)
   */
  async getArticlesByPlatform(platform: string): Promise<Article[]> {
    await delay(100);
    const filtered = ARTICLES_DATA.filter(
      a => a.platform.some(p => p.toLowerCase() === platform.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  },

  /**
   * Obtiene los videojuegos en tendencia actual
   */
  async getTrendingGames(): Promise<TrendingGame[]> {
    await delay(50);
    return [...TRENDING_GAMES_DATA];
  }
};
