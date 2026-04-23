import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Comment } from '../types';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { Send, User as UserIcon } from 'lucide-react';

interface CommentsProps {
  articleId: string;
}

export function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!articleId) return;

    // Fetch initial comments
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments((data || []).map(c => ({
          id: c.id,
          articleId: c.article_id,
          authorId: c.author_id,
          authorName: c.author_name,
          authorPhotoUrl: c.author_photo_url,
          content: c.content,
          createdAt: c.created_at
        })));
      }
    };

    fetchComments();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`comments:${articleId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `article_id=eq.${articleId}`
      }, (payload) => {
        const newCom = {
          id: payload.new.id,
          articleId: payload.new.article_id,
          authorId: payload.new.author_id,
          authorName: payload.new.author_name,
          authorPhotoUrl: payload.new.author_photo_url,
          content: payload.new.content,
          createdAt: payload.new.created_at
        } as Comment;
        setComments(current => [newCom, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert([{
          article_id: articleId,
          author_id: user.id,
          author_name: user.user_metadata?.full_name || user.email || 'Usuario Anónimo',
          author_photo_url: user.user_metadata?.avatar_url || null,
          content: newComment.trim()
        }]);

      if (insertError) throw insertError;

      // Increment commentsCount on the article
      // In a production app, this should ideally be handled via a Postgres Trigger 
      // or an RPC to ensure atomicity. For now, we'll do an update.
      const currentCount = comments.length + 1;
      await supabase
        .from('articles')
        .update({ comments_count: currentCount })
        .eq('id', articleId);

      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'Justo ahora';
    const date = new Date(dateValue);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mt-12 pt-12 border-t border-zinc-800">
      <h3 className="text-2xl font-bold text-white mb-8">Comentarios ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt={user.user_metadata?.full_name || 'User'} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-zinc-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none min-h-[100px]"
                disabled={isSubmitting}
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : (
                    <>
                      <span>Enviar</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center mb-10">
          <p className="text-zinc-400 mb-4">Debes iniciar sesión para dejar un comentario.</p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">No hay comentarios todavía. ¡Sé el primero en comentar!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="flex-shrink-0">
                {comment.authorPhotoUrl ? (
                  <img src={comment.authorPhotoUrl} alt={comment.authorName} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-zinc-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{comment.authorName}</span>
                  <span className="text-xs text-zinc-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-zinc-300 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
