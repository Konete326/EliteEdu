import { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';
import { isValidEmail, isValidWebsite, isValidPhone } from '../../../utils/validators';
import CampusDetailsView from './CampusDetailsView';
import CampusForm from './CampusForm';

const CampusModal = ({ isOpen, mode = 'add', campus = null, onClose, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    contact_number: '',
    address: '',
    status: 'Active'
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (campus && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: campus.name || '',
        email: campus.email || '',
        website: campus.website || '',
        contact_number: campus.contact_number || '',
        address: campus.address || '',
        status: campus.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        website: '',
        contact_number: '',
        address: '',
        status: 'Active'
      });
    }
    setTouched({});
  }, [campus, mode, isOpen]);

  if (!isOpen) return null;

  const isEmailValid = !formData.email || isValidEmail(formData.email);
  const isWebsiteValid = !formData.website || isValidWebsite(formData.website);
  const isPhoneValid = !formData.contact_number || isValidPhone(formData.contact_number);
  const isNameValid = formData.name.trim().length > 0;
  const isFormValid = isNameValid && isEmailValid && isWebsiteValid && isPhoneValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setTouched((prev) => ({ ...prev, name: true }));
      return;
    }
    if (!isFormValid || isSubmitting) return;
    onSubmit(formData);
  };

  const modalTitle = mode === 'view' ? 'Campus Details' : mode === 'edit' ? 'Edit Campus' : 'Add New Campus';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink dark:text-ink-dark">{modalTitle}</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                {mode === 'view' ? 'View campus configuration' : 'Enter campus details and credentials'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === 'view' ? (
          <CampusDetailsView campus={campus} onClose={onClose} />
        ) : (
          <CampusForm
            formData={formData}
            touched={touched}
            mode={mode}
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
            isNameValid={isNameValid}
            isEmailValid={isEmailValid}
            isWebsiteValid={isWebsiteValid}
            isPhoneValid={isPhoneValid}
            onChange={handleChange}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default CampusModal;
