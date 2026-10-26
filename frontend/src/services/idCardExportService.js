import api from './api';
import { exportStudentCardsPdf, printStudentCardsPdf } from '../utils/pdf/studentCardPdfExporter';
import { exportStudentCardsZip } from '../utils/pdf/studentCardZipExporter';
import { exportTeacherCardsPdf, printTeacherCardsPdf } from '../utils/pdf/teacherCardPdfExporter';
import { exportTeacherCardsZip } from '../utils/pdf/teacherCardZipExporter';

export const fetchFullStudentCardsForExport = async ({
  campusId = '',
  gradeId = '',
  searchQuery = '',
  photoFilter = 'all',
  selectedIds = [],
  isAllSelected = false,
  fallbackStudents = []
} = {}) => {
  if (!isAllSelected && selectedIds.length > 0 && selectedIds.length < 15 && fallbackStudents.length > 0) {
    const matched = fallbackStudents.filter((s) => selectedIds.includes(s._id));
    if (matched.length === selectedIds.length) return matched;
  }

  const params = {
    cardView: 'true',
    limit: 10000
  };
  if (campusId) params.campus_id = campusId;
  if (gradeId) params.grade_id = gradeId;
  if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();

  const res = await api.get('/students', { params });
  let list = res.data?.students || res.data || [];

  if (photoFilter === 'with_photo') {
    list = list.filter((s) => s.photo_url && String(s.photo_url).trim());
  } else if (photoFilter === 'without_photo') {
    list = list.filter((s) => !s.photo_url || !String(s.photo_url).trim());
  }

  if (!isAllSelected && selectedIds.length > 0) {
    const idSet = new Set(selectedIds);
    list = list.filter((s) => idSet.has(s._id));
  }

  return list;
};

export const fetchFullTeacherCardsForExport = async ({
  campusId = '',
  searchQuery = '',
  selectedIds = [],
  isAllSelected = false,
  fallbackTeachers = []
} = {}) => {
  if (!isAllSelected && selectedIds.length > 0 && selectedIds.length < 15 && fallbackTeachers.length > 0) {
    const matched = fallbackTeachers.filter((t) => selectedIds.includes(t._id));
    if (matched.length === selectedIds.length) return matched;
  }

  const params = {
    cardView: 'true'
  };
  if (campusId) params.campus_id = campusId;
  if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();

  const res = await api.get('/teachers', { params });
  let list = res.data?.teachers || res.data || [];

  if (!isAllSelected && selectedIds.length > 0) {
    const idSet = new Set(selectedIds);
    list = list.filter((t) => idSet.has(t._id));
  }

  return list;
};

export const exportStudentCardsPdfBackground = async ({ filterParams, exportOptions, onProgress }) => {
  if (onProgress) onProgress({ stage: 'fetch', message: 'Fetching student directory...', percent: 15 });
  const students = await fetchFullStudentCardsForExport(filterParams);
  if (!students.length) throw new Error('No student records found to export');

  if (onProgress) onProgress({ stage: 'generate', message: `Rendering ${students.length} high-res vector card(s)...`, percent: 50 });
  await exportStudentCardsPdf(students, exportOptions);
  if (onProgress) onProgress({ stage: 'done', message: `Exported ${students.length} card(s) successfully!`, percent: 100 });
  return students.length;
};

export const exportStudentCardsZipBackground = async ({ filterParams, exportOptions, onProgress }) => {
  if (onProgress) onProgress({ stage: 'fetch', message: 'Fetching student directory...', percent: 10 });
  const students = await fetchFullStudentCardsForExport(filterParams);
  if (!students.length) throw new Error('No student records found to export');

  await exportStudentCardsZip(students, {
    ...exportOptions,
    onProgress: (p) => {
      if (onProgress) {
        onProgress({
          stage: 'packing',
          message: `Packaging vendor ZIP archive (${p.percent}%)...`,
          current: p.current,
          total: p.total,
          percent: p.percent
        });
      }
    }
  });

  if (onProgress) onProgress({ stage: 'done', message: `Vendor archive exported! ${students.length} card(s) saved in ZIP.`, percent: 100 });
  return students.length;
};

export const printStudentCardsBackground = async ({ filterParams, exportOptions, mode = 'current', currentSheetStudents = [], onProgress }) => {
  if (mode === 'current') {
    if (!currentSheetStudents.length) throw new Error('Current sheet is empty');
    await printStudentCardsPdf(currentSheetStudents, exportOptions);
    return currentSheetStudents.length;
  }

  if (onProgress) onProgress({ stage: 'fetch', message: 'Fetching complete student records for printing...', percent: 20 });
  const students = await fetchFullStudentCardsForExport(filterParams);
  if (!students.length) throw new Error('No student records found to print');

  if (onProgress) onProgress({ stage: 'generate', message: `Preparing high-resolution print stream for ${students.length} cards...`, percent: 60 });
  await printStudentCardsPdf(students, exportOptions);
  if (onProgress) onProgress({ stage: 'done', message: 'Print dialog opened successfully!', percent: 100 });
  return students.length;
};

export const exportTeacherCardsPdfBackground = async ({ filterParams, exportOptions, onProgress }) => {
  if (onProgress) onProgress({ stage: 'fetch', message: 'Fetching faculty directory...', percent: 20 });
  const teachers = await fetchFullTeacherCardsForExport(filterParams);
  if (!teachers.length) throw new Error('No faculty records found to export');

  if (onProgress) onProgress({ stage: 'generate', message: `Rendering ${teachers.length} faculty card(s)...`, percent: 55 });
  await exportTeacherCardsPdf(teachers, exportOptions);
  if (onProgress) onProgress({ stage: 'done', message: `Exported ${teachers.length} faculty card(s) successfully!`, percent: 100 });
  return teachers.length;
};

export const exportTeacherCardsZipBackground = async ({ filterParams, exportOptions, onProgress }) => {
  if (onProgress) onProgress({ stage: 'fetch', message: 'Fetching faculty directory...', percent: 15 });
  const teachers = await fetchFullTeacherCardsForExport(filterParams);
  if (!teachers.length) throw new Error('No faculty records found to export');

  await exportTeacherCardsZip(teachers, exportOptions);
  if (onProgress) onProgress({ stage: 'done', message: `Vendor package exported! ${teachers.length} faculty card(s) saved in ZIP.`, percent: 100 });
  return teachers.length;
};

export const printTeacherCardsBackground = async ({ filterParams, exportOptions, mode = 'current', currentSheetTeachers = [], onProgress }) => {
  if (mode === 'current') {
    if (!currentSheetTeachers.length) throw new Error('Current sheet is empty');
    await printTeacherCardsPdf(currentSheetTeachers, exportOptions);
    return currentSheetTeachers.length;
  }

  if (onProgress) onProgress({ stage: 'fetch', message: 'Fetching complete faculty records for printing...', percent: 20 });
  const teachers = await fetchFullTeacherCardsForExport(filterParams);
  if (!teachers.length) throw new Error('No faculty records found to print');

  if (onProgress) onProgress({ stage: 'generate', message: `Preparing high-resolution print stream for ${teachers.length} faculty cards...`, percent: 60 });
  await printTeacherCardsPdf(teachers, exportOptions);
  if (onProgress) onProgress({ stage: 'done', message: 'Print dialog opened successfully!', percent: 100 });
  return teachers.length;
};
