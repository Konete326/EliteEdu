import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { isValidEmail, isValidPhone, isValidCnic } from '../utils/validators';

const INITIAL_FORM_DATA = {
  name: '',
  father_name: '',
  gender: '',
  dob: '',
  contact_number: '',
  email: '',
  cnic: '',
  marital_status: '',
  applied_on: '',
  added_on: new Date().toISOString().split('T')[0],
  replacement_staff: '',
  photo_url: '',
  campus_id: '',
  department: '',
  designation: '',
  qualification: '',
  experience_years: 0,
  availability: 'Full Time',
  bps_grade: '',
  expected_salary: 0,
  approved_salary: 0,
  previous_employer: '',
  skills: '',
  current_address: '',
  permanent_address: '',
  city: '',
  area: '',
  resume_url: '',
  resume_name: '',
  documents: [],
  follow_ups: []
};

export const useStaffApplicantForm = (id) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [campuses, setCampuses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [cRes, tRes] = await Promise.all([
          api.get('/campuses'),
          api.get('/teachers')
        ]);
        if (cRes.data.success) setCampuses(cRes.data.campuses || []);
        if (tRes.data.success) setTeachers(tRes.data.teachers || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchApplicant = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/staff-applicants/${id}`);
        if (res.data.success && res.data.applicant) {
          const app = res.data.applicant;
          setFormData({
            ...INITIAL_FORM_DATA,
            ...app,
            campus_id: app.campus_id?._id || app.campus_id || '',
            replacement_staff: app.replacement_staff?._id || app.replacement_staff || '',
            dob: app.dob ? new Date(app.dob).toISOString().split('T')[0] : '',
            applied_on: app.applied_on ? new Date(app.applied_on).toISOString().split('T')[0] : '',
            added_on: app.added_on ? new Date(app.added_on).toISOString().split('T')[0] : ''
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applicant data');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicant();
  }, [id]);

  const handleField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleAddDocument = (doc) => {
    setFormData((prev) => ({ ...prev, documents: [...prev.documents, doc] }));
  };

  const handleRemoveDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddFollowUp = (item) => {
    setFormData((prev) => ({ ...prev, follow_ups: [...prev.follow_ups, item] }));
  };

  const handleRemoveFollowUp = (index) => {
    setFormData((prev) => ({
      ...prev,
      follow_ups: prev.follow_ups.filter((_, idx) => idx !== index)
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Full name is required';
    if (formData.email && !isValidEmail(formData.email)) errs.email = 'Please enter a valid email address';
    if (formData.contact_number && !isValidPhone(formData.contact_number)) errs.contact_number = 'Please enter a valid phone number';
    if (formData.cnic && !isValidCnic(formData.cnic)) errs.cnic = 'Please enter a valid 13-digit CNIC';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveApplicant = async () => {
    if (!validate()) {
      throw new Error('Please fill all required and valid fields highlighted in red');
    }

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        ...formData,
        replacement_staff: formData.replacement_staff || null,
        campus_id: formData.campus_id || null,
        experience_years: Number(formData.experience_years) || 0,
        expected_salary: Number(formData.expected_salary) || 0,
        approved_salary: Number(formData.approved_salary) || 0
      };

      if (id) {
        await api.put(`/staff-applicants/${id}`, payload);
      } else {
        await api.post('/staff-applicants', payload);
      }

      navigate('/admin/staff-applicants');
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to save applicant');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData, campuses, teachers, loading, submitting, error, setError,
    errors, handleField, handleAddDocument, handleRemoveDocument, handleAddFollowUp,
    handleRemoveFollowUp, saveApplicant
  };
};
