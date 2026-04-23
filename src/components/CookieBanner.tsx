import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">Valoramos tu privacidad</h3>
          <p className="text-zinc-400 text-sm">
            Utilizamos cookies propias y de terceros para mejorar nuestros servicios, personalizar el contenido y analizar nuestro tráfico. 
            Al hacer clic en "Aceptar todas", aceptas el uso de cookies. Puedes leer más al respecto en nuestra{' '}
            <Link to="/cookies" className="text-orange-500 hover:underline">Política de Cookies</Link>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={declineCookies}
            className="px-6 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Rechazar
          </button>
          <button 
            onClick={acceptCookies}
            className="px-6 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors text-sm font-bold whitespace-nowrap"
          >
            Aceptar todas
          </button>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
