import { useState, useEffect } from 'react';
import { Plus, BookOpen, Search, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';
import LmsTopicItem from './LmsTopicItem';

const LmsSyllabusTab = ({ grades = [], subjects = [], campusId = '' }) => {
  const { showToast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (grades.length && !selectedGrade) setSelectedGrade(grades[0]._id);
    if (subjects.length && !selectedSubject) setSelectedSubject(subjects[0]._id);
  }, [grades, subjects]);

  const loadData = async () => {
    if (!selectedGrade || !selectedSubject) return;
    setLoading(true);
    try {
      const campusQuery = campusId ? `&campus_id=${campusId}` : '';
      const [chapRes, topRes] = await Promise.all([
        api.get(`/question-papers/chapters?grade_id=${selectedGrade}&subject_id=${selectedSubject}`),
        api.get(`/lms?item_type=Course_Topic&grade_id=${selectedGrade}&subject_id=${selectedSubject}${campusQuery}`)
      ]);
      setChapters(chapRes.data?.chapters || []);
      setTopics(topRes.data?.items || []);
    } catch {
      showToast('Failed to load syllabus items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedGrade, selectedSubject, campusId]);

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
        campus_id: campusId || null,
        status: 'In_Progress'
      });
      setNewTitle('');
      setShowAddForm(false);
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

  const handleDeleteTopic = async (id) => {
    try {
      await api.delete(`/lms/${id}`);
      showToast('Topic deleted', 'success');
      loadData();
    } catch {
      showToast('Failed to delete topic', 'error');
    }
  };

  const completedCount = topics.filter((t) => t.status === 'Completed').length;
  const progressPct = topics.length ? Math.round((completedCount / topics.length) * 100) : 0;
  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-xs font-bold text-ink-muted">Class:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs font-bold text-ink dark:text-white outline-none focus:border-primary flex-1 sm:flex-none"
            >
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-xs font-bold text-ink-muted">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs font-bold text-ink dark:text-white outline-none focus:border-primary flex-1 sm:flex-none"
            >
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.code || 'Sub'})</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-72">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-bold mb-1 text-ink-muted">
              <span>Syllabus Progress</span>
              <span className="font-mono text-primary font-black">{progressPct}% ({completedCount}/{topics.length})</span>
            </div>
            <div className="w-full bg-surface-secondary dark:bg-surface-secondary-dark h-2 rounded-full overflow-hidden border border-line dark:border-line-dark">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Topic</span>
            {showAddForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreateTopic}
          className="p-4 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 shadow-xs space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs sm:text-sm text-ink dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Add New Syllabus Topic</span>
            </h4>
            <span className="text-[10px] text-ink-muted font-mono">
              Auto-links to Grade &amp; Subject
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-4">
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
              >
                <option value="">General (No Chapter)</option>
                {chapters.map((c) => (
                  <option key={c._id} value={c._id}>
                    Ch {c.chapter_no}: {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-6">
              <input
                type="text"
                placeholder="Topic title / Learning Objective..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus size={14} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search syllabus topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-white outline-none focus:border-primary"
            />
          </div>
          <span className="text-xs font-bold text-ink-muted">
            {filteredTopics.length} Topics
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark">
            Loading syllabus topics...
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark space-y-2">
            <BookOpen className="w-8 h-8 text-ink-muted mx-auto" />
            <p className="font-bold text-ink dark:text-white">No topics defined yet</p>
            <p className="text-[11px]">Click &quot;Add Topic&quot; above to create syllabus items for this subject.</p>
          </div>
        ) : (
          filteredTopics.map((t) => (
            <LmsTopicItem
              key={t._id}
              topic={t}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTopic}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LmsSyllabusTab;
