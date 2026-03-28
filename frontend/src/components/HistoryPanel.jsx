import React, { useState } from 'react';
import { Clock3, X, Trash2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPanel({ history = [], onSelect = () => {} }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ─────────────── Desktop: Fixed sidebar (top-left) ─────────────── */}
      <aside
        className="hidden sm:flex fixed top-4 left-4 z-50 h-[calc(100vh-2rem)] w-64 flex-col"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Glass panel */}
        <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-slate-950/75 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-primary-400" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-200">History</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-gray-500 font-semibold">
              {history.length}/10
            </span>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10 gap-3 text-center px-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-dashed border-white/15">
                  <Clock3 className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  No history yet.<br />
                  <span className="text-gray-600">Start by searching a topic.</span>
                </p>
              </div>
            ) : (
              history.map((item, index) => (
                <motion.button
                  key={`${item}-${index}`}
                  type="button"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => onSelect(item)}
                  className="w-full text-left group flex items-start space-x-2.5 px-3 py-2.5 rounded-xl border border-transparent text-sm text-gray-400 transition-all duration-200 hover:bg-primary-500/10 hover:border-primary-500/20 hover:text-white"
                >
                  <span className="mt-0.5 text-[10px] text-gray-600 font-bold min-w-[1.2rem] group-hover:text-primary-500 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate leading-snug font-medium">{item}</span>
                </motion.button>
              ))
            )}
          </div>

          {/* Footer glow accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
        </div>
      </aside>

      {/* ─────────────── Mobile: Floating button + Drawer ─────────────── */}
      {/* Floating clock icon */}
      <button
        type="button"
        className="sm:hidden fixed top-4 left-4 z-50 rounded-xl bg-slate-950/90 border border-white/15 p-3 text-white shadow-xl shadow-black/40 backdrop-blur-xl"
        onClick={() => setOpen(true)}
        aria-label="Open history panel"
      >
        <Clock3 className="h-5 w-5 text-primary-400" />
      </button>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sm:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-72 bg-slate-950 border-r border-white/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-primary-400" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-200">History</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-white/8 p-1.5 text-gray-400 hover:text-white hover:bg-white/15 transition-all"
                  aria-label="Close history panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile List */}
              <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 gap-3 text-center px-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-dashed border-white/15">
                      <Clock3 className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      No history yet.<br />
                      <span className="text-gray-600">Start by searching a topic.</span>
                    </p>
                  </div>
                ) : (
                  history.map((item, index) => (
                    <motion.button
                      key={`${item}-${index}`}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => {
                        onSelect(item);
                        setOpen(false);
                      }}
                      className="w-full text-left group flex items-start space-x-2.5 px-3 py-2.5 rounded-xl border border-transparent text-sm text-gray-400 transition-all duration-200 hover:bg-primary-500/10 hover:border-primary-500/20 hover:text-white"
                    >
                      <span className="mt-0.5 text-[10px] text-gray-600 font-bold min-w-[1.2rem] group-hover:text-primary-500 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate leading-snug font-medium">{item}</span>
                    </motion.button>
                  ))
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
