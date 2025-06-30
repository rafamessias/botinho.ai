'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment, User } from '@/components/types/strapi';
import { createComment, updateComment, deleteComment, getComments } from '@/components/actions/comment-action';
import { useLoading } from '@/components/LoadingProvider';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, Trash2, Send, X, Check } from 'lucide-react';
import { useUser } from '@/components/UserProvider';

interface CommentsSectionProps {
    rdoId?: number;
    incidentId?: number;
    initialComments?: Comment[];
    className?: string;
}

export function CommentsSection({ rdoId, incidentId, initialComments = [], className = '' }: CommentsSectionProps) {
    const t = useTranslations('shared.comments');
    const { user } = useUser();
    const { setIsLoading } = useLoading();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch comments on mount if no initial comments provided
    useEffect(() => {
        if (initialComments.length === 0) {
            fetchComments();
        }
    }, [rdoId, incidentId]);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const response = await getComments(rdoId, incidentId);
            if (response.success) {
                setComments(response.data);
            } else {
                console.error('Failed to fetch comments:', response.error);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        try {
            setIsSubmitting(true);
            const response = await createComment({
                content: newComment.trim(),
                rdoId,
                incidentId
            });

            if (response.success && response.data) {
                setComments(prev => [response.data!, ...prev]);
                setNewComment('');
                toast.success(t('commentAdded'));
            } else {
                toast.error(response.error || t('commentAddError'));
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error(t('commentAddError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditComment = async (commentId: string) => {
        if (!editContent.trim()) return;

        try {
            setIsSubmitting(true);
            const response = await updateComment(commentId, editContent.trim());

            if (response.success && response.data) {
                setComments(prev => prev.map(comment =>
                    comment.documentId === commentId ? response.data! : comment
                ));
                setEditingComment(null);
                setEditContent('');
                toast.success(t('commentUpdated'));
            } else {
                toast.error(response.error || t('commentUpdateError'));
            }
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error(t('commentUpdateError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm(t('deleteConfirm'))) return;

        try {
            setIsSubmitting(true);
            const response = await deleteComment(commentId);

            if (response.success) {
                setComments(prev => prev.filter(comment => comment.documentId !== commentId));
                toast.success(t('commentDeleted'));
            } else {
                toast.error(response.error || t('commentDeleteError'));
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error(t('commentDeleteError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditing = (comment: Comment) => {
        setEditingComment(comment.documentId || '');
        setEditContent(comment.content);
    };

    const cancelEditing = () => {
        setEditingComment(null);
        setEditContent('');
    };

    const canEditComment = (comment: Comment) => {
        if (!user) return false;
        const commentUser = typeof comment.user === 'object' ? comment.user : null;
        return commentUser?.id === user.id;
    };

    const getUserDisplayName = (comment: Comment) => {
        const commentUser = typeof comment.user === 'object' ? comment.user : null;
        if (!commentUser) return 'Unknown User';

        if (commentUser.firstName && commentUser.lastName) {
            return `${commentUser.firstName} ${commentUser.lastName}`;
        }

        return commentUser.username || 'Unknown User';
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Add Comment Form */}
            <div className="relative space-y-3">
                <div className="font-semibold text-sm">{t('addComment')}</div>
                <div className="flex gap-2">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('commentPlaceholder')}
                        className="flex-1 min-h-[80px] resize-none"
                        disabled={isSubmitting}
                    />
                    <Button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || isSubmitting}
                        size="sm"
                        className="absolute right-1 bottom-1"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                <div className="font-semibold text-sm">{t('comments')} ({comments.length})</div>

                {comments.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        {t('noComments')}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <div key={comment.documentId} className="bg-gray-50 p-3 rounded-lg">
                                {editingComment === comment.documentId ? (
                                    // Edit Mode
                                    <div className="space-y-2">
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="min-h-[80px] resize-none"
                                            disabled={isSubmitting}
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={cancelEditing}
                                                disabled={isSubmitting}
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                {t('cancel')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleEditComment(comment.documentId!)}
                                                disabled={!editContent.trim() || isSubmitting}
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                {t('save')}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">
                                                    {getUserDisplayName(comment)}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {format(new Date(comment.createdAt || ''), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                                </span>
                                            </div>
                                            {canEditComment(comment) && (
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => startEditing(comment)}
                                                        disabled={isSubmitting}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteComment(comment.documentId!)}
                                                        disabled={isSubmitting}
                                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 