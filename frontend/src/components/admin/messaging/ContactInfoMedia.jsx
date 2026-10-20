import React from 'react';
import { Image, FileText, ChevronRight, ExternalLink } from 'lucide-react';

const ContactInfoMedia = ({ messages = [] }) => {
  const mediaList = messages.filter((m) => Boolean(m.attachment_url));

  return (
    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Shared Media
        </h4>
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          {mediaList.length} <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </span>
      </div>

      {mediaList.length === 0 ? (
        <div className="py-6 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-slate-400 flex items-center justify-center mb-2">
            <Image className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            No photos or videos yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {mediaList.slice(0, 6).map((m, idx) => {
            const isImg = Boolean(
              m.attachment_url && (
                m.attachment_url.includes('cloudinary') ||
                m.attachment_url.startsWith('data:image') ||
                m.attachment_url.match(/\.(jpeg|jpg|gif|png|webp)/i)
              )
            );
            return (
              <a
                key={m._id || idx}
                href={m.attachment_url}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 block"
              >
                {isImg ? (
                  <img src={m.attachment_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-400">
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-[9px] truncate max-w-full text-center">{m.attachment_name || 'File'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactInfoMedia;
