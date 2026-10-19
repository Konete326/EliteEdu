import { BookOpen, FileText, Video, Radio, Award } from 'lucide-react';

const LmsKpiStrip = ({ kpis = {} }) => {
  const cards = [
    { label: 'Syllabus Topics', value: kpis.totalCourses || 0, icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Active Homework', value: kpis.activeHomework || 0, icon: FileText, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Lectures & Material', value: kpis.studyMaterials || 0, icon: Video, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Live Classes', value: kpis.liveClasses || 0, icon: Radio, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
    { label: 'Syllabus Progress', value: `${kpis.syllabusCompletionPct || 0}%`, icon: Award, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{c.label}</p>
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">{c.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LmsKpiStrip;
