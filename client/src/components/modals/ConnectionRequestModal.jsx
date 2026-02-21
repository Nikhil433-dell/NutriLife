import React, { useState } from 'react';
import { Avatar, Btn } from '../shared';

/**
 * ConnectionRequestModal – send a connection request with a message.
 *
 * @param {object}   props
 * @param {boolean} props.isOpen
 * @param {object}  props.targetUser - { id, name, email }
 * @param {string}  props.currentUserId
 * @param {Function} props.onClose
 * @param {Function} props.onSend - (message) => Promise
 */
function ConnectionRequestModal({ isOpen, targetUser, currentUserId, onClose, onSend }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await onSend(message.trim());
      setMessage('');
      onClose();
    } catch (err) {
      setError(err?.message || 'Could not send request');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setMessage('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal"
        style={{ width: '100%', maxWidth: 420, padding: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={handleClose} aria-label="Close" disabled={sending}>
          ✕
        </button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🤝</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
            Connect with {targetUser?.name}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
            Send a short message so they know why you’d like to connect.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: 12, background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
          <Avatar name={targetUser?.name} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text)' }}>{targetUser?.name}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{targetUser?.email}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="label" style={{ marginBottom: 6 }}>Your message</label>
          <textarea
            className="input"
            placeholder="e.g. Hi! I’d love to connect and support each other on NutriLife…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={{ resize: 'vertical', marginBottom: 16 }}
            maxLength={500}
            disabled={sending}
          />
          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            <Btn type="button" variant="ghost" onClick={handleClose} disabled={sending} style={{ flex: 1 }}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={sending || !message.trim()} style={{ flex: 1 }}>
              {sending ? 'Sending…' : 'Send request'}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConnectionRequestModal;
