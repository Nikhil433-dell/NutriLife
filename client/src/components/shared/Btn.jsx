import React from 'react';

/**
 * Btn – flexible button component supporting multiple variants and sizes.
 *
 * @param {object}    props
 * @param {React.ReactNode} props.children
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'}                          [props.size='md']
 * @param {boolean}   [props.fullWidth=false]
 * @param {boolean}   [props.disabled=false]
 * @param {string}    [props.className]
 * @param {Function}  [props.onClick]
 * @param {'button'|'submit'|'reset'} [props.type='button']
 */
function Btn({
  children,
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  disabled  = false,
  className = '',
  onClick,
  type      = 'button',
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    fullWidth ? 'btn-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Btn;
