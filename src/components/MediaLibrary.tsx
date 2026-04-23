import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Film, Trash2, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { cn } from '../lib/utils';
import { MediaUploader } from './MediaUploader';

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  uploadedBy: string;
  createdAt: any;
}

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function MediaLibrary({ onSelect, onClose, isModal = false }: MediaLibraryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Fetch media items from Supabase
    const fetchMedia = async () => {
      const { data, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error("Error fetching media:", fetchError);
        setError("Error al cargar la biblioteca de medios.");
      } else {
        setMediaItems((data || []).map(item => ({
          id: item.id,
          url: item.url,
          name: item.name,
          type: item.type,
          size: item.size,
          uploadedBy: item.uploaded_by,
          createdAt: item.created_at
        })));
      }
    };

    fetchMedia();

    // Setup realtime subscription for media updates
    const channel = supabase
      .channel('media_library')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'media' }, () => {
        fetchMedia();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

  const handleDeleteClick = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || user.id !== item.uploadedBy) {
      setError("No tienes permiso para eliminar este archivo.");
      return;
    }
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // Extract file path from URL or use a structured path
      // In Supabase, we typically store the path. If we only have URL, we might need more logic
      // But based on our uploader (next to be refactored), we should know the structure.
      // Expected path: `media/${user.id}/${fileName}`
      const fileName = itemToDelete.url.split('/').pop();
      const filePath = `${itemToDelete.uploadedBy}/${fileName}`;
      
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', itemToDelete.id);

      if (dbError) throw dbError;

      setItemToDelete(null);
    } catch (err) {
      console.error("Error deleting media:", err);
      setError("Error al eliminar el archivo.");
      setItemToDelete(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const content = (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-50 rounded-xl overflow-hidden border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-orange-500" />
          Biblioteca de Medios
        </h2>
        {isModal && onClose && (
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors" aria-label="Cerrar biblioteca de medios" title="Cerrar">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowUploader(!showUploader)}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            {showUploader ? 'Ocultar Subida' : '+ Nuevo Archivo'}
          </button>
          
          {!user && (
            <div className="text-sm text-yellow-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Inicia sesión para subir archivos
            </div>
          )}
        </div>

        {showUploader && user && (
          <MediaUploader onUploadComplete={() => setShowUploader(false)} />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 m-4 bg-red-950/50 border border-red-900 text-red-400 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto" aria-label="Cerrar mensaje de error" title="Cerrar"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Eliminar archivo</h3>
            <p className="text-zinc-400 text-sm mb-6">
              ¿Estás seguro de que deseas eliminar "{itemToDelete.name}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {mediaItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
            <ImageIcon className="w-16 h-16 opacity-20" />
            <p>No hay archivos en la biblioteca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaItems.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "group relative aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 transition-all cursor-pointer",
                  onSelect ? "hover:ring-2 hover:ring-orange-500" : ""
                )}
                onClick={() => onSelect && onSelect(item.url)}
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <Film className="w-8 h-8 text-zinc-500" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    {user?.id === item.uploadedBy && (
                      <button 
                        onClick={(e) => handleDeleteClick(item, e)}
                        className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-zinc-300 truncate">
                    <p className="font-medium text-white truncate">{item.name}</p>
                    <p>{formatSize(item.size)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-5xl h-[80vh] shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
