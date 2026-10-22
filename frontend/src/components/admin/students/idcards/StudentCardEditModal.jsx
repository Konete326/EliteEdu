import { useState, useEffect, useRef } from 'react';
import { X, Save, Edit3, Loader2, Camera, UploadCloud, Trash2 } from 'lucide-react';
import api from '../../../../services/api';
import WebcamCaptureModal from '../../../common/camera/WebcamCaptureModal';

const StudentCardEditModal = ({ isOpen, student, onClose, onSaveSuccess }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    gr_number: '',
    b_form: '',
    blood_group: '',
    dob: '',
    gender: 'Male',
    contact_number: '',
    emergency_contact_no: '',
    transport_route: '',
    current_address: '',
    photo_url: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        father_name: student.father_name || '',
        gr_number: student.gr_number || '',
        b_form: student.b_form || '',
        blood_group: student.blood_group || '',
        dob: student.dob ? new Date(student.dob).toISOString().slice(0, 10) : '',
        gender: student.gender || 'Male',
        contact_number: student.contact_number || '',
        emergency_contact_no: student.emergency_contact_no || '',
        transport_route: student.transport_route || '',
        current_address: student.address?.current_address || '',
        photo_url: student.photo_url || ''
      });
      setError('');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleLocalFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, photo_url: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      const payload = {
        name: formData.name.trim(),
        father_name: formData.father_name.trim(),
        gr_number: formData.gr_number.trim(),
        b_form: formData.b_form.trim(),
        blood_group: formData.blood_group,
        dob: formData.dob || null,
        gender: formData.gender,
        contact_number: formData.contact_number.trim(),
        emergency_contact_no: formData.emergency_contact_no.trim(),
        transport_route: formData.transport_route.trim(),
        photo_url: formData.photo_url.trim(),
        address: {
          ...(student.address || {}),
          current_address: formData.current_address.trim()
        }
      };

      const res = await api.put(`/students/${student._id}`, payload);
      if (res.data?.student) {
        onSaveSuccess(res.data.student);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student card details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div className="relative w-full max-w-lg bg-surface dark:bg-[#121217] border border-line dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line dark:border-white/10 bg-surface-secondary/20">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-ink dark:text-white">
                Edit Student ID Card Data ({student.name})
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto text-xs text-ink dark:text-white">
            {error && <p className="p-2.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad font-semibold">{error}</p>}

            <div className="p-3.5 rounded-2xl bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-ink dark:text-white">
                  Student ID Portrait Photo
                </span>
                {formData.photo_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo_url: '' })}
                    className="flex items-center gap-1 text-[11px] text-bad hover:underline font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl border-2 border-line dark:border-white/10 overflow-hidden bg-surface-secondary flex items-center justify-center shrink-0 shadow-xs">
                  {formData.photo_url ? (
                    <img
                      src={formData.photo_url}
                      alt="Student Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-sm font-black text-ink-muted">
                      {(formData.name || 'ST').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWebcamOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[36px]"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Take Photo via Webcam</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#181818] hover:bg-surface-secondary text-ink dark:text-white text-xs font-bold transition-all cursor-pointer min-h-[36px]"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-primary" />
                    <span>Upload File</span>
                  </button>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleLocalFileUpload}
                className="hidden"
              />

              <div>
                <label className="block text-[10px] font-semibold text-ink-muted mb-1">
                  Or paste direct image URL:
                </label>
                <input
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-black/20 font-mono outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 font-medium outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">Father Name *</label>
                <input
                  type="text"
                  required
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 font-medium outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold mb-1">GR / Reg Number *</label>
                <input
                  type="text"
                  required
                  value={formData.gr_number}
                  onChange={(e) => setFormData({ ...formData, gr_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 font-mono font-bold outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">B-Form / CNIC</label>
                <input
                  type="text"
                  value={formData.b_form}
                  onChange={(e) => setFormData({ ...formData, b_form: e.target.value })}
                  placeholder="12345-1234567-1"
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 font-mono outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">Blood Group</label>
                <select
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#16161d] font-semibold outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#16161d] outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">Bus Route / Stop</label>
                <input
                  type="text"
                  value={formData.transport_route}
                  onChange={(e) => setFormData({ ...formData, transport_route: e.target.value })}
                  placeholder="e.g. Route 4 / Stop B"
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 font-mono outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={formData.emergency_contact_no}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_no: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 font-mono outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1">Residential Address</label>
              <input
                type="text"
                value={formData.current_address}
                onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-line dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-bold text-ink-muted hover:bg-surface-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm shadow-primary/20 disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saving ? 'Updating...' : 'Save Card Details'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <WebcamCaptureModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onCapture={(dataUrl) => setFormData((prev) => ({ ...prev, photo_url: dataUrl }))}
      />
    </>
  );
};

export default StudentCardEditModal;
