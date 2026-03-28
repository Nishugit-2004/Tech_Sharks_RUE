import React from 'react';
import ChatSession from './ChatSession';

export default function ChatHistory({ sessions = [], API_URL, simplifiedMode, magicSelectMode }) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-gray-400">
        No previous chat sessions yet. Your recent chats will appear here after you exit recursion.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <ChatSession
          key={session.session_id || `${session.query}-${index}`}
          session={session}
          index={index}
          API_URL={API_URL}
          simplifiedMode={simplifiedMode}
          magicSelectMode={magicSelectMode}
        />
      ))}
    </div>
  );
}
