import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { adminAPI } from '../../utils/api';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [plants, setPlants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [messageDeletingId, setMessageDeletingId] = useState(null);
  const [userActionLoadingId, setUserActionLoadingId] = useState(null);

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [overviewRes, usersRes, plantsRes, messagesRes] = await Promise.all([
        adminAPI.getOverview(),
        adminAPI.getUsers(100),
        adminAPI.getPlants(100),
        adminAPI.getContactMessages(100)
      ]);

      setOverview(overviewRes.data.data);
      setUsers(usersRes.data.data || []);
      setPlants(plantsRes.data.data || []);
      setMessages(messagesRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleStatusUpdate = async (messageId, nextStatus) => {
    try {
      setStatusUpdatingId(messageId);
      await adminAPI.updateContactMessageStatus(messageId, nextStatus);
      setMessages((prev) =>
        prev.map((item) =>
          item._id === messageId
            ? {
                ...item,
                status: nextStatus,
                reviewedAt: new Date().toISOString()
              }
            : item
        )
      );
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDeleteMessage = async (message) => {
    if (message.status !== 'resolved') {
      setError('Only resolved messages can be deleted.');
      return;
    }

    const confirmed = window.confirm(`Delete resolved message: ${message.subject}?`);
    if (!confirmed) {
      return;
    }

    try {
      setMessageDeletingId(message._id);
      await adminAPI.deleteContactMessage(message._id);
      setMessages((prev) => prev.filter((item) => item._id !== message._id));
      setOverview((prev) => {
        if (!prev?.totals) {
          return prev;
        }
        return {
          ...prev,
          totals: {
            ...prev.totals,
            contactMessages: Math.max((prev.totals.contactMessages || 0) - 1, 0)
          }
        };
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact message');
    } finally {
      setMessageDeletingId(null);
    }
  };

  const handleToggleBlockUser = async (targetUser) => {
    const nextBlockedState = !targetUser.isBlocked;
    const actionLabel = nextBlockedState ? 'block' : 'unblock';
    const confirmed = window.confirm(`Are you sure you want to ${actionLabel} ${targetUser.email}?`);
    if (!confirmed) {
      return;
    }

    let reason = '';
    if (nextBlockedState) {
      reason = window.prompt('Optional block reason (shown only in admin records):', '') || '';
    }

    try {
      setUserActionLoadingId(targetUser._id);
      await adminAPI.updateUserBlockStatus(targetUser._id, nextBlockedState, reason);
      setUsers((prev) =>
        prev.map((item) =>
          item._id === targetUser._id
            ? {
                ...item,
                isBlocked: nextBlockedState,
                blockedAt: nextBlockedState ? new Date().toISOString() : null,
                blockReason: nextBlockedState ? reason : ''
              }
            : item
        )
      );
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user block status');
    } finally {
      setUserActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    const confirmed = window.confirm(
      `Delete user ${targetUser.email}? This will permanently remove their plants, care logs, and push subscriptions.`
    );
    if (!confirmed) {
      return;
    }

    try {
      setUserActionLoadingId(targetUser._id);
      await adminAPI.deleteUser(targetUser._id);
      setUsers((prev) => prev.filter((item) => item._id !== targetUser._id));
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setUserActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-white/85 text-sm sm:text-base mt-2">
                Manage users, platform records, and contact messages from one place.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-4">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <section className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <StatCard label="Users" value={overview?.totals?.users || 0} />
            <StatCard label="Admins" value={overview?.totals?.admins || 0} />
            <StatCard label="Blocked" value={overview?.totals?.blockedUsers || 0} />
            <StatCard label="Plants" value={overview?.totals?.plants || 0} />
            <StatCard label="Care Logs" value={overview?.totals?.careLogs || 0} />
            <StatCard label="Messages" value={overview?.totals?.contactMessages || 0} />
            <StatCard label="New" value={overview?.totals?.unreadContactMessages || 0} />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Latest Users</h2>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 pr-1">
                {users.length === 0 && <EmptyText text="No users found." />}
                {users.map((item) => (
                  <div key={item._id} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{item.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Role: <span className="font-medium">{item.role || 'user'}</span>
                        </p>
                        {item.isBlocked && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Blocked {item.blockReason ? `(${item.blockReason})` : ''}
                          </p>
                        )}
                      </div>

                      {item.role !== 'admin' && (
                        <div className="flex flex-col gap-2 w-[106px]">
                          <button
                            type="button"
                            disabled={userActionLoadingId === item._id}
                            onClick={() => handleToggleBlockUser(item)}
                            className={`text-xs font-medium rounded-md px-2 py-1.5 transition-colors ${
                              item.isBlocked
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            }`}
                          >
                            {item.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            type="button"
                            disabled={userActionLoadingId === item._id}
                            onClick={() => handleDeleteUser(item)}
                            className="text-xs font-medium rounded-md px-2 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Latest Plants</h2>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 pr-1">
                {plants.length === 0 && <EmptyText text="No plants found." />}
                {plants.map((item) => (
                  <div key={item._id} className="py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.nickname} ({item.species})
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Owner: {item.userId?.name || 'Unknown'} ({item.userId?.email || 'No email'})
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Status: <span className="font-medium">{item.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Messages</h2>
            <div className="max-h-[30rem] overflow-y-auto space-y-3 pr-1">
              {messages.length === 0 && <EmptyText text="No contact messages found." />}
              {messages.map((item) => (
                <article
                  key={item._id}
                  className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/30"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.subject}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {item.name} ({item.email})
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <select
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        value={item.status}
                        disabled={statusUpdatingId === item._id}
                        onChange={(event) => handleStatusUpdate(item._id, event.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button
                        type="button"
                        disabled={messageDeletingId === item._id || item.status !== 'resolved'}
                        onClick={() => handleDeleteMessage(item)}
                        className={`text-xs font-medium rounded-md px-2 py-1.5 transition-colors ${
                          item.status === 'resolved'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 mt-3 whitespace-pre-wrap">{item.message}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const classes = {
    new: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${classes[status] || classes.new}`}>
      {status || 'new'}
    </span>
  );
};

const EmptyText = ({ text }) => <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{text}</p>;

export default AdminDashboard;
