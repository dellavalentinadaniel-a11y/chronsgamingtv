import React, { useState } from 'react';
import { Search, Menu, X, Gamepad2, Monitor, Smartphone, Tv, Image as ImageIcon, LogIn, LogOut, PenSquare } from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-600">
                <img 
                  src="/channels4_profile.jpg" 
                  alt="ChronsGamingtv Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-white font-black text-xl flex items-center justify-center w-full h-full bg-orange-600">C</span>';
                  }}
                />
              </div>
              <span className="text-white font-black text-xl tracking-tight">CHRONSGAMINGTV</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-6">
                <Link to="/" className="text-zinc-300 hover:text-orange-500 font-medium transition-colors">Noticias</Link>
                <Link to="/analisis" className="text-zinc-300 hover:text-orange-500 font-medium transition-colors">Análisis</Link>
                <Link to="/guias" className="text-zinc-300 hover:text-orange-500 font-medium transition-colors">Guías</Link>
              </div>
              
              <div className="flex items-center space-x-4 border-l border-zinc-800 pl-6">
                <Link to="/plataforma/playstation" title="PlayStation">
                  <Gamepad2 className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
                </Link>
                <Link to="/plataforma/xbox" title="Xbox">
                  <Tv className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
                </Link>
                <Link to="/plataforma/pc" title="PC">
                  <Monitor className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
                </Link>
              </div>
            </div>

            {/* Search, Auth & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              <button className="text-zinc-400 hover:text-white transition-colors" aria-label="Buscar" title="Buscar">
                <Search className="w-5 h-5" />
              </button>
              
              {user ? (
                <div className="hidden md:flex items-center space-x-3 border-l border-zinc-800 pl-4">
                  <Link 
                    to="/editor"
                    className="flex items-center gap-1 text-sm font-medium bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-md transition-colors"
                    title="Escribir Artículo"
                  >
                    <PenSquare className="w-4 h-4" />
                    <span>Escribir</span>
                  </Link>
                  <Link 
                    to="/media"
                    className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-orange-400 transition-colors"
                    title="Biblioteca de Medios"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/perfil"
                    className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-orange-400 transition-colors"
                    title="Mi Perfil"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="User" className="w-8 h-8 rounded-full border border-zinc-700 object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <span className="text-xs font-bold text-zinc-400">{(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                    )}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-white transition-colors border-l border-zinc-800 pl-4"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </button>
              )}

              <button 
                className="md:hidden text-zinc-400 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
            <div className="px-4 pt-4 pb-6 space-y-6">
              {/* Main Sections Tabs */}
              <div className="flex bg-zinc-950 p-1 rounded-xl">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all ${location.pathname === '/' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                  Noticias
                </Link>
                <Link 
                  to="/analisis" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all ${location.pathname === '/analisis' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                  Análisis
                </Link>
                <Link 
                  to="/guias" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all ${location.pathname === '/guias' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                  Guías
                </Link>
              </div>
              
              {/* Platforms */}
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-1">Plataformas</p>
                <div className="grid grid-cols-3 gap-2">
                  <Link 
                    to="/plataforma/playstation" 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${location.pathname === '/plataforma/playstation' ? 'bg-zinc-800 border-orange-500/50 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                  >
                    <Gamepad2 className="w-6 h-6" />
                    <span className="text-xs font-medium">PS</span>
                  </Link>
                  <Link 
                    to="/plataforma/xbox" 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${location.pathname === '/plataforma/xbox' ? 'bg-zinc-800 border-orange-500/50 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                  >
                    <Tv className="w-6 h-6" />
                    <span className="text-xs font-medium">Xbox</span>
                  </Link>
                  <Link 
                    to="/plataforma/pc" 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${location.pathname === '/plataforma/pc' ? 'bg-zinc-800 border-orange-500/50 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                  >
                    <Monitor className="w-6 h-6" />
                    <span className="text-xs font-medium">PC</span>
                  </Link>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                {user ? (
                  <>
                    <Link 
                      to="/editor"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-orange-400 hover:text-white hover:bg-zinc-800"
                    >
                      <PenSquare className="w-5 h-5" />
                      Escribir Artículo
                    </Link>
                    <Link 
                      to="/media"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Biblioteca de Medios
                    </Link>
                    <Link 
                      to="/perfil"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        {user.user_metadata?.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="User" className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-zinc-300">{(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase() || 'U'}</span>
                          </div>
                        )}
                      </div>
                      Mi Perfil
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      <LogOut className="w-5 h-5" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleLogin}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
                  >
                    <LogIn className="w-5 h-5" />
                    Iniciar sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
