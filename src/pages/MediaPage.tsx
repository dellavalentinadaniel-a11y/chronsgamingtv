import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { MediaLibrary } from '../components/MediaLibrary';

export function MediaPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 h-[calc(100vh-80px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-orange-600 rounded-sm"></span>
          Gestión de Medios
        </h1>
        <p className="text-zinc-400 mt-2">
          Sube, organiza y administra todas las imágenes y videos para tus artículos.
        </p>
      </div>
      
      <div className="h-[calc(100%-100px)]">
        <MediaLibrary isModal={false} />
      </div>
    </div>
  );
}
