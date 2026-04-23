import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Save, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { supabase } from '../lib/supabaseClient';
import { MediaLibrary } from '../components/MediaLibrary';

export function Editor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Noticias');
  const [imageUrl, setImageUrl] = useState('');
  const [score, setScore] = useState<string>('');
  const [platform, setPlatform] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title || !excerpt || !content || !imageUrl) {
      setError("Por favor, completa todos los campos obligatorios (Título, Resumen, Contenido, Imagen).");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('articles')
        .insert([{
          title,
          excerpt,
          content,
          category,
          image_url: imageUrl,
          author: user.user_metadata?.full_name || user.email || 'Editor Anónimo',
          author_id: user.id,
          comments_count: 0,
          score: score ? parseFloat(score) : null,
          platform: (category === 'Análisis' || category === 'Guías') ? platform : [],
          tags: tags
        }]);

      if (insertError) throw insertError;
      
      navigate('/');
    } catch (err) {
      console.error("Error saving article:", err);
      setError("Error al guardar el artículo.");
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-orange-600 rounded-sm"></span>
          Nuevo Artículo
        </h1>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setTitle("Análisis de Final Fantasy VII Rebirth: Una obra maestra que redefine el clásico");
              setExcerpt("Square Enix logra lo impensable, expandiendo el mundo de Gaia con una secuela que no solo respeta el legado del original, sino que lo eleva a nuevas cotas de excelencia RPG. Un viaje inolvidable.");
              setCategory("Análisis");
              setScore("9.5");
              setPlatform(["PlayStation"]);
              setImageUrl("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop");
              setContent(`El desafío al que se enfrentaba Square Enix con **Final Fantasy VII Rebirth** era monumental. Tras el audaz final de *Remake*, las expectativas estaban por las nubes. ¿Cómo expandir un mundo tan querido sin perder la esencia? La respuesta es un rotundo triunfo: *Rebirth* no solo es una secuela excepcional, sino uno de los mejores RPGs de la última década.

### Un mundo abierto que respira vida

Atrás quedan los pasillos de Midgar. *Rebirth* nos lanza a un mundo abierto masivo, vibrante y lleno de secretos. Desde las praderas de Grasslands hasta la icónica Costa del Sol, cada región está meticulosamente diseñada. La exploración se siente recompensada constantemente, ya sea descubriendo protomaterias, enfrentando cacerías especiales o simplemente disfrutando de los minijuegos (que son abundantes y sorprendentemente adictivos, destacando el increíble juego de cartas *Queen's Blood*).

### Combate evolucionado y sinérgico

El sistema de combate híbrido de *Remake* regresa, pero refinado a la perfección. La gran novedad son las **Habilidades Sincronizadas**. Ahora, los personajes pueden unirse para realizar ataques devastadores o defenderse mutuamente, lo que añade una capa táctica brillante. Jugar con Cloud, Tifa, Barret, Aerith, Red XIII, Yuffie y Cait Sith se siente completamente distinto; cada uno tiene mecánicas únicas que te obligan a cambiar constantemente de líder para aprovechar sus fortalezas.

### Una narrativa que expande el mito

Sin entrar en spoilers, la historia de *Rebirth* maneja un equilibrio delicado. Por un lado, recrea con una fidelidad asombrosa los momentos más icónicos del juego de 1997. Por otro, introduce giros y profundiza en las relaciones de los personajes de una manera que el juego original no podía. Las interacciones entre el grupo son el corazón de esta aventura; acampar con ellos, resolver sus misiones secundarias y ver cómo forjan sus vínculos es genuinamente emotivo.

### Conclusión

*Final Fantasy VII Rebirth* es un logro técnico y narrativo. Es un juego enorme, que fácilmente puede superar las 100 horas si buscas completarlo todo, pero que rara vez se siente de relleno. Square Enix ha capturado la magia de la aventura clásica y la ha empaquetado en una superproducción moderna que dejará a los fans sin aliento y contando los días para la conclusión de esta trilogía.

**Lo mejor:**
* El sistema de combate es el pináculo de la acción RPG moderna.
* La química y el desarrollo de los personajes principales.
* Una cantidad abrumadora de contenido secundario de calidad.
* La banda sonora es, sencillamente, legendaria.

**Lo peor:**
* Algunos problemas menores de rendimiento en el modo rendimiento.
* Ciertas mecánicas de escalada y movimiento por el mundo pueden sentirse un poco toscas.`);
            }}
            className="text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors border border-zinc-700"
          >
            Cargar Ejemplo (FFVII)
          </button>
          <button 
            onClick={() => navigate('/')}
            className="text-zinc-400 hover:text-white transition-colors p-2"
            aria-label="Cerrar editor"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/50 border border-red-900 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Título</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            placeholder="Escribe un título llamativo..."
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Resumen (Excerpt)</label>
          <textarea 
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
            placeholder="Un breve resumen para la tarjeta..."
          />
        </div>

        {/* Category & Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Categoría</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              aria-label="Categoría del artículo"
              title="Categoría"
            >
              <option value="Noticias">Noticias</option>
              <option value="Análisis">Análisis</option>
              <option value="Avances">Avances</option>
              <option value="Guías">Guías</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Puntuación (Opcional, 0-10)</label>
            <input 
              type="number" 
              min="0" max="10" step="0.1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              placeholder="Ej: 8.5"
            />
          </div>
        </div>

        {/* Platform (Only for Análisis and Guías) */}
        {(category === 'Análisis' || category === 'Guías') && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Plataformas</label>
            <div className="flex flex-wrap gap-3">
              {['PlayStation', 'Xbox', 'Switch', 'PC'].map(plat => (
                <label key={plat} className="flex items-center gap-2 text-white bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                  <input 
                    type="checkbox" 
                    className="accent-orange-500"
                    checked={platform.includes(plat)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPlatform([...platform, plat]);
                      } else {
                        setPlatform(platform.filter(p => p !== plat));
                      }
                    }}
                  />
                  {plat}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Etiquetas (Tags)</label>
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const newTag = tagsInput.trim();
                  if (newTag && !tags.includes(newTag) && tags.length < 20) {
                    setTags([...tags, newTag]);
                    setTagsInput('');
                  }
                }
              }}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              placeholder="Añadir etiqueta y presionar Enter..."
            />
            <button
              type="button"
              onClick={() => {
                const newTag = tagsInput.trim();
                if (newTag && !tags.includes(newTag) && tags.length < 20) {
                  setTags([...tags, newTag]);
                  setTagsInput('');
                }
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Añadir
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="text-zinc-500 hover:text-white"
                    aria-label={`Eliminar etiqueta ${tag}`}
                    title={`Eliminar ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Imagen de Portada</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              placeholder="URL de la imagen o selecciona de la biblioteca..."
            />
            <button 
              type="button"
              onClick={() => setShowMediaLibrary(true)}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-zinc-700"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Biblioteca</span>
            </button>
          </div>
          {imageUrl && (
            <div className="mt-4 relative aspect-video w-full max-w-md rounded-lg overflow-hidden border border-zinc-800">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Contenido</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            placeholder="Escribe el contenido del artículo aquí..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-6 border-t border-zinc-800">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold transition-colors"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Guardando...' : 'Publicar Artículo'}
          </button>
        </div>
      </form>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary 
          isModal={true} 
          onClose={() => setShowMediaLibrary(false)}
          onSelect={(url) => {
            setImageUrl(url);
            setShowMediaLibrary(false);
          }}
        />
      )}
    </div>
  );
}
