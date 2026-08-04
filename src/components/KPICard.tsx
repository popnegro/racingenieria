import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface KPICardProps {
  id: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export default function KPICard({
  id,
  title,
  value,
  icon: Icon,
  description,
  change,
  changeType = 'neutral'
}: KPICardProps) {
  const changeColors = {
    positive: 'text-emerald-600 bg-emerald-50 border border-emerald-100',
    negative: 'text-rose-600 bg-rose-50 border border-rose-100',
    neutral: 'text-zinc-600 bg-zinc-50 border border-zinc-100'
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">{title}</span>
          <h3 className="text-3xl font-bold text-zinc-900 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500">
          <Icon className="w-5 h-5 stroke-[1.8]" />
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
        <span className="text-xs text-zinc-500 font-medium">{description}</span>
        {change && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
}
