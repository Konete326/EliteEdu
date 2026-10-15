const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const TeacherCardEditFields = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Blood Group (Optional)</label>
          <select
            value={formData.blood_group}
            onChange={(e) => handleChange('blood_group', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none"
          >
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Personal ID # (8 Digits)</label>
          <input
            type="text"
            value={formData.personal_id}
            onChange={(e) => handleChange('personal_id', e.target.value)}
            placeholder="11034103"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">SEMIS Code (Optional)</label>
          <input
            type="text"
            value={formData.semis_code}
            onChange={(e) => handleChange('semis_code', e.target.value)}
            placeholder="408110114"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Vendor No (Optional)</label>
          <input
            type="text"
            value={formData.vendor_no}
            onChange={(e) => handleChange('vendor_no', e.target.value)}
            placeholder="1045231"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">SED # (Optional)</label>
          <input
            type="text"
            value={formData.sed_no}
            onChange={(e) => handleChange('sed_no', e.target.value)}
            placeholder="SED-9921"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Father / Spouse Name</label>
          <input
            type="text"
            value={formData.father_name}
            onChange={(e) => handleChange('father_name', e.target.value)}
            placeholder="Father or Husband name"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none"
          />
        </div>
      </div>

      <div className="text-xs">
        <label className="block font-semibold mb-1">Current Posting Address</label>
        <input
          type="text"
          value={formData.current_address}
          onChange={(e) => handleChange('current_address', e.target.value)}
          placeholder="e.g. Korangi 4, Karachi"
          className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none"
        />
      </div>
    </div>
  );
};

export default TeacherCardEditFields;
