import React from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { TRENDING_GAMES } from '../constants';

export function Sidebar() {
  return (
    <aside className="space-y-8">
      {/* Trending Section */}
      <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Flame className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Top Tendencias</h2>
        </div>
        
        <div className="space-y-4">
          {TRENDING_GAMES.map((game, index) => (
            <div key={game.id} className="flex items-center space-x-4 group cursor-pointer">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={game.imageUrl} 
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-zinc-200 truncate group-hover:text-orange-400 transition-colors">
                  {game.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs font-mono text-zinc-500">#{game.rank}</span>
                  {game.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter or Ad Space */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-900 rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Únete a la comunidad</h3>
        <p className="text-sm text-orange-200 mb-4">Recibe las mejores noticias y análisis en tu correo.</p>
        <button className="w-full bg-white text-orange-900 font-bold py-2 rounded-lg hover:bg-zinc-100 transition-colors">
          Suscribirse
        </button>
      </div>
    </aside>
  );
}
