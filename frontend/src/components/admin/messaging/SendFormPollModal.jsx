import React, { useState } from 'react';
import { X, BarChart3, FileText, Send } from 'lucide-react';
import CreatePollTab from './CreatePollTab';
import CreateFormTab from './CreateFormTab';

const SendFormPollModal = ({ isOpen, onClose, onSendFormPoll }) => {
  const [tab, setTab] = useState('poll');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['Yes, definitely', 'Need more time']);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([
    { field_id: 'f_1', label: 'Full Name', field_type: 'text' },
    { field_id: 'f_2', label: 'Preferred Date', field_type: 'date_picker' }
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'poll') {
      if (!question.trim()) return;
      const validOptions = options.map((o) => o.trim()).filter(Boolean);
      if (validOptions.length < 2) return;

      onSendFormPoll({
        message_text: `📊 Poll: ${question.trim()}`,
        card_payload: {
          card_type: 'Interactive_Poll',
          head: { title: question.trim(), sub_title: 'Staff & Faculty Poll', accent_color: 'var(--color-primary, #0d9488)' },
          poll_options: validOptions.map((opt, i) => ({ key: `opt_${i + 1}`, text: opt, vote_count: 0 })),
          total_votes: 0,
          submissions: []
        }
      });
    } else {
      if (!title.trim()) return;
      const validFields = fields.filter((f) => f.label.trim());
      if (validFields.length < 1) return;

      onSendFormPoll({
        message_text: `📝 Form: ${title.trim()}`,
        card_payload: {
          card_type: 'Interactive_Form',
          head: { title: title.trim(), sub_title: 'Interactive Form', accent_color: '#059669' },
          body: { text: description.trim() },
          form_fields: validFields.map((f, i) => ({
            field_id: f.field_id || `f_${i + 1}`,
            label: f.label.trim(),
            field_type: f.field_type,
            options: f.field_type === 'dropdown' ? ['Option 1', 'Option 2', 'Other'] : [],
            required: true
          })),
          submissions: []
        }
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('poll')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                tab === 'poll'
                  ? 'bg-primary/10 text-primary'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Quick Poll
            </button>
            <button
              type="button"
              onClick={() => setTab('form')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                tab === 'form'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Mini Form
            </button>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {tab === 'poll' ? (
            <CreatePollTab question={question} setQuestion={setQuestion} options={options} setOptions={setOptions} />
          ) : (
            <CreateFormTab title={title} setTitle={setTitle} description={description} setDescription={setDescription} fields={fields} setFields={setFields} />
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-3.5 py-2 text-xs font-medium text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-bold bg-primary hover:bg-primary-hover text-white rounded-xl shadow-xs flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Send to Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendFormPollModal;
