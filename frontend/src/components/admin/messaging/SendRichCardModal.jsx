import React, { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { CARD_TEMPLATES } from './richCardTemplates';

const SendRichCardModal = ({ isOpen, onClose, onSendCard }) => {
  const [selectedType, setSelectedType] = useState('Leave_Approval');
  const [customTitle, setCustomTitle] = useState('');
  const [customSub, setCustomSub] = useState('');

  if (!isOpen) return null;
  const tpl = CARD_TEMPLATES.find((t) => t.id === selectedType) || CARD_TEMPLATES[0];

  const handleSend = () => {
    const cardPayload = {
      card_type: tpl.id,
      ref_model: 'None',
      head: {
        title: customTitle.trim() || tpl.head.title,
        sub_title: customSub.trim() || tpl.head.sub_title,
        status_badge: tpl.head.status_badge,
        accent_color: tpl.head.accent_color
      },
      fields: tpl.defaultFields,
      actions: tpl.actions
    };
    onSendCard({
      message_text: `[Interactive Card] ${cardPayload.head.title}`,
      card_payload: cardPayload
    });
    setCustomTitle('');
    setCustomSub('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Send Interactive Action Card</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Select Card Template</label>
          <div className="grid grid-cols-2 gap-2">
            {CARD_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setSelectedType(t.id); setCustomTitle(''); setCustomSub(''); }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedType === t.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full mb-1.5" style={{ backgroundColor: t.color }} />
                <span className="text-xs block">{t.label}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Custom Header Title (Optional)</label>
            <input
              type="text"
              placeholder={tpl.head.title}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Subtitle / Note (Optional)</label>
            <input
              type="text"
              placeholder={tpl.head.sub_title}
              value={customSub}
              onChange={(e) => setCustomSub(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-xs outline-none"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200">
            Cancel
          </button>
          <button type="button" onClick={handleSend} className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#1e1b4b] hover:bg-indigo-950 text-white flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Send Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendRichCardModal;
