import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { isValidEmail, isValidWebsite, isValidPhone, isValidCampusName } from '../../../utils/validators';
import CampusModalHeader from './CampusModalHeader';
import CampusDetailsView from './CampusDetailsView';
import CampusForm from './CampusForm';

const INITIAL_FORM = {
  name: '', email: '', website: '', contact_number: '', address: '', image_url: '', status: 'Active'
};

const CampusModal = ({ isOpen, mode = 'add', campus = null, existingCampuses = [], onClose, onSubmit, isSubmitting = false }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [generalLogo, setGeneralLogo] = useState(user?.school_logo || '');

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    api.get('/schools/general-settings')
      .then((res) => {
        if (mounted && res.data?.school?.logo_url) setGeneralLogo(res.data.school.logo_url);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [isOpen]);

  useEffect(() => {
    if (campus && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: campus.name || '',
        email: campus.email || '',
        website: campus.website || '',
        contact_number: campus.contact_number || '',
        address: campus.address || '',
        image_url: campus.image_url || campus.image || '',
        status: campus.status || 'Active'
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setTouched({});
  }, [campus, mode, isOpen]);

  if (!isOpen) return null;

  const trimmedName = formData.name.trim();
  const isDuplicateName = existingCampuses.some(
    (c) => (c._id || c.id) !== (campus?._id || campus?.id) &&
      c.name?.trim().toLowerCase() === trimmedName.toLowerCase()
  );
  const isNameFormatValid = isValidCampusName(trimmedName);
  const isNameValid = isNameFormatValid && !isDuplicateName;

  let nameError = '';
  if (touched.name || formData.name.length > 0) {
    if (!trimmedName) {
      nameError = 'Campus name is required';
    } else if (isDuplicateName) {
      nameError = `"${trimmedName}" is already taken by an existing campus`;
    } else if (!isNameFormatValid) {
      nameError = 'Campus name must be 2-60 characters (letters, numbers, & - / allowed)';
    }
  }

  const isEmailValid = !formData.email || isValidEmail(formData.email);
  const isWebsiteValid = !formData.website || isValidWebsite(formData.website);
  const isPhoneValid = !formData.contact_number || isValidPhone(formData.contact_number);
  const isFormValid = isNameValid && isEmailValid && isWebsiteValid && isPhoneValid;
  const logoToShow = mode === 'add' ? '/logo.png' : (formData.image_url || campus?.image_url || campus?.image || generalLogo || user?.school_logo || '/logo.png');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched((prev) => ({ ...prev, name: true }));
    if (!isFormValid || isSubmitting) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto">
        <CampusModalHeader
          modalTitle={mode === 'view' ? 'Campus Details' : mode === 'edit' ? 'Edit Campus' : 'Add New Campus'}
          mode={mode}
          logoToShow={logoToShow}
          onClose={onClose}
        />
        {mode === 'view' ? (
          <CampusDetailsView campus={campus} onClose={onClose} schoolLogo={logoToShow} />
        ) : (
          <CampusForm
            formData={formData}
            touched={touched}
            mode={mode}
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
            isNameValid={isNameValid}
            nameError={nameError}
            isEmailValid={isEmailValid}
            isWebsiteValid={isWebsiteValid}
            isPhoneValid={isPhoneValid}
            onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
            onImageChange={(val) => setFormData((prev) => ({ ...prev, image_url: val }))}
            onBlur={(field) => setTouched((prev) => ({ ...prev, [field]: true }))}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default CampusModal;
