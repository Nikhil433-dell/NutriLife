import React from 'react';

/**
 * Tag – small pill label for categorising shelters/resources.
 *
 * @param {object}  props
 * @param {React.ReactNode} props.children
 * @param {string}  [props.icon]       - optional emoji / icon character
 * @param {string}  [props.className]
 */
function Tag({ children, icon, className = '' }) {
  return (
    <span className={`tag ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

export default Tag;
