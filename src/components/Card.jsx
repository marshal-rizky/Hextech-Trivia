import React from 'react';

const Card = ({ children, className = '', hover = true }) => {
  return (
    <div 
      className={`
        glass-panel rounded-xl border border-[var(--color-glass-border)] 
        bg-opacity-80 p-6 shadow-xl 
        transition-all duration-300 ease-in-out
        ${hover ? 'hover:shadow-[var(--color-hextech-blue-glow)] hover:-translate-y-1 hover:border-[var(--color-hextech-blue)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
