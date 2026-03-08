import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "relative inline-flex items-center justify-center px-6 py-3 font-[Cinzel] font-bold tracking-widest text-sm uppercase transition-all duration-300 overflow-hidden";
  
  const variants = {
    primary: `
      bg-gradient-to-r from-[var(--color-hextech-blue)] to-[var(--color-navy)] 
      text-white border border-[var(--color-hextech-blue)] shadow-lg 
      hover:glow-blue hover:scale-105 active:scale-95
    `,
    secondary: `
      bg-transparent border-2 border-[var(--color-gold)] text-[var(--color-gold)]
      hover:bg-[var(--color-gold)] hover:text-[var(--color-deep-navy)]
      active:scale-95
    `,
    danger: `
      bg-red-900/50 border border-red-500 text-red-100
      hover:bg-red-800 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]
      active:scale-95
    `
  };

  return (
    <button 
      onClick={onClick}
      className={`group ${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Hextech sweep effect for primary button */}
      {variant === 'primary' && (
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:animate-[sweep_0.75s_ease-in-out_forwards]" />
      )}
    </button>
  );
};

export default Button;
