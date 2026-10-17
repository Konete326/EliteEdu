import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationComposerCard from '../../components/common/notifications/NotificationComposerCard';
import NotificationStatsSidebar from '../../components/common/notifications/NotificationStatsSidebar';
import NotificationFeedList from '../../components/common/notifications/NotificationFeedList';
import ConfirmModal from '../../components/common/ConfirmModal';

const NotificationsPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';

  const {
    notifications, campuses, total, unreadCount, page, totalPages, loading,
    search, setSearch, category, setCategory, unreadOnly, setUnreadOnly,
    deleteTarget, setDeleteTarget, setPage, loadNotifications, toggleRead,
    markAllRead, confirmDelete
  } = useNotifications(token, isAdmin);

  const urgentCount = notifications.filter((n) => n.priority === 'Urgent').length;

  return (
    <div className="w-full space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-ink dark:text-ink-dark tracking-tight">Notification Center & Broadcasts</h1>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">Institutional announcements, academic alerts, and real-time campus broadcasts.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-4 space-y-4">
          {isAdmin ? (
            <NotificationComposerCard campuses={campuses} token={token} onCreated={() => { setPage(1); loadNotifications(); }} />
          ) : (
            <NotificationStatsSidebar total={total} unreadCount={unreadCount} urgentCount={urgentCount} activeCategory={category} onSelectCategory={(c) => { setCategory(c); setPage(1); }} />
          )}
        </div>

        <div className="xl:col-span-8">
          <NotificationFeedList
            notifications={notifications}
            loading={loading}
            search={search}
            setSearch={(s) => { setSearch(s); setPage(1); }}
            category={category}
            setCategory={(c) => { setCategory(c); setPage(1); }}
            unreadOnly={unreadOnly}
            setUnreadOnly={(u) => { setUnreadOnly(u); setPage(1); }}
            unreadCount={unreadCount}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            isAdmin={isAdmin}
            onToggleRead={toggleRead}
            onDelete={setDeleteTarget}
            onNavigate={(url) => navigate(url)}
            onMarkAllRead={markAllRead}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Notification"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete"
        confirmStyle="danger"
      />
    </div>
  );
};

export default NotificationsPage;
