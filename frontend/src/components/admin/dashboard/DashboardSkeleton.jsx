import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-surface-secondary/60 dark:bg-white/5 border border-line dark:border-white/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-20 h-4 rounded-md bg-line dark:bg-white/10" />
              <div className="w-8 h-8 rounded-xl bg-line dark:bg-white/10" />
            </div>
            <div className="w-28 h-7 rounded-lg bg-line dark:bg-white/15" />
            <div className="w-36 h-3 rounded-md bg-line/70 dark:bg-white/5" />
          </div>
        ))}
      </div>

      <div className="w-full h-44 rounded-3xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="w-32 h-5 rounded-md bg-line dark:bg-white/10" />
          <div className="w-64 h-3.5 rounded-md bg-line/70 dark:bg-white/5" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-48 h-12 rounded-full bg-surface-secondary dark:bg-white/10 border border-line dark:border-white/10 shrink-0"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          <div className="h-64 rounded-2xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 p-6 space-y-4">
            <div className="w-40 h-5 rounded-md bg-line dark:bg-white/10" />
            <div className="h-40 rounded-xl bg-line/40 dark:bg-white/5" />
          </div>
          <div className="h-72 rounded-2xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 p-6 space-y-4">
            <div className="w-48 h-5 rounded-md bg-line dark:bg-white/10" />
            <div className="h-48 rounded-xl bg-line/40 dark:bg-white/5" />
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="h-56 rounded-2xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 p-5 space-y-3">
            <div className="w-32 h-4 rounded-md bg-line dark:bg-white/10" />
            <div className="space-y-2 pt-2">
              <div className="h-10 rounded-xl bg-line/40 dark:bg-white/5" />
              <div className="h-10 rounded-xl bg-line/40 dark:bg-white/5" />
            </div>
          </div>
          <div className="h-64 rounded-2xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 p-5 space-y-3">
            <div className="w-36 h-4 rounded-md bg-line dark:bg-white/10" />
            <div className="h-44 rounded-xl bg-line/40 dark:bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
