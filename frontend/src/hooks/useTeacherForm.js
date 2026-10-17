import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePersistentFormDraft } from './usePersistentFormDraft';
import { isValidEmail } from '../utils/validators';

const INITIAL = {
  name: '', father_name: '', surname: '', spouse_name: '', nick_name: '',
  email: '', photo_url: '', dob: '', gender: 'Male', marital_status: 'Single',
  contact_number: '', whatsapp_number: '', cnic: '', cnic_expiry: '',
  is_coordinator: false, status: 'Active', employee_code: '', campus_id: '',
  department: 'Academics', designation: 'PST', bps_grade: '', personal_id: '',
  qualification: '', supervisor: '', joining_date: '', regularization_date: '',
  appointment_order_no: '', appointment_date: '', basic_salary: 0,
  current_address: '', permanent_address: '', notes: '',
  bank_details: { bank_name: '', account_title: '', account_number: '', iban: '', branch_code: '' },
  emergency_contact: { name: '', relation: '', phone: '' },
  children: [], weekly_timings: [], class_assignments: [],
  app_permissions: {}, payroll_config: { allowances: [], deductions: [] },
  security_deposits: [], increments: [], loans: [], follow_ups: [], documents: []
};

export const useTeacherForm = (id) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  const draftKey = `teacher_draft_${user?.school_id || 'default'}`;
  const [draftForm, setDraftForm, clearDraft, draftSavedAt] = usePersistentFormDraft(draftKey, INITIAL);
  const [formData, setFormData] = useState(INITIAL);
  const [campuses, setCampuses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [customRoles, setCustomRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEditMode && draftForm) setFormData(draftForm);
  }, [isEditMode, draftForm]);

  const loadDependencies = async () => {
    const [cRes, sRes, gRes, rRes] = await Promise.allSettled([
      api.get('/campuses'), api.get('/subjects?limit=200'),
      api.get('/grades'), api.get('/user-management/roles')
    ]);
    if (cRes.status === 'fulfilled') setCampuses(cRes.value.data.campuses || []);
    if (sRes.status === 'fulfilled') setSubjects(sRes.value.data.subjects || []);
    if (gRes.status === 'fulfilled') setGrades(gRes.value.data.grades || []);
    if (rRes.status === 'fulfilled') setCustomRoles(rRes.value.data.roles || []);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await loadDependencies();
        if (isEditMode) {
          const t = (await api.get(`/teachers/${id}`)).data.teacher;
          setFormData({
            ...INITIAL, ...t,
            campus_id: t.campus_id?._id || t.campus_id || '',
            custom_role_id: t.custom_role_id?._id || t.custom_role_id || '',
            bank_details: { ...INITIAL.bank_details, ...(t.bank_details || {}) },
            emergency_contact: { ...INITIAL.emergency_contact, ...(t.emergency_contact || {}) },
            app_permissions: t.app_permissions || {},
            payroll_config: t.payroll_config || { allowances: [], deductions: [] }
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initialize form dependencies');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEditMode]);

  const updateForm = (updater) => {
    setFormData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      if (!isEditMode) setDraftForm(next);
      return next;
    });
  };

  const handleField = (f, v) => {
    updateForm((p) => ({ ...p, [f]: v }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: '' }));
    if (error) setError('');
  };
  const handleEmergency = (f, v) => updateForm((p) => ({ ...p, emergency_contact: { ...p.emergency_contact, [f]: v } }));
  const handleBank = (f, v) => updateForm((p) => ({ ...p, bank_details: { ...p.bank_details, [f]: v } }));

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Full Name is required.';
    if (formData.email?.trim() && !isValidEmail(formData.email.trim())) errs.email = 'Please enter a valid email address.';
    setErrors(errs);
    return errs;
  };

  const saveTeacher = async (customRedirect = true) => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fill in all required fields highlighted in red.');
      throw new Error('Please fill in all required fields highlighted in red.');
    }
    setSubmitting(true);
    setError('');
    try {
      const res = isEditMode ? await api.put(`/teachers/${id}`, formData) : await api.post('/teachers', formData);
      if (!isEditMode) clearDraft();
      if (customRedirect) navigate('/admin/teachers');
      return res.data.teacher;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save staff record';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData, campuses, subjects, grades, customRoles, loading, submitting, error, setError, errors, saveTeacher,
    handleField, handleEmergency, handleBank, isEditMode, schoolType: user?.school_type || 'Private',
    clearDraft, draftSavedAt, fetchPrereqs: loadDependencies
  };
};

export default useTeacherForm;
