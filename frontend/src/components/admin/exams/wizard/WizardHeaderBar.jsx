import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function WizardHeaderBar({ isEdit }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link to="/admin/exam-management/exams" className="p-2 rounded-xl border border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-text-primary dark:text-text-primary-dark">
            {isEdit ? 'Edit Exam' : 'Exam Setup Wizard'}
          </h1>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Structured exam creator with automatic subject teacher alerts
          </p>
        </div>
      </div>
    </div>
  );
}
