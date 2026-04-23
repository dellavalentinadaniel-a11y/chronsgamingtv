import { Article, TrendingGame } from './types';

export const FEATURED_ARTICLE: Article = {
  id: '1',
  title: 'Análisis de Final Fantasy VII Rebirth: Una obra maestra que redefine el RPG',
  excerpt: 'Exploramos cada rincón del mundo abierto, el sistema de combate mejorado y la historia que nos ha dejado sin palabras.',
  imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2000&auto=format&fit=crop',
  category: 'Análisis',
  author: 'Carlos Gómez',
  date: 'Hace 2 horas',
  score: 9.5,
  commentsCount: 342,
  platform: ['PS5']
};

export const LATEST_NEWS: Article[] = [
  {
    id: '2',
    title: 'Nuevos detalles del multijugador de The Last of Us revelados',
    excerpt: 'Naughty Dog comparte arte conceptual y algunas mecánicas clave del esperado modo.',
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop',
    category: 'Noticias',
    author: 'Ana Martínez',
    date: 'Hace 4 horas',
    commentsCount: 128,
    platform: ['PS5', 'PC']
  },
  {
    id: '3',
    title: 'Xbox anuncia un nuevo evento para la próxima semana',
    excerpt: 'Se esperan anuncios de juegos first-party y llegadas a Game Pass.',
    imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800&auto=format&fit=crop',
    category: 'Eventos',
    author: 'Luis Pérez',
    date: 'Hace 5 horas',
    commentsCount: 85,
    platform: ['Xbox', 'PC']
  },
  {
    id: '4',
    title: 'Review: Dragon\'s Dogma 2, rol puro y duro',
    excerpt: 'Capcom vuelve a la carga con una secuela que mejora en todo al original.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    category: 'Análisis',
    author: 'Elena Ruiz',
    date: 'Hace 6 horas',
    score: 8.8,
    commentsCount: 210,
    platform: ['PS5', 'Xbox', 'PC']
  },
  {
    id: '5',
    title: 'Nintendo Switch 2: Todos los rumores hasta la fecha',
    excerpt: 'Recopilamos la información más fiable sobre la próxima consola de Nintendo.',
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=800&auto=format&fit=crop',
    category: 'Reportaje',
    author: 'David López',
    date: 'Hace 8 horas',
    commentsCount: 560,
    platform: ['Switch']
  }
];

export const TRENDING_GAMES: TrendingGame[] = [
  { id: 't1', title: 'Final Fantasy VII Rebirth', imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=200&auto=format&fit=crop', rank: 1, trend: 'up' },
  { id: 't2', title: 'Helldivers 2', imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=200&auto=format&fit=crop', rank: 2, trend: 'stable' },
  { id: 't3', title: 'Dragon\'s Dogma 2', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop', rank: 3, trend: 'up' },
  { id: 't4', title: 'Palworld', imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=200&auto=format&fit=crop', rank: 4, trend: 'down' },
  { id: 't5', title: 'Elden Ring: Shadow of the Erdtree', imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=200&auto=format&fit=crop', rank: 5, trend: 'up' },
];
