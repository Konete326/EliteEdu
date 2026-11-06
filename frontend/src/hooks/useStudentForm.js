import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePersistentFormDraft } from './usePersistentFormDraft';

const INITIAL_FORM = {
  campus_id: '',
  name: '',
  father_name: '',
  surname: '',
  mother_guardian_name: '',
  gender: 'Male',
  dob: '',
  admission_date: new Date().toISOString().split('T')[0],
  b_form: '',
  contact_number: '',
  religion: 'Islam',
  emergency_contact_no: '',
  photo_url: '',
  status: 'Active',
  grade_admitted: '',
  section_admitted: 'A',
  current_grade: '',
  current_section: 'A',
  elective_stream: 'None',
  monthly_fee: 0,
  discount: 0,
  family_number: '',
  parents_cnic: {
    father_cnic: '',
    mother_cnic: '',
    guardian_cnic: ''
  },
  family_members: [],
  address: {
    current_address: '',
    permanent_address: '',
    area: ''
  },
  academic_history: {
    last_institute: '',
    previous_school: '',
    previous_id_roll_no: '',
    last_class: '',
    last_session: '',
    last_result: ''
  },
  admission_test: {
    test_date: '',
    status: 'Pending',
    remarks: '',
    test_completed: false,
    test_passed: false,
    payment_received: false
  },
  admission_interview: {
    interview_date: '',
    status: 'Pending',
    remarks: ''
  },
  subjects: [],
  app_settings: {},
  documents: [],
  notes: ''
};

const sanitizeStudentSubmissionPayload = (raw) => {
  const payload = { ...raw };
  payload.app_settings = {};
  return payload;
};

const resolveGradeCurriculumSubjects = (gradeId, electiveStream, allGrades = [], allSubjects = []) => {
  if (!allSubjects || allSubjects.length === 0 || !gradeId) return [];
  const targetGrade = allGrades.find((g) => String(g._id || g.id) === String(gradeId?._id || gradeId));
  const gradeName = targetGrade?.name?.toLowerCase().trim() || '';

  const gradeFiltered = allSubjects.filter((s) => {
    if (s.status === 'Inactive') return false;
    if (!s.classes || s.classes.length === 0) return true;
    return s.classes.some((c) => {
      const cStr = String(c).toLowerCase().trim();
      return cStr === gradeName || cStr === String(targetGrade?._id);
    });
  });

  const pool = gradeFiltered.length > 0 ? gradeFiltered : allSubjects.filter((s) => s.status !== 'Inactive');

  const selected = pool.filter((s) => {
    if (s.subject_type === 'Compulsory' || s.mandatory) return true;
    if (electiveStream === 'Science (Biology)') {
      return s.stream === 'Science (Biology)' || s.code === 'BIO' || (s.name && s.name.toLowerCase().includes('bio'));
    }
    if (electiveStream === 'Science (Computer)') {
      return s.stream === 'Science (Computer)' || s.code === 'CS' || (s.name && s.name.toLowerCase().includes('comp'));
    }
    if (electiveStream === 'Arts / Humanities') {
      return s.stream === 'Arts / Humanities' || (s.name && (s.name.toLowerCase().includes('art') || s.name.toLowerCase().includes('human')));
    }
    if (electiveStream === 'Commerce') {
      return s.stream === 'Commerce' || (s.name && s.name.toLowerCase().includes('comm'));
    }
    return false;
  });

  return selected.map((s) => s._id);
};

export const useStudentForm = (id) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  const draftKey = `student_draft_${user?.school_id || 'default'}`;
  const [draftForm, setDraftForm, clearDraft, draftSavedAt] = usePersistentFormDraft(draftKey, INITIAL_FORM);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditMode && draftForm) setFormData(draftForm);
  }, [isEditMode, draftForm]);

  const loadDependencies = async () => {
    const [cRes, gRes, sRes] = await Promise.all([
      api.get('/campuses'),
      api.get('/grades'),
      api.get('/subjects?limit=200')
    ]);
    setCampuses(cRes.data.campuses || []);
    setGrades(gRes.data.grades || []);
    setSubjects(sRes.data.subjects || []);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await loadDependencies();

        if (isEditMode) {
          const sRes = await api.get(`/students/${id}`);
          const s = sRes.data.student;
          setFormData({
            ...INITIAL_FORM,
            ...s,
            campus_id: s.campus_id?._id || s.campus_id || '',
            grade_admitted: s.grade_admitted?._id || s.grade_admitted || '',
            current_grade: s.current_grade?._id || s.current_grade || '',
            subjects: s.subjects?.map((sub) => sub._id || sub) || [],
            dob: s.dob ? new Date(s.dob).toISOString().split('T')[0] : '',
            admission_date: s.admission_date ? new Date(s.admission_date).toISOString().split('T')[0] : '',
            parents_cnic: { ...INITIAL_FORM.parents_cnic, ...(s.parents_cnic || {}) },
            address: { ...INITIAL_FORM.address, ...(s.address || {}) },
            academic_history: { ...INITIAL_FORM.academic_history, ...(s.academic_history || {}) },
            admission_test: { ...INITIAL_FORM.admission_test, ...(s.admission_test || {}) },
            admission_interview: { ...INITIAL_FORM.admission_interview, ...(s.admission_interview || {}) },
            documents: s.documents || [],
            app_settings: { ...INITIAL_FORM.app_settings, ...(s.app_settings || {}) }
          });
        } else {
          try {
            const famRes = await api.get('/students/next-family-number');
            if (famRes.data?.family_number) {
              updateForm((prev) => ({ ...prev, family_number: famRes.data.family_number }));
            }
          } catch (e) {
            updateForm((prev) => ({ ...prev, family_number: 'FAM-0001' }));
          }
          const loadedGrades = gRes.data.grades || [];
          const loadedSubjects = sRes.data.subjects || [];
          setFormData((prev) => {
            const activeGrade = prev.current_grade || prev.grade_admitted;
            if (activeGrade && (!prev.subjects || prev.subjects.length === 0)) {
              const auto = resolveGradeCurriculumSubjects(activeGrade, prev.elective_stream, loadedGrades, loadedSubjects);
              if (auto.length > 0) return { ...prev, subjects: auto };
            }
            return prev;
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initialize form data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEditMode]);

  const [errors, setErrors] = useState({});

  const updateForm = (updater) => {
    setFormData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      if (!isEditMode) setDraftForm(next);
      return next;
    });
  };

  const handleField = (field, value) => {
    updateForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'current_grade' || field === 'grade_admitted' || field === 'elective_stream') {
        const activeGrade = field === 'current_grade' ? value : (next.current_grade || next.grade_admitted);
        const activeStream = field === 'elective_stream' ? value : next.elective_stream;
        if (activeGrade && grades.length > 0 && subjects.length > 0) {
          const autoSubjects = resolveGradeCurriculumSubjects(activeGrade, activeStream, grades, subjects);
          if (autoSubjects.length > 0) {
            next.subjects = autoSubjects;
          }
        }
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleNestedField = (parent, field, value) => {
    updateForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleToggleAppSetting = (key) => {
    updateForm((prev) => ({
      ...prev,
      app_settings: {
        ...prev.app_settings,
        [key]: !prev.app_settings[key]
      }
    }));
  };

  const handleToggleAllAppSettings = (state) => {
    updateForm((prev) => {
      const updated = {};
      Object.keys(prev.app_settings || INITIAL_FORM.app_settings).forEach((k) => {
        updated[k] = state;
      });
      return { ...prev, app_settings: updated };
    });
  };

  const handleToggleSubject = (subjectId) => {
    updateForm((prev) => {
      const current = prev.subjects || [];
      const exists = current.includes(subjectId);
      return {
        ...prev,
        subjects: exists ? current.filter((s) => s !== subjectId) : [...current, subjectId]
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Student Name is required.';
    if (!formData.father_name?.trim()) errs.father_name = 'Father Name is required.';
    setErrors(errs);
    return errs;
  };

  const saveStudent = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fill in all required fields highlighted in red.');
      throw new Error('Please fill in all required fields highlighted in red.');
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = sanitizeStudentSubmissionPayload(formData);
      const res = isEditMode
        ? await api.put(`/students/${id}`, payload)
        : await api.post('/students', payload);
      if (!isEditMode) clearDraft();
      navigate('/admin/students');
      return res.data.student;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save student record';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const refreshFamilyNumber = async () => {
    try {
      const famRes = await api.get('/students/next-family-number');
      if (famRes.data?.family_number) {
        updateForm((prev) => ({ ...prev, family_number: famRes.data.family_number }));
      }
    } catch (e) {
      updateForm((prev) => ({ ...prev, family_number: 'FAM-0001' }));
    }
  };

  const resyncCurriculumSubjects = () => {
    const activeGrade = formData.current_grade || formData.grade_admitted;
    if (activeGrade && grades.length > 0 && subjects.length > 0) {
      const autoSubjects = resolveGradeCurriculumSubjects(activeGrade, formData.elective_stream, grades, subjects);
      if (autoSubjects.length > 0) {
        updateForm((prev) => ({ ...prev, subjects: autoSubjects }));
      }
    }
  };

  return {
    formData,
    campuses,
    grades,
    subjects,
    loading,
    submitting,
    error,
    setError,
    errors,
    saveStudent,
    handleField,
    handleNestedField,
    handleToggleAppSetting,
    handleToggleAllAppSettings,
    handleToggleSubject,
    resyncCurriculumSubjects,
    refreshFamilyNumber,
    clearDraft,
    draftSavedAt,
    fetchPrereqs: loadDependencies
  };
};
