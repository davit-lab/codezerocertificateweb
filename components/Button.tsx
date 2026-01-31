
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  disabled = false
}) => {
  const baseStyles = "px-10 py-4 transition-all duration-500 active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em]";
  
  const variants = {
    primary: "bg-[#1a1523] text-white hover:bg-zinc-800 border border-transparent shadow-lg shadow-black/10",
    secondary: "bg-[#c5a059] text-white hover:bg-[#b08d4a] border border-transparent shadow-xl shadow-[#c5a059]/20",
    outline: "border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059] hover:text-white",
    ghost: "text-[#c5a059] hover:bg-zinc-50"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;