import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Twitter, Youtube, Twitch, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-auto pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Gamepad2 className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-black tracking-tighter text-white">
                CHRONS<span className="text-orange-500">GAMING</span>TV
              </span>
            </Link>
            <p className="text-zinc-400 max-w-md">
              Tu portal definitivo para noticias, análisis, guías y todo el contenido relacionado con el mundo de los videojuegos.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-zinc-400 hover:text-orange-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-orange-500 transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-orange-500 transition-colors"><Twitch className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-orange-500 transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Secciones</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-zinc-400 hover:text-orange-500 transition-colors">Noticias</Link></li>
              <li><Link to="/analisis" className="text-zinc-400 hover:text-orange-500 transition-colors">Análisis</Link></li>
              <li><Link to="/guias" className="text-zinc-400 hover:text-orange-500 transition-colors">Guías</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacidad" className="text-zinc-400 hover:text-orange-500 transition-colors">Política de Privacidad</Link></li>
              <li><Link to="/terminos" className="text-zinc-400 hover:text-orange-500 transition-colors">Términos de Servicio</Link></li>
              <li><Link to="/cookies" className="text-zinc-400 hover:text-orange-500 transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} ChronsGamingtv. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
