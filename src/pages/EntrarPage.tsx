import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Loader2, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function EntrarPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { signInWithPassword, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithPassword(email, password);
        navigate('/');
      } else {
        await signUp(email, password, name);
        setSuccessMsg('¡Cuenta creada con éxito! Por favor verifica tu correo electrónico (si está requerido) o inicia sesión.');
        setIsLogin(true); // Switch to login view after successful signup
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error al conectar con Google');
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Iniciar Sesión' : 'Registrarse'} - ChronsGamingtv</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
        {/* Background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-500 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>

          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                {isLogin ? 'Bienvenido de vuelta' : 'Únete a la comunidad'}
              </h1>
              <p className="text-zinc-400 text-sm">
                {isLogin ? 'Ingresa tus credenciales para continuar' : 'Crea tu cuenta para guardar tus progresos y comentar'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-6">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-medium mb-6">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nombre de usuario</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <UserIcon className="w-5 h-5 text-zinc-500" />
                    </div>
                    <input
                      type="text"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      placeholder="GamerPro99"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-zinc-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-zinc-800"></div>
              <span className="text-zinc-500 text-sm font-medium">O continúa con</span>
              <div className="flex-1 h-px bg-zinc-800"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="mt-6 w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>

            <div className="mt-8 text-center">
              <p className="text-zinc-400 text-sm">
                {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-orange-500 font-semibold hover:text-orange-400 transition-colors"
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
