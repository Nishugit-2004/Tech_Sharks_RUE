import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Clock3, Sparkles } from 'lucide-react';
import NodeViewer from './NodeViewer';

export default function ChatSession({ session, index, API_URL, simplifiedMode, magicSelectMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const createdAt = session.createdAt ? new Date(session.createdAt) : null;
  const timestamp = createdAt ? createdAt.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown time';
  const summary = session.rootNode?.content ? session.rootNode.content.replace(/\n+/g, ' ') : 'No response available yet.';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/10"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.32em] text-gray-400">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>Session {index + 1}</span>
          </div>
          <p className="mt-2 text-sm text-gray-200 font-medium">{session.query}</p>
          <p className="mt-2 text-xs text-gray-500">{timestamp}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-200">
          <Sparkles className="w-3 h-3" />
          View chat
        </span>
      </button>

      <motion.div
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 transition-all duration-300 ${isOpen ? 'max-h-[1600px] py-4' : 'max-h-0 py-0'}`}
      >
        <div className="mb-4 text-sm text-gray-300 px-4 pt-4">
          <p className="font-semibold text-white">Original response</p>
          <p className="mt-2 text-sm leading-6 text-gray-300">{summary}</p>
        </div>
        <div className="space-y-4 px-4 pb-4">
          <NodeViewer
            node={session.rootNode}
            session_id={session.session_id}
            API_URL={API_URL}
            simplifiedMode={simplifiedMode}
            magicSelectMode={magicSelectMode}
            depth={0}
            onExit={null}
            showExit={false}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
