import React from 'react';

/**
 * Avatar – displays a user's profile image or their initials as a fallback.
 *
 * @param {object}  props
 * @param {string}  [props.src]      - image URL
 * @param {string}  [props.name]     - full name used to derive initials
 * @param {number}  [props.size=40]  - diameter in px
 * @param {string}  [props.className]
 */
function Avatar({ src, name = '', size = 40, className = '' }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');

  const style = { width: size, height: size, fontSize: size * 0.38 };

  return (
    <div className={`avatar ${className}`} style={style} title={name}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
}

export default Avatar;
