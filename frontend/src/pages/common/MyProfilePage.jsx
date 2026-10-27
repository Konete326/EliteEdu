import { Navigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMyProfile } from '../../hooks/useMyProfile';
import ProfileHeaderHero from '../../components/common/profile/ProfileHeaderHero';
import ProfileTabNav from '../../components/common/profile/ProfileTabNav';
import ProfilePersonalTab from '../../components/common/profile/ProfilePersonalTab';
import ProfileContactTab from '../../components/common/profile/ProfileContactTab';
import ProfileQualificationsBankTab from '../../components/common/profile/ProfileQualificationsBankTab';
import ProfileSecurityTab from '../../components/common/profile/ProfileSecurityTab';
import ProfilePermissionsTab from '../../components/common/profile/ProfilePermissionsTab';

const MyProfilePage = () => {
  const { user } = useAuth();
  if (user?.role === 'Teacher') {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  const {
    profile, formData, activeTab, setActiveTab, loading, saving, toast,
    handleFieldChange, handlePhotoUpload, handleSaveProfile, handlePasswordChange
  } = useMyProfile();

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-xs text-ink-muted">Loading complete faculty profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-12">
      <ProfileHeaderHero profile={formData} onPhotoUpload={handlePhotoUpload} saving={saving} />

      {toast && (
        <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border animate-in fade-in ${
          toast.type === 'error' ? 'bg-bad/10 text-bad border-bad/20' : 'bg-good/10 text-good border-good/20'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      <ProfileTabNav activeTab={activeTab} onSelectTab={setActiveTab} />

      <div>
        {activeTab === 'personal' && <ProfilePersonalTab formData={formData} onChange={handleFieldChange} />}
        {activeTab === 'contact' && <ProfileContactTab formData={formData} onChange={handleFieldChange} />}
        {activeTab === 'qualification' && <ProfileQualificationsBankTab formData={formData} onChange={handleFieldChange} />}
        {activeTab === 'security' && <ProfileSecurityTab onPasswordChange={handlePasswordChange} saving={saving} />}
        {activeTab === 'permissions' && <ProfilePermissionsTab profile={profile} />}
      </div>

      {['personal', 'contact', 'qualification'].includes(activeTab) && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProfilePage;
