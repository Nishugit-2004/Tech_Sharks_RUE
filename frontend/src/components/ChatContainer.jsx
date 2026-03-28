import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import ChatHistory from './ChatHistory';
import NodeViewer from './NodeViewer';

export default function ChatContainer({
  sessionHistory = [],
  activeSession,
  API_URL,
  simplifiedMode,
  magicSelectMode,
  onExitRecursion,
  onClearHistory,
  activeChatRef,
}) {
  return (
    <div className="space-y-10 w-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-400 font-semibold">Previous chats</p>
            <p className="text-xs text-gray-500 mt-1">Collapsed sessions are stored above your active chat.</p>
          </div>
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-200 transition hover:bg-white/10"
          >
            <X className="w-4 h-4" />
            Clear All History
          </button>
        </div>
        <ChatHistory
          sessions={sessionHistory}
          API_URL={API_URL}
          simplifiedMode={simplifiedMode}
          magicSelectMode={magicSelectMode}
        />
      </div>

      <motion.div
        ref={activeChatRef}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.25)]"
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary-300 font-semibold">Current active chat</p>
            <p className="text-xs text-gray-500 mt-1">This session remains active until you click Exit Recursion.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-gray-300">
            <Sparkles className="w-3 h-3 text-primary-300" />
            {activeSession ? 'Live session' : 'Ready for new topic'}
          </div>
        </div>

        {activeSession ? (
          <NodeViewer
            node={activeSession.rootNode}
            session_id={activeSession.session_id}
            API_URL={API_URL}
            simplifiedMode={simplifiedMode}
            magicSelectMode={magicSelectMode}
            depth={0}
            onExit={onExitRecursion}
            showExit={true}
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-gray-400">
            <p className="font-semibold text-white">Start a new topic to begin your next session.</p>
            <p className="mt-2">Previous chats will remain above and you can continue building new understanding below.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
