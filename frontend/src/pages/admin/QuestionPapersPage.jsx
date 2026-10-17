import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, FileText } from 'lucide-react';
import axios from '../../api/axios';
import ChaptersTab from '../../components/admin/examsuite/questionpapers/ChaptersTab';
import QuestionBankTab from '../../components/admin/examsuite/questionpapers/QuestionBankTab';
import PaperBuilderTab from '../../components/admin/examsuite/questionpapers/PaperBuilderTab';

const QuestionPapersPage = () => {
  const [activeTab, setActiveTab] = useState('chapters');
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [papers, setPapers] = useState([]);

  const loadPrereqs = async () => {
    try {
      const [gRes, sRes] = await Promise.all([axios.get('/api/grades'), axios.get('/api/subjects')]);
      const gList = gRes.data.grades || gRes.data || [];
      const sList = sRes.data.subjects || sRes.data || [];
      setGrades(gList);
      setSubjects(sList);
      if (gList.length > 0) setSelectedGrade(gList[0]._id);
      if (sList.length > 0) setSelectedSubject(sList[0]._id);
    } catch {}
  };

  const loadData = async () => {
    try {
      const [cRes, qRes, pRes] = await Promise.all([
        axios.get(`/api/question-papers/chapters?grade_id=${selectedGrade}&subject_id=${selectedSubject}`),
        axios.get(`/api/question-papers/questions?grade_id=${selectedGrade}&subject_id=${selectedSubject}`),
        axios.get('/api/question-papers/papers')
      ]);
      setChapters(cRes.data.chapters || []);
      setQuestions(qRes.data.questions || []);
      setPapers(pRes.data.papers || []);
    } catch {}
  };

  useEffect(() => { loadPrereqs(); }, []);
  useEffect(() => { if (selectedGrade && selectedSubject) loadData(); }, [selectedGrade, selectedSubject]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Question Papers Studio</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Manage chapters, question banks, and automated examination sheets.</p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button onClick={() => setActiveTab('chapters')} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${activeTab === 'chapters' ? 'bg-white dark:bg-slate-900 border-t-2 border-primary text-primary' : 'text-slate-500'}`}>
          <BookOpen size={14} /> Subject Chapters
        </button>
        <button onClick={() => setActiveTab('questions')} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${activeTab === 'questions' ? 'bg-white dark:bg-slate-900 border-t-2 border-primary text-primary' : 'text-slate-500'}`}>
          <HelpCircle size={14} /> Question Bank
        </button>
        <button onClick={() => setActiveTab('papers')} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${activeTab === 'papers' ? 'bg-white dark:bg-slate-900 border-t-2 border-primary text-primary' : 'text-slate-500'}`}>
          <FileText size={14} /> Create / Print Question Paper
        </button>
      </div>

      {activeTab === 'chapters' ? (
        <ChaptersTab
          chapters={chapters} grades={grades} subjects={subjects}
          selectedGrade={selectedGrade} selectedSubject={selectedSubject}
          onGradeChange={setSelectedGrade} onSubjectChange={setSelectedSubject}
          onSaveChapter={async (payload) => { await axios.post('/api/question-papers/chapters', payload); loadData(); }}
          onDeleteChapter={async (id) => { await axios.delete(`/api/question-papers/chapters/${id}`); loadData(); }}
          onSeedChapters={async () => { await axios.post('/api/question-papers/chapters/seed', { grade_id: selectedGrade, subject_id: selectedSubject }); loadData(); }}
        />
      ) : activeTab === 'questions' ? (
        <QuestionBankTab
          questions={questions} grades={grades} subjects={subjects} chapters={chapters}
          selectedGrade={selectedGrade} selectedSubject={selectedSubject}
          onGradeChange={setSelectedGrade} onSubjectChange={setSelectedSubject}
          onSaveQuestion={async (payload) => { await axios.post('/api/question-papers/questions', payload); loadData(); }}
          onDeleteQuestion={async (id) => { await axios.delete(`/api/question-papers/questions/${id}`); loadData(); }}
          onSeedQuestions={async () => { await axios.post('/api/question-papers/questions/seed', { grade_id: selectedGrade, subject_id: selectedSubject }); loadData(); }}
        />
      ) : (
        <PaperBuilderTab
          papers={papers} grades={grades} subjects={subjects} chapters={chapters}
          onGeneratePaper={async (payload) => { await axios.post('/api/question-papers/papers/auto-generate', payload); loadData(); }}
          onDeletePaper={async (id) => { await axios.delete(`/api/question-papers/papers/${id}`); loadData(); }}
        />
      )}
    </div>
  );
};

export default QuestionPapersPage;
