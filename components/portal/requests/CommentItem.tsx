'use client';

import { useState } from 'react';
import { Comment } from '@/lib/types/portal';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { User, Smile, Reply } from 'lucide-react';
import { addReaction, removeReaction } from '@/lib/services/portal-comments';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  onReply: (comment: Comment) => void;
  isReply?: boolean;
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '👏'];

export const CommentItem = ({ comment, currentUserId, onReply, isReply = false }: CommentItemProps) => {
  const [showReactions, setShowReactions] = useState(false);

  // Optimistic reactions state
  const [reactions, setReactions] = useState(comment.reactions || {});

  const handleReaction = async (emoji: string) => {
    const currentReactions = reactions[emoji] || [];
    const hasReacted = currentReactions.includes(currentUserId);

    // Optimistic update
    const previousReactions = { ...reactions };
    setReactions(prev => {
      const newReactions = { ...prev };
      if (hasReacted) {
        newReactions[emoji] = currentReactions.filter(id => id !== currentUserId);
        if (newReactions[emoji].length === 0) delete newReactions[emoji];
      } else {
        newReactions[emoji] = [...currentReactions, currentUserId];
      }
      return newReactions;
    });

    try {
      if (hasReacted) {
        await removeReaction(comment.id, currentUserId, emoji);
      } else {
        await addReaction(comment.id, currentUserId, emoji);
      }
    } catch (error) {
      console.error('Failed to update reaction:', error);
      // Rollback
      setReactions(previousReactions);
    }

    setShowReactions(false);
  };

  const isAuthor = comment.userId === currentUserId;

  return (
    <div
      className={cn(
        "group relative flex gap-3 transition-all",
        isReply ? "mt-3 ml-12" : "mt-6",
        isAuthor ? "flex-row-reverse" : "flex-row" // Keep threading consistent, but author styling different?
        // Actually for threading, usually all aligned left. Let's stick to left alignment for business chat but style current user differently.
      )}
      onMouseEnter={() => {}}
      onMouseLeave={() => {
        setShowReactions(false);
      }}
    >
      {/* Avatar */}
      <div className={cn("flex-shrink-0", isAuthor && "order-last")}>
        <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center overflow-hidden">
          {comment.userPhotoUrl ? (
            <img src={comment.userPhotoUrl} alt={comment.userName} className="w-full h-full object-cover" />
          ) : (
            <User size={14} className="text-surface-500" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className={cn("flex flex-col max-w-[85%]", isAuthor && "items-end")}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
            {comment.userName}
          </span>
          <span className="text-[9px] font-bold text-surface-300 dark:text-surface-600 uppercase tracking-tighter">
            {comment.createdAt?.toDate ? format(comment.createdAt.toDate(), 'h:mm a') : 'Now'}
          </span>
        </div>

        <div className="relative group/bubble">
           <div
            className={cn(
              'p-3.5 rounded-2xl text-sm shadow-sm font-medium leading-relaxed relative z-10',
              isAuthor
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 border border-surface-100 dark:border-surface-700 rounded-tl-none'
            )}
            dangerouslySetInnerHTML={{
              __html: comment.content
                .replace(/\n/g, '<br />')
                .replace(/(^|\s)@(\w+(\s\w+)?)/g, '$1<span class="font-bold text-blue-500">@$2</span>')
            }}
          />

          {/* Action strip (Reactions, Reply) */}
          <div className={cn(
            "absolute top-full mt-1 flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity",
            isAuthor ? "right-0" : "left-0"
          )}>
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <Smile size={14} />
            </button>
            <button
              onClick={() => onReply(comment)}
              className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <Reply size={14} />
            </button>

            {/* Emoji Picker Popup */}
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute bottom-full mb-2 bg-white dark:bg-surface-800 rounded-full shadow-lg border border-surface-100 dark:border-surface-700 p-1 flex items-center gap-0.5 z-20"
                >
                  {EMOJI_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-50 dark:hover:bg-surface-700 text-lg transition-transform hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Existing Reactions display */}
          {Object.keys(reactions).length > 0 && (
            <div className={cn(
              "absolute -bottom-3 flex items-center gap-1",
               isAuthor ? "right-1" : "left-1"
            )}>
              {Object.entries(reactions).map(([emoji, users]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={cn(
                    "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] shadow-sm border transition-colors",
                    users.includes(currentUserId)
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                      : "bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-500"
                  )}
                >
                  <span>{emoji}</span>
                  <span className="font-bold">{users.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
