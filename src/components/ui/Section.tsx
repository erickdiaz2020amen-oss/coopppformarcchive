import React from 'react';
import { cn } from '../../lib/utils';

export const Section = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("mb-8 animate-fade-in-up", className)}>
      <div className="bg-brand-600 text-white px-4 py-2 rounded-md font-semibold text-sm tracking-wide mb-4 shadow-sm flex items-center">
        {title.toUpperCase()}
      </div>
      <div className="bg-white rounded-lg p-5 shadow-sm border border-brand-100">
        {children}
      </div>
    </div>
  );
};
