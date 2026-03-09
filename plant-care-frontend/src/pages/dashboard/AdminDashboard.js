import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { adminAPI } from '../../utils/api';

const PAGE_SIZE = 20;
const EXPORT_PAGE_SIZE = 300;

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [plants, setPlants] = useState([]);
  const [messages, setMessages] = useState([]);

  const [usersPage, setUsersPage] = useState(1);
  const [plantsPage, setPlantsPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);

  const [usersPagination, setUsersPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [plantsPagination, setPlantsPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [messagesPagination, setMessagesPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [overviewLoading, setOverviewLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [error, setError] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [messageDeletingId, setMessageDeletingId] = useState(null);
  const [bulkDeletingResolved, setBulkDeletingResolved] = useState(false);
  const [userActionLoadingId, setUserActionLoadingId] = useState(null);
  const [exportingType, setExportingType] = useState('');

  const [userQuery, setUserQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [plantQuery, setPlantQuery] = useState('');
  const [messageQuery, setMessageQuery] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState('all');

  const loading = overviewLoading || usersLoading || plantsLoading || messagesLoading;

  const fetchOverview = useCallback(async () => {
    try {
      setOverviewLoading(true);
      const response = await adminAPI.getOverview();
      setOverview(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin overview');
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const response = await adminAPI.getUsers({
        page: usersPage,
        limit: PAGE_SIZE,
        search: userQuery,
        status: userStatusFilter
      });
      setUsers(response.data.data || []);
      setUsersPagination(response.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  }, [userQuery, userStatusFilter, usersPage]);

  const fetchPlants = useCallback(async () => {
    try {
      setPlantsLoading(true);
      const response = await adminAPI.getPlants({
        page: plantsPage,
        limit: PAGE_SIZE,
        search: plantQuery
      });
      setPlants(response.data.data || []);
      setPlantsPagination(response.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load plants');
    } finally {
      setPlantsLoading(false);
    }
  }, [plantQuery, plantsPage]);

  const fetchMessages = useCallback(async () => {
    try {
      setMessagesLoading(true);
      const response = await adminAPI.getContactMessages({
        page: messagesPage,
        limit: PAGE_SIZE,
        search: messageQuery,
        status: messageStatusFilter
      });
      setMessages(response.data.data || []);
      setMessagesPagination(response.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contact messages');
    } finally {
      setMessagesLoading(false);
    }
  }, [messageQuery, messageStatusFilter, messagesPage]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    setUsersPage(1);
  }, [userQuery, userStatusFilter]);

  useEffect(() => {
    setPlantsPage(1);
  }, [plantQuery]);

  useEffect(() => {
    setMessagesPage(1);
  }, [messageQuery, messageStatusFilter]);

  const handleStatusUpdate = async (messageId, nextStatus) => {
    try {
      setStatusUpdatingId(messageId);
      await adminAPI.updateContactMessageStatus(messageId, nextStatus);
      await Promise.all([fetchMessages(), fetchOverview()]);
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
      await Promise.all([fetchMessages(), fetchOverview()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact message');
    } finally {
      setMessageDeletingId(null);
    }
  };

  const handleDeleteResolvedMessages = async () => {
    const confirmed = window.confirm('Delete all resolved messages? This cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      setBulkDeletingResolved(true);
      await adminAPI.deleteResolvedContactMessages();
      await Promise.all([fetchMessages(), fetchOverview()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resolved messages');
    } finally {
      setBulkDeletingResolved(false);
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
      await Promise.all([fetchUsers(), fetchOverview()]);
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
      await Promise.all([fetchUsers(), fetchPlants(), fetchOverview()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setUserActionLoadingId(null);
    }
  };

  const fetchAllPages = async (fetchFn, baseParams) => {
    let page = 1;
    let totalPages = 1;
    const allRows = [];

    while (page <= totalPages) {
      const response = await fetchFn({ ...baseParams, page, limit: EXPORT_PAGE_SIZE });
      const rows = response.data?.data || [];
      allRows.push(...rows);
      totalPages = response.data?.pagination?.totalPages || 1;
      page += 1;

      if (page > 200) {
        break;
      }
    }

    return allRows;
  };

  const exportCsv = (filename, rows) => {
    if (!rows.length) {
      setError('No records available for export.');
      return;
    }

    const csvRows = rows.map((row) =>
      row
        .map((cell) => {
          const stringValue = String(cell ?? '');
          const escaped = stringValue.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    );

    const csvContent = `\uFEFF${csvRows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportUsers = async () => {
    try {
      setExportingType('users');
      const allUsers = await fetchAllPages(adminAPI.getUsers, {
        search: userQuery,
        status: userStatusFilter
      });
      const rows = [
        ['Name', 'Email', 'Role', 'Blocked', 'Blocked Reason', 'Created At'],
        ...allUsers.map((item) => [
          item.name,
          item.email,
          item.role,
          item.isBlocked ? 'Yes' : 'No',
          item.blockReason || '',
          formatDate(item.createdAt)
        ])
      ];
      exportCsv('admin-users.csv', rows);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export users');
    } finally {
      setExportingType('');
    }
  };

  const exportPlants = async () => {
    try {
      setExportingType('plants');
      const allPlants = await fetchAllPages(adminAPI.getPlants, {
        search: plantQuery
      });
      const rows = [
        ['Nickname', 'Species', 'Category', 'Status', 'Owner Name', 'Owner Email', 'Created At'],
        ...allPlants.map((item) => [
          item.nickname,
          item.species,
          item.category,
          item.status,
          item.userId?.name || 'Unknown',
          item.userId?.email || 'Unknown',
          formatDate(item.createdAt)
        ])
      ];
      exportCsv('admin-plants.csv', rows);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export plants');
    } finally {
      setExportingType('');
    }
  };

  const exportMessages = async () => {
    try {
      setExportingType('messages');
      const allMessages = await fetchAllPages(adminAPI.getContactMessages, {
        search: messageQuery,
        status: messageStatusFilter
      });
      const rows = [
        ['Name', 'Email', 'Subject', 'Status', 'Created At', 'Message'],
        ...allMessages.map((item) => [
          item.name,
          item.email,
          item.subject,
          item.status,
          formatDate(item.createdAt),
          item.message
        ])
      ];
      exportCsv('admin-contact-messages.csv', rows);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export contact messages');
    } finally {
      setExportingType('');
    }
  };

  const messageSummary = useMemo(
    () => [
      { label: `New: ${overview?.messageStatusCounts?.new || 0}`, tone: 'red' },
      { label: `In Progress: ${overview?.messageStatusCounts?.inProgress || 0}`, tone: 'yellow' },
      { label: `Resolved: ${overview?.messageStatusCounts?.resolved || 0}`, tone: 'green' }
    ],
    [overview]
  );

  if (loading && !overview) {
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
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Operations Center</h1>
              <p className="text-white/85 text-sm sm:text-base mt-2">
                Monitor platform activity, manage users, and process contact workflows faster.
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

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InsightCard title="Last 7 Days" value={overview?.recentActivity?.usersLast7Days || 0} subtitle="New Users" />
            <InsightCard title="Last 7 Days" value={overview?.recentActivity?.plantsLast7Days || 0} subtitle="Plants Added" />
            <InsightCard title="Last 7 Days" value={overview?.recentActivity?.messagesLast7Days || 0} subtitle="Contact Messages" />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h2>
                <button
                  type="button"
                  disabled={exportingType === 'users'}
                  onClick={exportUsers}
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                >
                  {exportingType === 'users' ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <input
                  value={userQuery}
                  onChange={(event) => setUserQuery(event.target.value)}
                  placeholder="Search name or email"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                />
                <select
                  value={userStatusFilter}
                  onChange={(event) => setUserStatusFilter(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
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
              <Pagination
                page={usersPagination.page}
                totalPages={usersPagination.totalPages}
                total={usersPagination.total}
                onPageChange={setUsersPage}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Plants</h2>
                <button
                  type="button"
                  disabled={exportingType === 'plants'}
                  onClick={exportPlants}
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                >
                  {exportingType === 'plants' ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
              <input
                value={plantQuery}
                onChange={(event) => setPlantQuery(event.target.value)}
                placeholder="Search plant or owner"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 mb-3"
              />
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
              <Pagination
                page={plantsPagination.page}
                totalPages={plantsPagination.totalPages}
                total={plantsPagination.total}
                onPageChange={setPlantsPage}
              />
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Messages</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={exportingType === 'messages'}
                  onClick={exportMessages}
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                >
                  {exportingType === 'messages' ? 'Exporting...' : 'Export CSV'}
                </button>
                <button
                  type="button"
                  disabled={bulkDeletingResolved}
                  onClick={handleDeleteResolvedMessages}
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                >
                  {bulkDeletingResolved ? 'Deleting...' : 'Delete Resolved'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              <input
                value={messageQuery}
                onChange={(event) => setMessageQuery(event.target.value)}
                placeholder="Search message, subject, sender"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
              />
              <select
                value={messageStatusFilter}
                onChange={(event) => setMessageStatusFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {messageSummary.map((item) => (
                <Pill key={item.label} label={item.label} tone={item.tone} />
              ))}
            </div>

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
                        {item.name} ({item.email}) • {formatDate(item.createdAt)}
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
            <Pagination
              page={messagesPagination.page}
              totalPages={messagesPagination.totalPages}
              total={messagesPagination.total}
              onPageChange={setMessagesPage}
            />
          </section>
        </div>
      </div>
    </Layout>
  );
};

const formatDate = (rawDate) => {
  if (!rawDate) {
    return '';
  }
  return new Date(rawDate).toLocaleString();
};

const StatCard = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
  </div>
);

const InsightCard = ({ title, value, subtitle }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
  </div>
);

const Pill = ({ label, tone }) => {
  const classes = {
    red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
  };

  return <span className={`text-xs font-medium px-2 py-1 rounded-full ${classes[tone]}`}>{label}</span>;
};

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

const Pagination = ({ page, totalPages, total, onPageChange }) => {
  if (!total || totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">Total {total}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200"
        >
          Prev
        </button>
        <span className="text-xs text-gray-600 dark:text-gray-300">
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const EmptyText = ({ text }) => <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{text}</p>;

export default AdminDashboard;
