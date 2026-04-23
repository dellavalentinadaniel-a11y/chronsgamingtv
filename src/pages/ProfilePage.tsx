import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Camera, Save, Loader2, MessageSquare, FileText, Settings, LogOut } from 'lucide-react';
import { Article, Comment } from '../types';

type Tab = 'settings' | 'comments' | 'articles';

export function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        setDisplayName(user.user_metadata?.full_name || user.user_metadata?.display_name || '');
        setPhotoURL(user.user_metadata?.avatar_url || '');
        fetchUserData(user.id);
      } else {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  const fetchUserData = async (uid: string) => {
    setLoadingData(true);
    try {
      // Fetch user's articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', uid)
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      const mappedArticles = (articlesData || []).map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category,
        imageUrl: item.image_url,
        author: item.author,
        authorId: item.author_id,
        commentsCount: item.comments_count,
        tags: item.tags,
        score: item.score,
        platform: item.platform,
        createdAt: item.created_at
      } as Article));
      setUserArticles(mappedArticles);

      // Fetch user's comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('author_id', uid)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      const mappedComments = (commentsData || []).map(item => ({
        id: item.id,
        articleId: item.article_id,
        author: item.author,
        authorId: item.author_id,
        content: item.content,
        createdAt: item.created_at
      } as Comment));
      setUserComments(mappedComments);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          display_name: displayName.trim(),
          avatar_url: photoURL.trim()
        }
      });

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Hubo un error al actualizar el perfil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return 'Fecha desconocida';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-600/20 to-purple-600/20"></div>
        
        <div className="relative z-10">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-800 border-4 border-zinc-950 shadow-xl flex items-center justify-center">
            {user.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt={user.user_metadata?.full_name || 'Avatar'} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserIcon className="w-16 h-16 text-zinc-500" />
            )}
          </div>
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left pt-2">
          <h1 className="text-3xl font-black text-white mb-2">{user.user_metadata?.full_name || 'Usuario Anónimo'}</h1>
          <p className="text-zinc-400 mb-6">{user.email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-300 font-medium">{userComments.length} Comentarios</span>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-300 font-medium">{userArticles.length} Artículos</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4 md:mt-0">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-zinc-800 mb-8 hide-scrollbar">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'settings' 
              ? 'border-orange-500 text-orange-500' 
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          Ajustes
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'comments' 
              ? 'border-orange-500 text-orange-500' 
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Mis Comentarios
        </button>
        {userArticles.length > 0 && (
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'articles' 
                ? 'border-orange-500 text-orange-500' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Mis Artículos
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {loadingData ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Información Personal</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {message.text}
                    </div>
                  )}

                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-zinc-300 mb-2">
                      Nombre de visualización
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      placeholder="Ej. GamerPro99"
                    />
                  </div>

                  <div>
                    <label htmlFor="photoURL" className="block text-sm font-medium text-zinc-300 mb-2">
                      URL de la foto de perfil
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Camera className="w-5 h-5 text-zinc-500" />
                      </div>
                      <input
                        type="url"
                        id="photoURL"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                        placeholder="https://ejemplo.com/mi-foto.jpg"
                      />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      Pega la URL de una imagen para usarla como tu avatar.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Guardar Cambios</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                {userComments.length === 0 ? (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Aún no has comentado</h3>
                    <p className="text-zinc-400">Tus comentarios en los artículos aparecerán aquí.</p>
                  </div>
                ) : (
                  userComments.map(comment => (
                    <div key={comment.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm text-zinc-500">{formatDate(comment.createdAt)}</span>
                        <Link 
                          to={`/article/${comment.articleId}`}
                          className="text-xs font-medium text-orange-500 hover:text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full transition-colors"
                        >
                          Ver artículo
                        </Link>
                      </div>
                      <p className="text-zinc-300 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Articles Tab */}
            {activeTab === 'articles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userArticles.map(article => (
                  <Link 
                    to={`/article/${article.id}`} 
                    key={article.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-zinc-950/80 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white">
                        {article.category}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                        {article.title}
                      </h3>
                      <div className="mt-auto pt-4 flex justify-between items-center text-xs text-zinc-500">
                        <span>{formatDate(article.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {article.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
