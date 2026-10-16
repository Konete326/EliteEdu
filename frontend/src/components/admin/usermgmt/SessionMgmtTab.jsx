import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getApiBase } from '../../../utils/apiBase';
import SessionTopBar from './SessionTopBar';
import SessionsTable from './SessionsTable';
import ConfirmModal from '../../common/ConfirmModal';

const SessionMgmtTab = () => {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchIp, setSearchIp] = useState('');
  const [showRevoked, setShowRevoked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false);
  const [targetBlockSession, setTargetBlockSession] = useState(null);

  const fetchSessions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: '20', ip: searchIp, show_revoked: String(showRevoked) });
      const res = await fetch(`${getApiBase()}/user-management/sessions?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } finally {
      setLoading(false);
    }
  }, [token, page, searchIp, showRevoked]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleRevokeSingle = async (session) => {
    await fetch(`${getApiBase()}/user-management/sessions/${session._id}/revoke`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchSessions();
  };

  const handleRevokeUser = async (session) => {
    const userId = session.user_id?._id || session.user_id;
    await fetch(`${getApiBase()}/user-management/sessions/revoke-user/${userId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchSessions();
  };

  const handleRevokeAll = async () => {
    await fetch(`${getApiBase()}/user-management/sessions/revoke-all`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    setConfirmRevokeAll(false);
    fetchSessions();
  };

  const handleToggleBlock = async () => {
    if (!targetBlockSession) return;
    const ip = targetBlockSession.ip_address;
    if (targetBlockSession.is_blocked) {
      await fetch(`${getApiBase()}/user-management/sessions/block-ip/${encodeURIComponent(ip)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await fetch(`${getApiBase()}/user-management/sessions/block-ip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ip_address: ip, reason: 'Manual block from session manager' })
      });
    }
    setTargetBlockSession(null);
    fetchSessions();
  };

  return (
    <div className="space-y-4">
      <SessionTopBar
        searchIp={searchIp}
        setSearchIp={setSearchIp}
        showRevoked={showRevoked}
        setShowRevoked={setShowRevoked}
        onOpenRevokeAll={() => setConfirmRevokeAll(true)}
        onResetPage={() => setPage(1)}
      />

      <SessionsTable sessions={sessions} onRevokeSingle={handleRevokeSingle} onRevokeUser={handleRevokeUser} onToggleBlockIp={setTargetBlockSession} />

      <div className="flex items-center justify-between text-xs text-ink-muted px-1">
        <span>Showing {sessions.length > 0 ? (page - 1) * 20 + 1 : 0}–{Math.min(page * 20, total)} of {total} sessions</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer">Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer">Next</button>
        </div>
      </div>

      <ConfirmModal isOpen={confirmRevokeAll} onClose={() => setConfirmRevokeAll(false)} onConfirm={handleRevokeAll} title="Revoke All Sessions" message="Are you sure you want to terminate all active user sessions across the school?" confirmText="Revoke All" confirmStyle="danger" />
      <ConfirmModal isOpen={Boolean(targetBlockSession)} onClose={() => setTargetBlockSession(null)} onConfirm={handleToggleBlock} title={targetBlockSession?.is_blocked ? 'Unblock IP' : 'Block IP Address'} message={targetBlockSession?.is_blocked ? `Unblock IP ${targetBlockSession?.ip_address}?` : `Block IP ${targetBlockSession?.ip_address} and revoke active sessions?`} confirmText={targetBlockSession?.is_blocked ? 'Unblock' : 'Block IP'} confirmStyle={targetBlockSession?.is_blocked ? 'primary' : 'danger'} />
    </div>
  );
};

export default SessionMgmtTab;
