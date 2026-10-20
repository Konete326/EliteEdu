import React from 'react';
import { Image, FileText, ChevronRight, ExternalLink } from 'lucide-react';

const ContactInfoMedia = ({ messages = [] }) => {
  const mediaList = messages.filter((m) => Boolean(m.attachment_url));

  return (
    <div className="p-4 border-b border-line dark:border-line-dark">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
          Shared Media
        </h4>
        <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
          {mediaList.length} <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
        </span>
      </div>

      {mediaList.length === 0 ? (
        <div className="py-6 px-4 rounded-2xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink-muted flex items-center justify-center mb-2">
            <Image className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-ink-muted">
            No photos or videos yet
          </p>
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {mediaList.map((m, idx) => {
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
                className="group relative w-20 h-20 shrink-0 aspect-square rounded-xl overflow-hidden bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark block"
              >
                {isImg ? (
                  <img src={m.attachment_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-ink-muted">
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
