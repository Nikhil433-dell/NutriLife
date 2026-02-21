import React, { useState, useEffect } from 'react';
import { Avatar, Btn, Tag } from './shared';
import { COMMUNITY_MESSAGES } from '../data/communityMessages';
import { communityApi } from '../utils/api';

const CATEGORY_COLOURS = {
  announcement: { bg: '#ebf8ff', color: '#2b6cb0' },
  request:      { bg: '#fff5f5', color: '#c53030' },
  volunteer:    { bg: '#f0fff4', color: '#276749' },
  availability: { bg: '#fffaf0', color: '#975a16' },
  system:       { bg: '#f7fafc', color: '#4a5568' },
};

/**
 * CommunityFeed – scrollable list of community messages with a compose area.
 *
 * @param {object}      props
 * @param {object|null} props.user       - logged-in user
 * @param {Function}    props.onAuthOpen - opens AuthModal when user is not logged in
 */
function CommunityFeed({ user, onAuthOpen }) {
  const [messages, setMessages] = useState(COMMUNITY_MESSAGES);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    communityApi.getMessages().then(setMessages).catch(() => {});
  }, []);

  const handlePost = async () => {
    if (!user) { onAuthOpen?.(); return; }
    if (!draft.trim()) return;

    try {
      const newMsg = await communityApi.postMessage({
        userId: user.id,
        userName: user.name,
        avatar: user.avatar,
        message: draft.trim(),
        category: 'announcement',
      });
      setMessages((prev) => [newMsg, ...prev]);
      setDraft('');
    } catch (err) {
      console.error('Post failed', err);
    }
  };

  const handleLike = async (id) => {
    try {
      await communityApi.likeMessage(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m)));
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const formatTime = (iso) => {
    const date  = new Date(iso);
    const now   = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1)   return 'just now';
    if (diffMins < 60)  return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: 'var(--color-text)' }}>
        💬 Community Feed
      </h2>

      {/* Compose */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Avatar name={user?.name || 'Guest'} size={38} />
          <div style={{ flex: 1 }}>
            <textarea
              className="input"
              rows={3}
              placeholder={user ? 'Share an update with the community…' : 'Sign in to post…'}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{ resize: 'vertical' }}
              disabled={!user}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <Btn size="sm" onClick={handlePost} disabled={!user || !draft.trim()}>
                Post
              </Btn>
            </div>
          </div>
        </div>
        {!user && (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 8 }}>
            <button
              onClick={onAuthOpen}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              Sign in
            </button>{' '}
            to participate in the community.
          </p>
        )}
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg) => {
          const catStyle = CATEGORY_COLOURS[msg.category] || CATEGORY_COLOURS.system;
          return (
            <div key={msg.id} className="card">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Avatar name={msg.userName} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>
                      {msg.userName}
                    </span>
                    <Tag
                      style={{
                        background: catStyle.bg,
                        color:      catStyle.color,
                        fontSize:   11,
                      }}
                    >
                      {msg.category}
                    </Tag>
                    <span style={{ fontSize: 12, color: 'var(--color-text-light)', marginLeft: 'auto' }}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.6 }}>{msg.message}</p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                    <button
                      onClick={() => handleLike(msg.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      👍 {msg.likes}
                    </button>
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      💬 {msg.replies}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CommunityFeed;
