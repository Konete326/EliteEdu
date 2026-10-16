import { useState } from 'react';
import { Stamp, PenTool, Upload, ShieldCheck } from 'lucide-react';
import useSignatures from '../../hooks/useSignatures';
import SignatureCanvas from '../../components/admin/settings/signatures/SignatureCanvas';
import SignatureUploadCard from '../../components/admin/settings/signatures/SignatureUploadCard';
import StampUploadCard from '../../components/admin/settings/signatures/StampUploadCard';
import SignaturesList from '../../components/admin/settings/signatures/SignaturesList';
import SettingsFeedbackModal from '../../components/admin/settings/SettingsFeedbackModal';

const GeneralSignaturesPage = () => {
  const [activeTab, setActiveTab] = useState('canvas');
  const {
    signatures,
    defaultSignature,
    defaultStamp,
    saving,
    feedback,
    closeFeedback,
    saveSignature,
    setDefault,
    deleteSignature
  } = useSignatures();

  return (
    <div className="w-full space-y-6">
      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Stamp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text dark:text-text-dark">Digital Signatures & Stamps Studio</h1>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              Upload seals and draw vector signatures for auto-injection into official institutional documents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {defaultSignature && (
            <span className="px-2.5 py-1 text-xs rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 font-medium">
              <PenTool className="w-3.5 h-3.5" /> Sign: {defaultSignature.label}
            </span>
          )}
          {defaultStamp && (
            <span className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Stamp: {defaultStamp.label}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-line dark:border-white/10 pb-3">
        {[
          { id: 'canvas', label: 'Draw with Touch/Mouse', icon: PenTool },
          { id: 'upload', label: 'Upload Signature Photo', icon: Upload },
          { id: 'stamp', label: 'Official Seal / Rubber Stamp', icon: Stamp }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 text-text-muted hover:text-text'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'canvas' && <SignatureCanvas onSave={saveSignature} saving={saving} />}
        {activeTab === 'upload' && <SignatureUploadCard onSave={saveSignature} saving={saving} />}
        {activeTab === 'stamp' && <StampUploadCard onSave={saveSignature} saving={saving} />}
      </div>

      <SignaturesList
        signatures={signatures}
        onSetDefault={setDefault}
        onDelete={deleteSignature}
      />

      <SettingsFeedbackModal feedback={feedback} onClose={closeFeedback} />
    </div>
  );
};

export default GeneralSignaturesPage;
