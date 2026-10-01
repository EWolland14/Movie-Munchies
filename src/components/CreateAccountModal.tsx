import React, { useState } from 'react';
import { User, Sparkles, X, UserPlus, Database } from 'lucide-react';
import { DB_NAME } from '../services/db';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (username: string, emoji: string) => Promise<void>;
}

const AVATAR_OPTIONS = ['🍿', '🍕', '🎬', '🍔', '🌮', '🍣', '👑', '🎲', '🍺', '🍨', '🍩', '🍹'];

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onCreateUser,
}) => {
  const [username, setUsername] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍿');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a username');
      return;
    }
    if (trimmed.length < 2) {
      setErrorMsg('Username must be at least 2 characters');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onCreateUser(trimmed, selectedEmoji);
      setUsername('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md liquid-glass-strong rounded-3xl p-6 sm:p-7 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-10 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            {selectedEmoji}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                {DB_NAME}
              </span>
            </div>
            <h3 className="font-display font-black text-xl text-white">
              Create Account
            </h3>
          </div>
        </div>

        <p className="text-xs text-stone-300 mb-5 leading-relaxed">
          Create an account to save your movie and munchies nights to{' '}
          <strong className="text-amber-300 font-mono">{DB_NAME}</strong> and sync with everyone watching together.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Your Name / Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Emmett, Sarah, Alex..."
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none transition-colors"
                autoFocus
                maxLength={30}
              />
              <User className="absolute right-3.5 top-3.5 w-4 h-4 text-stone-500 pointer-events-none" />
            </div>
          </div>

          {/* Emoji Avatar Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-2 uppercase font-mono tracking-wider">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-amber-400/25 border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-stone-950 font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Account...' : 'Join & Save to Database'}</span>
              <Sparkles className="w-4 h-4 text-amber-900" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
