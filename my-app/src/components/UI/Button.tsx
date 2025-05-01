// src/components/UI/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function Button({ variant = 'primary', className, children, ...props }: Props) {
  const base = 'px-4 py-2 rounded font-semibold transition-colors duration-300';
  const styles = {
    primary: 'bg-[#FCA311] text-white hover:bg-[#e4920b]',
    secondary: 'bg-white border border-black text-black hover:bg-gray-100',
  };

  return (
    <button className={clsx(base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
