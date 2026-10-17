import React, { useState, useEffect } from 'react';
import { Plus, Award } from 'lucide-react';
import axios from '../../api/axios';
import CategoryTable from '../../components/admin/examsuite/categories/CategoryTable';
import CategoryModal from '../../components/admin/examsuite/categories/CategoryModal';
import DeleteClassTestModal from '../../components/admin/classtests/DeleteClassTestModal';

const ExamCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/exam-suite/categories');
      setCategories(res.data.categories || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (payload) => {
    try {
      if (selectedCategory) {
        await axios.put(`/exam-suite/categories/${selectedCategory._id}`, payload);
      } else {
        await axios.post('/exam-suite/categories', payload);
      }
      setIsModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/exam-suite/categories/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchCategories();
    } catch {}
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
            <Award className="text-primary" size={24} />
            Exam Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure examination types and term schedules for your institution.
          </p>
        </div>
        <button
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading exam categories...</div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={(cat) => { setSelectedCategory(cat); setIsModalOpen(true); }}
          onDelete={(cat) => setDeleteTarget(cat)}
        />
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedCategory(null); }}
        onSave={handleSave}
        category={selectedCategory}
      />

      <DeleteClassTestModal
        isOpen={!!deleteTarget}
        title="Delete Exam Category"
        message={`Are you sure you want to remove the category "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ExamCategoriesPage;
