import React, { useState, useRef } from 'react';
import { Upload, Loader2, AlertCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { cn } from '../lib/utils';

interface MediaUploaderProps {
  onUploadComplete?: () => void;
  className?: string;
}

export function MediaUploader({ onUploadComplete, className }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const processFile = async (file: File) => {
    if (!user) {
      setError("Debes iniciar sesión para subir archivos.");
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setError("Solo se permiten imágenes y videos.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo es demasiado grande. Máximo 10MB.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('media')
        .insert([{
          url: publicUrl,
          name: file.name,
          type: isImage ? 'image' : 'video',
          size: file.size,
          uploaded_by: user.id
        }]);

      if (dbError) throw dbError;

      if (onUploadComplete) onUploadComplete();
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(`Error al subir el archivo: ${err.message || 'Verifica tu conexión y permisos storage'}`);
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className={cn("w-full", className)}>
      {error && (
        <div className="mb-4 p-3 bg-red-950/50 border border-red-900 text-red-400 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto" aria-label="Cerrar mensaje de error" title="Cerrar"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200",
          isDragging ? "border-orange-500 bg-orange-500/10 scale-[1.02]" : "border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-500",
          isUploading ? "cursor-not-allowed opacity-80" : "cursor-pointer"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
          accept="image/*,video/*"
          disabled={isUploading}
          aria-label="Seleccionar archivo multimedia"
          title="Seleccionar archivo multimedia"
        />

        {isUploading ? (
          <div className="flex flex-col items-center w-full max-w-xs">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-sm text-zinc-400 font-medium">Subiendo archivo...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400 group-hover:text-orange-500 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Subir archivo multimedia</h3>
            <p className="text-sm text-zinc-400 mb-4">Arrastra y suelta una imagen o video aquí, o haz clic para seleccionar</p>
            <div className="text-xs text-zinc-500 flex gap-4">
              <span>PNG, JPG, GIF, MP4</span>
              <span>Máx 10MB</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
