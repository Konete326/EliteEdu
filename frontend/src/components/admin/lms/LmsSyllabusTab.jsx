import { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';
import LmsTopicItem from './LmsTopicItem';

const LmsSyllabusTab = ({ grades = [], subjects = [] }) => {
  const { showToast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  useEffect(() => {
    if (grades.length && !selectedGrade) setSelectedGrade(grades[0]._id);
    if (subjects.length && !selectedSubject) setSelectedSubject(subjects[0]._id);
  }, [grades, subjects]);

  const loadData = async () => {
    if (!selectedGrade || !selectedSubject) return;
    try {
      const [chapRes, topRes] = await Promise.all([
        api.get(`/question-papers/chapters?grade_id=${selectedGrade}&subject_id=${selectedSubject}`),
        api.get(`/lms?item_type=Course_Topic&grade_id=${selectedGrade}&subject_id=${selectedSubject}`)
      ]);
      setChapters(chapRes.data?.chapters || []);
      setTopics(topRes.data?.items || []);
    } catch {
      showToast('Failed to load syllabus items', 'error');
    }
  };

  useEffect(() => { loadData(); }, [selectedGrade, selectedSubject]);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.post('/lms', {
        item_type: 'Course_Topic',
        title: newTitle.trim(),
        grade_id: selectedGrade,
        subject_id: selectedSubject,
        chapter_id: selectedChapter || null,
        status: 'In_Progress'
      });
      setNewTitle('');
      showToast('Topic added to syllabus', 'success');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error creating topic', 'error');
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'Completed' ? 'In_Progress' : 'Completed';
    try {
      await api.put(`/lms/${item._id}`, { status: nextStatus });
      loadData();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const completedCount = topics.filter((t) => t.status === 'Completed').length;
  const progressPct = topics.length ? Math.round((completedCount / topics.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-4">
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {subjects.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.code || 'Sub'})</option>)}
        </select>
        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-between text-xs font-semibold mb-1 text-gray-600 dark:text-gray-300">
            <span>Syllabus Completion</span><span>{progressPct}% ({completedCount}/{topics.length})</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleCreateTopic} className="lg:col-span-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
          <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" /> Add Syllabus Topic</h4>
          <select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <option value="">General (No Chapter)</option>
            {chapters.map((c) => <option key={c._id} value={c._id}>Ch {c.chapter_no}: {c.title}</option>)}
          </select>
          <input type="text" placeholder="Topic title / Learning Objective..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
          <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Topic</button>
        </form>

        <div className="lg:col-span-8 space-y-3">
          {topics.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed">No topics defined yet for this subject.</div>
          ) : (
            topics.map((t) => <LmsTopicItem key={t._id} topic={t} onToggleStatus={handleToggleStatus} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default LmsSyllabusTab;
