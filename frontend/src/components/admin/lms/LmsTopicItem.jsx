import { CheckCircle2 } from 'lucide-react';

const LmsTopicItem = ({ topic, onToggleStatus }) => (
  <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <button
        onClick={() => onToggleStatus(topic)}
        className={`p-1.5 rounded-lg ${topic.status === 'Completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}
      >
        <CheckCircle2 className="w-4 h-4" />
      </button>
      <div>
        <h5 className={`text-sm font-semibold ${topic.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
          {topic.title}
        </h5>
        <p className="text-xs text-gray-400">{topic.chapter_id?.title ? `Chapter: ${topic.chapter_id.title}` : 'General Topic'}</p>
      </div>
    </div>
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${topic.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20'}`}>
      {topic.status}
    </span>
  </div>
);

export default LmsTopicItem;
