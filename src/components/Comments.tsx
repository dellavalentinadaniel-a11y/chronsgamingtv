import React from 'react';
import { MessageSquare } from 'lucide-react';

interface CommentsProps {
  articleId: string;
}

export function Comments({ articleId }: CommentsProps) {
  return (
    <div className="mt-12 pt-12 border-t border-zinc-800">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-orange-500" />
        Comentarios
      </h3>
      
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-xl">
        <p className="text-zinc-300 font-medium mb-2">
          Sección de comentarios en mantenimiento
        </p>
        <p className="text-zinc-500 text-sm">
          Estamos optimizando nuestro portal para mejorar los tiempos de carga y el posicionamiento SEO. Los comentarios volverán a estar disponibles muy pronto.
        </p>
      </div>
    </div>
  );
}

