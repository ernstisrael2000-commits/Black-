import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'gold' | 'red' | 'blue' | 'green' | 'gray' | 'affiliate';
  size?: 'sm' | 'md';
}

const variants = {
  gold: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  red: 'bg-red-500/20 text-red-400 border border-red-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  green: 'bg-green-500/20 text-green-400 border border-green-500/30',
  gray: 'bg-white/10 text-gray-300 border border-white/10',
  affiliate: 'bg-blue-900/40 text-blue-300 border border-blue-700/40',
};

const sizes = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
};

export default function Badge({ children, variant = 'gray', size = 'md' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
