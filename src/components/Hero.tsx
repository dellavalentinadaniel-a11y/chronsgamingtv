import React from 'react';
import { Play } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-orange-600 rounded-sm">
              Exclusiva
            </span>
            <span className="text-zinc-300 text-sm font-medium">Hace 1 hora</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            El futuro del gaming: Lo que nos espera en la próxima generación
          </h1>
          
          <p className="text-lg text-zinc-300 mb-8 line-clamp-2 md:line-clamp-none max-w-2xl">
            Analizamos las tecnologías emergentes, los motores gráficos de nueva generación y cómo cambiará nuestra forma de jugar en los próximos años.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold transition-colors">
              <span>Leer Artículo</span>
            </button>
            <button className="flex items-center space-x-2 bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold transition-colors border border-zinc-700">
              <Play className="w-5 h-5" />
              <span>Ver Video</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
