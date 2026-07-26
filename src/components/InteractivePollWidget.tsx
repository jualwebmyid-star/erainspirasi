import React, { useState, useEffect } from 'react';
import { BarChart2, CheckCircle2, Vote, Sparkles } from 'lucide-react';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export const InteractivePollWidget: React.FC = () => {
  const [poll, setPoll] = useState<PollData>({
    id: 'poll-2026-01',
    question: 'Apakah Anda setuju dengan akselerasi otomatisasi AI dalam sektor layanan publik di Indonesia?',
    options: [
      { id: 'opt-1', text: 'Sangat Setuju (Meningkatkan Efisiensi)', votes: 142 },
      { id: 'opt-2', text: 'Setuju dengan Pengawasan Ketat', votes: 215 },
      { id: 'opt-3', text: 'Tidak Setuju (Potensi Pengurangan Tenaga Kerja)', votes: 68 },
      { id: 'opt-4', text: 'Ragu-ragu / Belum Paham', votes: 23 },
    ],
    totalVotes: 448,
  });

  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for existing vote
    const savedVote = localStorage.getItem(`erainspirasi_poll_${poll.id}`);
    if (savedVote) {
      setHasVoted(true);
      setSelectedOptionId(savedVote);
    }
  }, [poll.id]);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;

    const updatedOptions = poll.options.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const newTotal = poll.totalVotes + 1;
    const updatedPoll = { ...poll, options: updatedOptions, totalVotes: newTotal };

    setPoll(updatedPoll);
    setHasVoted(true);
    setSelectedOptionId(optionId);
    localStorage.setItem(`erainspirasi_poll_${poll.id}`, optionId);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-indigo-900/50 relative overflow-hidden my-6">
      {/* Decorative Glow */}
      <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="px-2.5 py-1 rounded-lg bg-rose-600/90 text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3 animate-spin" />
          POLLING PEMBACA
        </span>
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <Vote className="w-3.5 h-3.5 text-rose-400" />
          {poll.totalVotes.toLocaleString('id-ID')} Suara
        </span>
      </div>

      {/* Question */}
      <h3 className="font-extrabold text-sm sm:text-base text-slate-100 leading-snug mb-4">
        {poll.question}
      </h3>

      {/* Options list */}
      <div className="space-y-2.5">
        {poll.options.map((option) => {
          const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
          const isUserChoice = selectedOptionId === option.id;

          return (
            <div key={option.id} className="relative">
              <button
                onClick={() => handleVote(option.id)}
                disabled={hasVoted}
                className={`w-full text-left p-3 rounded-2xl border text-xs transition relative overflow-hidden flex items-center justify-between gap-3 ${
                  hasVoted
                    ? isUserChoice
                      ? 'border-rose-500/80 bg-rose-950/40 text-white font-bold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300'
                    : 'border-slate-800 bg-slate-900/80 hover:border-rose-500/60 hover:bg-slate-800/90 text-slate-200'
                }`}
              >
                {/* Progress bar fill for voted state */}
                {hasVoted && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ease-out opacity-25 rounded-2xl ${
                      isUserChoice ? 'bg-rose-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2 pr-2">
                  {hasVoted && isUserChoice && (
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className="line-clamp-2">{option.text}</span>
                </div>

                {hasVoted ? (
                  <span className="relative z-10 font-black text-xs shrink-0 text-slate-100">
                    {percentage}%
                  </span>
                ) : (
                  <span className="relative z-10 px-2 py-1 bg-rose-600/20 text-rose-300 group-hover:bg-rose-600 group-hover:text-white rounded-lg text-[10px] font-extrabold shrink-0">
                    Pilih
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Terima kasih! Suara Anda telah tercatat.</span>
        </div>
      )}
    </div>
  );
};
