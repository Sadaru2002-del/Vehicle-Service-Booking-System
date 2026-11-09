import React, { useState, useEffect } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Check, 
  X, 
  TrendingUp,
  Car,
  User,
  Phone,
  FolderKanban,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    today: 0
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected booking modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch metrics & bookings
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch metrics
      const metricsRes = await api.get('/bookings/metrics/summary');
      if (metricsRes.data.success) {
        setMetrics(metricsRes.data.metrics);
      }

      // 2. Fetch bookings with current filters
      let queryParams = [];
      if (statusFilter && statusFilter !== 'All') queryParams.push(`status=${encodeURIComponent(statusFilter)}`);
      if (dateFilter) queryParams.push(`date=${encodeURIComponent(dateFilter)}`);
      if (searchQuery.trim()) queryParams.push(`search=${encodeURIComponent(searchQuery.trim())}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const bookingsRes = await api.get(`/bookings${queryString}`);

      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to update dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleResetFilters = () => {
    setStatusFilter('All');
    setDateFilter('');
    setSearchQuery('');
  };

  // Update Status handler
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Booking set to "${newStatus}"`);
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
        // Refresh metrics
        const metricsRes = await api.get('/bookings/metrics/summary');
        if (metricsRes.data.success) setMetrics(metricsRes.data.metrics);

        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Delete Booking handler
  const handleDeleteBooking = async (id) => {
    try {
      const res = await api.delete(`/bookings/${id}`);
      if (res.data.success) {
        toast.success('Booking deleted successfully');
        setBookings((prev) => prev.filter((b) => b._id !== id));
        setDeleteConfirmId(null);
        if (selectedBooking && selectedBooking._id === id) setSelectedBooking(null);
        // Refresh metrics
        const metricsRes = await api.get('/bookings/metrics/summary');
        if (metricsRes.data.success) setMetrics(metricsRes.data.metrics);
      }
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Approved
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Completed
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-purple-700" />
            Admin Operations Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time appointment schedule, customer bookings, and workshop workflow management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <FolderKanban className="w-4 h-4 text-purple-600" />
            Manage Categories
          </Link>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Row (Total, Pending, Approved, Completed, Today) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Total */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Bookings</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {metrics.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">All recorded entries</div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase tracking-wider">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            {metrics.pending}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-1">Requires review</div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-2xl p-5 border border-purple-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-700 text-xs font-semibold uppercase tracking-wider">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 mt-2">
            {metrics.approved}
          </div>
          <div className="text-[11px] text-purple-600/80 mt-1">Ready for servicing</div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {metrics.completed}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1">Finished services</div>
        </div>

        {/* Today */}
        <div className="bg-gradient-to-br from-purple-900 to-fuchsia-900 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-purple-200 text-xs font-semibold uppercase tracking-wider">
            <span>Daily Bookings</span>
            <Calendar className="w-4 h-4 text-purple-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {metrics.today}
          </div>
          <div className="text-[11px] text-purple-200 mt-1">Scheduled for today</div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
            {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search & Date Filter Form */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Date Picker */}
            <div className="w-full sm:w-auto relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-44 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none bg-white"
                title="Filter by appointment date"
              />
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Customer, vehicle, or phone..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-colors"
              >
                Search
              </button>
            </form>

            {(statusFilter !== 'All' || dateFilter || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-500 hover:text-purple-700 font-semibold underline underline-offset-2 whitespace-nowrap"
              >
                Reset
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            Appointments List ({bookings.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Showing latest requests first
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">Loading appointments...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Car className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No appointments found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or date selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Vehicle Plate</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Scheduled Date & Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Status Action</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-purple-50/30 transition-colors">
                    
                    {/* Vehicle */}
                    <td className="py-3.5 px-4 font-bold text-purple-900 tracking-wide">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-purple-500 shrink-0" />
                        <span>{b.vehicleNumber}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{b.customerName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {b.phone}
                      </div>
                    </td>

                    {/* Service & Price */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div className="font-semibold text-slate-800">{b.serviceType}</div>
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                        {b.priceEstimate || 'Contact for quote'}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{b.date}</div>
                      <div className="text-xs text-purple-700 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {b.time}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>

                    {/* Quick Status Control Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        
                        {/* Approve Button */}
                        {b.status !== 'Approved' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Approved')}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
                            title="Approve Booking"
                          >
                            Approve
                          </button>
                        )}

                        {/* Complete Button */}
                        {b.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Completed')}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}

                        {/* Reject Button */}
                        {b.status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Rejected')}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                            title="Reject Booking"
                          >
                            Reject
                          </button>
                        )}

                      </div>
                    </td>

                    {/* Action icons (View & Delete) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(b._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-scaleIn">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  Appointment Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500">Current Status:</span>
                <div>{getStatusBadge(selectedBooking.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Vehicle Number</span>
                  <span className="font-bold text-purple-900">{selectedBooking.vehicleNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Service Type</span>
                  <span className="font-bold text-slate-800">{selectedBooking.serviceType}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Service Fee (LKR)</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                    {selectedBooking.priceEstimate || 'Contact for quote'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Customer Name</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Contact Number</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Appointment Date</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.date}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Time Slot</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.time}</span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                  <span className="text-xs text-purple-900 font-bold block mb-1">Customer Notes:</span>
                  <p className="text-slate-700 text-xs italic">{selectedBooking.notes}</p>
                </div>
              )}

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Created: {new Date(selectedBooking.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Quick Status updates inside modal */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Update Status
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'Approved')}
                  className="py-2 text-xs font-bold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'Completed')}
                  className="py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'Rejected')}
                  className="py-2 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                >
                  Reject
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Confirm Delete Booking?
            </h3>
            <p className="text-xs text-slate-500">
              This action cannot be undone. The booking record will be permanently deleted from the database.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBooking(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

