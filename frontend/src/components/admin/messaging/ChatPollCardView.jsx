import React, { useState } from 'react';
import { Check, Vote } from 'lucide-react';

const ChatPollCardView = ({ message, card, currentUserId, onFormSubmit }) => {
  const [submitting, setSubmitting] = useState(false);
  const myVote = card.submissions?.find((s) => String(s.user_id) === String(currentUserId));
  const hasVoted = Boolean(myVote);
  const totalVotes = card.total_votes || 0;

  const handleVote = async (key) => {
    if (submitting || card.is_closed) return;
    setSubmitting(true);
    try {
      await onFormSubmit(message._id, { option_key: key });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2 mt-2">
      {card.poll_options?.map((opt) => {
        const isMyChoice = myVote?.option_key === opt.key;
        const pct = totalVotes > 0 ? Math.round(((opt.vote_count || 0) / totalVotes) * 100) : 0;

        return (
          <button
            key={opt.key}
            type="button"
            disabled={submitting || card.is_closed}
            onClick={() => handleVote(opt.key)}
            className={`relative w-full text-left p-2.5 rounded-xl border transition-all overflow-hidden ${
              isMyChoice
                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 font-semibold'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
            }`}
          >
            {hasVoted && (
              <div
                className={`absolute inset-y-0 left-0 opacity-20 pointer-events-none transition-all duration-500 ${
                  isMyChoice ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-400 dark:bg-slate-500'
                }`}
                style={{ width: `${pct}%` }}
              />
            )}
            <div className="relative z-10 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {isMyChoice && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                <span className="truncate text-slate-800 dark:text-slate-100">{opt.text}</span>
              </div>
              {hasVoted && (
                <span className="text-[11px] font-bold text-slate-500 shrink-0">
                  {pct}% ({opt.vote_count || 0})
                </span>
              )}
            </div>
          </button>
        );
      })}

      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 px-1">
        <span className="flex items-center gap-1">
          <Vote className="w-3 h-3" />
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
        </span>
        {hasVoted ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Voted</span>
        ) : (
          <span className="italic">Click an option to vote</span>
        )}
      </div>
    </div>
  );
};

export default ChatPollCardView;
