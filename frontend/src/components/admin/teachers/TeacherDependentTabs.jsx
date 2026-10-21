import { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  Plus,
  Trash2,
  TrendingUp,
  MessageSquare,
  ShieldAlert,
  Wallet,
  Clock,
  Laptop,
  Smartphone,
  Pencil,
  X,
  CheckCircle2,
  Calendar,
  AlertCircle,
  RefreshCw,
  LogOut,
  Loader2
} from 'lucide-react';
import DocumentUploadList from '../../common/DocumentUploadList';
import api from '../../../services/api';
import { emitToastSuccess, emitToastError } from '../../../utils/toastEvents';

const TAB_TITLES = {
  security_deposit: 'Security Deposits Ledger',
  increment_history: 'Salary Increment History',
  loan_advance: 'Loans & Advances Ledger',
  follow_up: 'Staff Follow-up & Appraisal Log',
  documents: 'Documents Repository',
  active_sessions: 'Active Login Sessions'
};

const INCREMENT_TYPES = [
  'Annual Appraisal',
  'Performance Bonus',
  'Scale / BPS Promotion',
  'Cost of Living Adjustment',
  'Probation Completion',
  'Other Adjustment'
];

const FOLLOWUP_TYPES = [
  'Classroom Observation',
  'Academic Performance Review',
  'Parent Feedback / Meeting',
  'Formal Warning / Notice',
  'Professional Development Counseling',
  'General Administration'
];

const TeacherDependentTabs = ({
  activeTab,
  teacherId,
  formData,
  onSaveNow,
  onUpdateField
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [incAmount, setIncAmount] = useState('');
  const [incNewSalary, setIncNewSalary] = useState('');
  const [incDate, setIncDate] = useState(new Date().toISOString().slice(0, 10));
  const [incType, setIncType] = useState('Annual Appraisal');
  const [incReason, setIncReason] = useState('');
  const [incApprovedBy, setIncApprovedBy] = useState('Principal');

  const [folDate, setFolDate] = useState(new Date().toISOString().slice(0, 10));
  const [folType, setFolType] = useState('Classroom Observation');
  const [folRemarks, setFolRemarks] = useState('');
  const [folNextDate, setFolNextDate] = useState('');
  const [folStatus, setFolStatus] = useState('Completed');
  const [folLoggedBy, setFolLoggedBy] = useState('Headmaster / Incharge');

  const [finAmount, setFinAmount] = useState('');
  const [finDate, setFinDate] = useState(new Date().toISOString().slice(0, 10));
  const [finReason, setFinReason] = useState('');
  const [finReceipt, setFinReceipt] = useState('');

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const title = TAB_TITLES[activeTab] || 'Tab Details';

  if (!teacherId) {
    return (
      <div className="p-12 text-center rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-xs space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-ink dark:text-white">
          Save staff record to unlock {title}
        </h3>
        <p className="text-xs text-ink-muted max-w-md mx-auto">
          Basic profile information must be created in the database before attaching {title.toLowerCase()}.
        </p>
        <button
          type="button"
          onClick={onSaveNow}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          Save Basic Profile Now
        </button>
      </div>
    );
  }

  if (activeTab === 'documents') {
    return (
      <DocumentUploadList
        documents={formData.documents || []}
        onChange={(docs) => onUpdateField('documents', docs)}
        title="Teacher Documents Repository"
      />
    );
  }

  const increments = formData.increments || [];
  const followUps = formData.follow_ups || [];
  const securityDeposits = formData.security_deposits || [];
  const loans = formData.loans || [];

  const handleOpenAdd = () => {
    setEditIndex(null);
    setIncAmount('');
    setIncNewSalary('');
    setIncDate(new Date().toISOString().slice(0, 10));
    setIncType('Annual Appraisal');
    setIncReason('');
    setIncApprovedBy('Principal');

    setFolDate(new Date().toISOString().slice(0, 10));
    setFolType('Classroom Observation');
    setFolRemarks('');
    setFolNextDate('');
    setFolStatus('Completed');
    setFolLoggedBy('Headmaster / Incharge');

    setFinAmount('');
    setFinDate(new Date().toISOString().slice(0, 10));
    setFinReason('');
    setFinReceipt('');

    setModalOpen(true);
  };

  const handleSaveIncrement = () => {
    if (!incAmount || Number(incAmount) <= 0) return;
    const item = {
      amount: Number(incAmount),
      new_salary: Number(incNewSalary) || 0,
      effective_date: incDate,
      type: incType,
      reason: incReason.trim() || 'Standard increment',
      approved_by: incApprovedBy.trim() || 'Principal'
    };

    if (editIndex !== null) {
      const copy = [...increments];
      copy[editIndex] = item;
      onUpdateField('increments', copy);
    } else {
      onUpdateField('increments', [...increments, item]);
    }
    setModalOpen(false);
  };

  const handleSaveFollowUp = () => {
    if (!folRemarks.trim()) return;
    const item = {
      date: folDate,
      type: folType,
      remarks: folRemarks.trim(),
      next_review_date: folNextDate || null,
      status: folStatus,
      logged_by: folLoggedBy.trim() || 'Administrator'
    };

    if (editIndex !== null) {
      const copy = [...followUps];
      copy[editIndex] = item;
      onUpdateField('follow_ups', copy);
    } else {
      onUpdateField('follow_ups', [...followUps, item]);
    }
    setModalOpen(false);
  };

  const handleSaveFinancial = (field) => {
    if (!finAmount || Number(finAmount) <= 0) return;
    const currentList = formData[field] || [];
    const item = {
      amount: Number(finAmount),
      date: finDate,
      reason: finReason.trim() || 'Approved transaction',
      receipt_no: finReceipt.trim() || 'N/A'
    };

    if (editIndex !== null) {
      const copy = [...currentList];
      copy[editIndex] = item;
      onUpdateField(field, copy);
    } else {
      onUpdateField(field, [...currentList, item]);
    }
    setModalOpen(false);
  };

  const fetchSessions = useCallback(async (uid) => {
    if (!uid) return;
    setLoadingSessions(true);
    try {
      const res = await api.get(`/user-mgmt/sessions?user_id=${uid}&show_revoked=true`);
      if (res.data?.success && Array.isArray(res.data?.sessions)) {
        setSessions(res.data.sessions);
      } else {
        setSessions([]);
      }
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'active_sessions' && teacherId) {
      fetchSessions(teacherId);
    }
  }, [activeTab, teacherId, fetchSessions]);

  const handleConfirmRevoke = async () => {
    if (!confirmAction) return;
    setRevoking(true);
    try {
      if (confirmAction.type === 'single') {
        const res = await api.patch(`/user-mgmt/sessions/${confirmAction.id}/revoke`);
        if (res.data?.success) {
          emitToastSuccess('Session revoked successfully. Device logged out.');
        }
      } else if (confirmAction.type === 'all') {
        const res = await api.post(`/user-mgmt/sessions/revoke-user/${teacherId}`);
        if (res.data?.success) {
          emitToastSuccess(res.data.message || 'All sessions revoked. All devices logged out.');
        }
      }
      await fetchSessions(teacherId);
      setConfirmAction(null);
    } catch (err) {
      emitToastError(err.response?.data?.message || 'Failed to revoke session');
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/20">
            {activeTab === 'increment_history' ? (
              <TrendingUp className="w-5 h-5" />
            ) : activeTab === 'follow_up' ? (
              <MessageSquare className="w-5 h-5" />
            ) : activeTab === 'active_sessions' ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <Wallet className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-white">{title}</h3>
            <p className="text-[11px] text-ink-muted">
              {activeTab === 'increment_history'
                ? `${increments.length} salary revision(s) recorded`
                : activeTab === 'follow_up'
                ? `${followUps.length} follow-up logs registered`
                : activeTab === 'active_sessions'
                ? `${sessions.length} active login session(s)`
                : 'Personnel financial records'}
            </p>
          </div>
        </div>

        {activeTab === 'active_sessions' ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchSessions(teacherId)}
              disabled={loadingSessions}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-[#141414] text-ink dark:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSessions ? 'animate-spin text-primary' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmAction({
                type: 'all',
                title: 'Revoke All Remote Sessions',
                message: 'Are you sure you want to terminate all active sessions for this teacher? All logged-in devices (phones, tablets, PCs) will be immediately logged out.'
              })}
              disabled={loadingSessions || sessions.filter((s) => s.status === 'Active').length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bad hover:bg-bad/90 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Revoke All Devices</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === 'increment_history'
                ? 'Add Increment'
                : activeTab === 'follow_up'
                ? 'Log Follow-up'
                : 'Add Record'}
            </span>
          </button>
        )}
      </div>

      {activeTab === 'increment_history' && (
        increments.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <TrendingUp className="w-10 h-10 text-ink-muted/40 mx-auto" />
            <p className="text-xs font-bold text-ink dark:text-white">No salary increments recorded</p>
            <p className="text-[11px] text-ink-muted max-w-sm mx-auto">
              Record annual evaluations, bonuses, and scale upgrade revisions for this teacher.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line dark:border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 dark:bg-[#141414] text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-line dark:border-white/10">
                <tr>
                  <th className="px-4 py-3">Effective Date</th>
                  <th className="px-4 py-3">Revision Type</th>
                  <th className="px-4 py-3">Increment Amount</th>
                  <th className="px-4 py-3">New Gross Salary</th>
                  <th className="px-4 py-3">Reason / Remarks</th>
                  <th className="px-4 py-3">Approved By</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 dark:divide-white/5 bg-surface dark:bg-[#0c0c0c]">
                {increments.map((inc, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/40 dark:hover:bg-[#141414] transition-colors">
                    <td className="px-4 py-3 font-semibold text-ink dark:text-white whitespace-nowrap">
                      {inc.effective_date || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        {inc.type || 'Annual Revision'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-good">
                      +PKR {Number(inc.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-ink dark:text-white">
                      {inc.new_salary ? `PKR ${Number(inc.new_salary).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-ink-muted truncate max-w-[200px]">
                      {inc.reason || '—'}
                    </td>
                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                      {inc.approved_by || 'Management'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateField('increments', increments.filter((_, i) => i !== idx));
                        }}
                        className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-bad-soft text-bad cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {activeTab === 'follow_up' && (
        followUps.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-ink-muted/40 mx-auto" />
            <p className="text-xs font-bold text-ink dark:text-white">No follow-up records found</p>
            <p className="text-[11px] text-ink-muted max-w-sm mx-auto">
              Track classroom observations, parent discussions, appraisals, and review meetings.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line dark:border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 dark:bg-[#141414] text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-line dark:border-white/10">
                <tr>
                  <th className="px-4 py-3">Log Date</th>
                  <th className="px-4 py-3">Follow-up Type</th>
                  <th className="px-4 py-3">Discussion / Notes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Next Review</th>
                  <th className="px-4 py-3">Logged By</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 dark:divide-white/5 bg-surface dark:bg-[#0c0c0c]">
                {followUps.map((fol, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/40 dark:hover:bg-[#141414] transition-colors">
                    <td className="px-4 py-3 font-semibold text-ink dark:text-white whitespace-nowrap">
                      {fol.date || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        {fol.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted max-w-[240px] truncate" title={fol.remarks}>
                      {fol.remarks}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        fol.status === 'Completed'
                          ? 'bg-good/10 text-good border border-good/20'
                          : 'bg-accent/10 text-accent border border-accent/20'
                      }`}>
                        {fol.status || 'Completed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap font-mono text-[11px]">
                      {fol.next_review_date || 'None'}
                    </td>
                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                      {fol.logged_by || 'Admin'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateField('follow_ups', followUps.filter((_, i) => i !== idx));
                        }}
                        className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-bad-soft text-bad cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {activeTab === 'active_sessions' && (
        loadingSessions ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-xs text-ink-muted font-medium">Loading active sessions from security ledger...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-xl border border-dashed border-line dark:border-white/10 bg-surface/50 dark:bg-[#0c0c0c]/50">
            <ShieldAlert className="w-10 h-10 text-ink-muted/40 mx-auto" />
            <h4 className="text-sm font-bold text-ink dark:text-white">No Active Sessions</h4>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              This staff member has no active login sessions registered in the system.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line dark:border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 dark:bg-[#141414] text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-line dark:border-white/10">
                <tr>
                  <th className="px-4 py-3">Device &amp; OS</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Login Time</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Security Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 dark:divide-white/5 bg-surface dark:bg-[#0c0c0c]">
                {sessions.map((sess) => {
                  const isMobile = /android|iphone|ipad|ios/i.test(sess.device || '');
                  const isActive = sess.status === 'Active';
                  return (
                    <tr key={sess._id} className="hover:bg-surface-secondary/40 dark:hover:bg-[#141414] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isMobile ? (
                            <Smartphone className="w-4 h-4 text-primary shrink-0" />
                          ) : (
                            <Laptop className="w-4 h-4 text-primary shrink-0" />
                          )}
                          <div>
                            <span className="font-bold text-ink dark:text-white block">{sess.device || 'Unknown Device'}</span>
                            <span className="text-[10px] font-mono text-ink-muted">ID: {sess._id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-mono text-ink dark:text-white font-semibold">{sess.ip_address || '—'}</p>
                          {sess.is_suspicious && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <AlertCircle className="w-2.5 h-2.5" />
                              New Location
                            </span>
                          )}
                        </div>
                        {sess.is_blocked && (
                          <span className="inline-block mt-0.5 text-[9px] font-bold text-bad bg-bad/10 px-1.5 py-0.5 rounded">IP Blocked</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                        {sess.createdAt ? new Date(sess.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                        {sess.last_active ? new Date(sess.last_active).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {isActive ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-good/10 text-good border border-good/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse" />
                              Active Session
                            </span>
                            {sess.is_suspicious && (
                              <span className="block text-[9px] font-bold text-amber-600 dark:text-amber-400">
                                ⚠️ Alert: Changed IP
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-ink-muted/10 text-ink-muted border border-ink-muted/20">
                            Revoked / Blacklisted
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isActive ? (
                          <button
                            type="button"
                            onClick={() => setConfirmAction({
                              type: 'single',
                              id: sess._id,
                              title: 'Revoke Device Session',
                              message: `Are you sure you want to revoke the session on "${sess.device || 'this device'}"? The user will be immediately logged out on that device.`
                            })}
                            className="px-2.5 py-1 rounded-lg border border-bad/30 text-bad hover:bg-bad-soft text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Revoke
                          </button>
                        ) : (
                          <span className="text-[11px] text-ink-muted font-semibold italic">Terminated</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {(activeTab === 'security_deposit' || activeTab === 'loan_advance') && (
        (() => {
          const field = activeTab === 'security_deposit' ? 'security_deposits' : 'loans';
          const items = formData[field] || [];
          return items.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Wallet className="w-10 h-10 text-ink-muted/40 mx-auto" />
              <p className="text-xs font-bold text-ink dark:text-white">No ledger entries</p>
              <p className="text-[11px] text-ink-muted max-w-sm mx-auto">
                No financial records registered under {title}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-line dark:border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-secondary/70 dark:bg-[#141414] text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-line dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Receipt / Ref</th>
                    <th className="px-4 py-3">Reason / Details</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60 dark:divide-white/5 bg-surface dark:bg-[#0c0c0c]">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-secondary/40 dark:hover:bg-[#141414] transition-colors">
                      <td className="px-4 py-3 font-semibold text-ink dark:text-white">{item.date || '—'}</td>
                      <td className="px-4 py-3 font-mono font-bold text-primary">PKR {Number(item.amount).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-ink-muted">{item.receipt_no || '—'}</td>
                      <td className="px-4 py-3 text-ink-muted">{item.reason || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onUpdateField(field, items.filter((_, i) => i !== idx))}
                          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-bad-soft text-bad cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface dark:bg-[#111111] border border-line dark:border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden animate-in fade-in duration-150">
            <div className="p-4 border-b border-line dark:border-white/10 flex items-center justify-between">
              <h4 className="font-bold text-sm text-ink dark:text-white">
                {activeTab === 'increment_history'
                  ? 'Add Salary Revision / Increment'
                  : activeTab === 'follow_up'
                  ? 'Log Personnel Follow-up'
                  : 'Add Ledger Transaction'}
              </h4>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {activeTab === 'increment_history' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        Increment Amount (PKR) *
                      </label>
                      <input
                        type="number"
                        value={incAmount}
                        onChange={(e) => setIncAmount(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-mono font-bold text-ink dark:text-white outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        New Gross Salary (PKR)
                      </label>
                      <input
                        type="number"
                        value={incNewSalary}
                        onChange={(e) => setIncNewSalary(e.target.value)}
                        placeholder="e.g. 65000"
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-mono font-bold text-ink dark:text-white outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        Effective Date *
                      </label>
                      <input
                        type="date"
                        value={incDate}
                        onChange={(e) => setIncDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-medium text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        Revision Type *
                      </label>
                      <select
                        value={incType}
                        onChange={(e) => setIncType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-semibold text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
                      >
                        {INCREMENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                      Reason / Appraisal Remarks
                    </label>
                    <textarea
                      rows={2}
                      value={incReason}
                      onChange={(e) => setIncReason(e.target.value)}
                      placeholder="e.g. Excellent student board exam results and positive parent feedback"
                      className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs text-ink dark:text-white outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                      Approved By
                    </label>
                    <input
                      type="text"
                      value={incApprovedBy}
                      onChange={(e) => setIncApprovedBy(e.target.value)}
                      placeholder="e.g. Principal / Managing Director"
                      className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs text-ink dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                </>
              )}

              {activeTab === 'follow_up' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        Log Date *
                      </label>
                      <input
                        type="date"
                        value={folDate}
                        onChange={(e) => setFolDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-medium text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        Follow-up Type *
                      </label>
                      <select
                        value={folType}
                        onChange={(e) => setFolType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-semibold text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
                      >
                        {FOLLOWUP_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                      Discussion / Remarks *
                    </label>
                    <textarea
                      rows={3}
                      value={folRemarks}
                      onChange={(e) => setFolRemarks(e.target.value)}
                      placeholder="Write observation notes, teacher strengths, or improvement advice..."
                      className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs text-ink dark:text-white outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        Status
                      </label>
                      <select
                        value={folStatus}
                        onChange={(e) => setFolStatus(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-semibold text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="Completed">Completed</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Pending Follow-up">Pending Follow-up</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        Next Review Date
                      </label>
                      <input
                        type="date"
                        value={folNextDate}
                        onChange={(e) => setFolNextDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-medium text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                      Logged By
                    </label>
                    <input
                      type="text"
                      value={folLoggedBy}
                      onChange={(e) => setFolLoggedBy(e.target.value)}
                      placeholder="e.g. Academic Coordinator / Headmaster"
                      className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs text-ink dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                </>
              )}

              {(activeTab === 'security_deposit' || activeTab === 'loan_advance') && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        Amount (PKR) *
                      </label>
                      <input
                        type="number"
                        value={finAmount}
                        onChange={(e) => setFinAmount(e.target.value)}
                        placeholder="e.g. 15000"
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-mono font-bold text-ink dark:text-white outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                        Transaction Date *
                      </label>
                      <input
                        type="date"
                        value={finDate}
                        onChange={(e) => setFinDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-medium text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                      Receipt / Reference No
                    </label>
                    <input
                      type="text"
                      value={finReceipt}
                      onChange={(e) => setFinReceipt(e.target.value)}
                      placeholder="e.g. REC-2024-009"
                      className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs font-mono text-ink dark:text-white outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                      Purpose / Note
                    </label>
                    <input
                      type="text"
                      value={finReason}
                      onChange={(e) => setFinReason(e.target.value)}
                      placeholder="Reason or deduction term"
                      className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs text-ink dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-line dark:border-white/10 flex items-center justify-end gap-2 bg-surface-secondary/20">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-muted hover:bg-surface-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'increment_history') handleSaveIncrement();
                  else if (activeTab === 'follow_up') handleSaveFollowUp();
                  else if (activeTab === 'security_deposit') handleSaveFinancial('security_deposits');
                  else if (activeTab === 'loan_advance') handleSaveFinancial('loans');
                }}
                className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-surface dark:bg-[#121212] border border-line dark:border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-bad/10 text-bad flex items-center justify-center shrink-0 border border-bad/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink dark:text-white">{confirmAction.title}</h4>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">{confirmAction.message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                disabled={revoking}
                className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold hover:bg-surface-secondary dark:hover:bg-[#1a1a1a] text-ink dark:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                disabled={revoking}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bad hover:bg-bad/90 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {revoking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                <span>Confirm Revoke</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDependentTabs;