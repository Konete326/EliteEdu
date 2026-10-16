import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
  app_settings: {
    edit_profile: true,
    homework: true,
    attendance: true,
    timetable: true,
    online_classes: true,
    lectures: true,
    date_sheet: true,
    assessment: true,
    learning_videos: true,
    events: true,
    voice_notes: true,
    gallery: true,
    apply_leave: true,
    library: true,
    complaints: true,
    certificate_request: true,
    id_card: true,
    admit_card: true,
    store: true,
    slc: true
  },
  documents: [],
  notes: ''
};

export const useStudentForm = (id) => {
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [cRes, gRes, sRes] = await Promise.all([
          api.get('/campuses'),
          api.get('/grades'),
          api.get('/subjects?limit=200')
        ]);
        setCampuses(cRes.data.campuses || []);
        setGrades(gRes.data.grades || []);
        setSubjects(sRes.data.subjects || []);

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
              setFormData((prev) => ({ ...prev, family_number: famRes.data.family_number }));
            }
          } catch (e) {
            setFormData((prev) => ({ ...prev, family_number: 'FAM-0001' }));
          }
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

  const handleField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleNestedField = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleToggleAppSetting = (key) => {
    setFormData((prev) => ({
      ...prev,
      app_settings: {
        ...prev.app_settings,
        [key]: !prev.app_settings[key]
      }
    }));
  };

  const handleToggleAllAppSettings = (state) => {
    setFormData((prev) => {
      const updated = {};
      Object.keys(prev.app_settings || INITIAL_FORM.app_settings).forEach((k) => {
        updated[k] = state;
      });
      return { ...prev, app_settings: updated };
    });
  };

  const handleToggleSubject = (subjectId) => {
    setFormData((prev) => {
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
      const res = isEditMode
        ? await api.put(`/students/${id}`, formData)
        : await api.post('/students', formData);
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
        setFormData((prev) => ({ ...prev, family_number: famRes.data.family_number }));
      }
    } catch (e) {
      setFormData((prev) => ({ ...prev, family_number: 'FAM-0001' }));
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
    refreshFamilyNumber
  };
};
