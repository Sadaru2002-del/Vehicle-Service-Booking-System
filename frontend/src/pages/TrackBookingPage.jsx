import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { 
  Search, 
  Car, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  XCircle, 
  Hourglass, 
  AlertCircle,
  FileText,
  Wrench,
  Phone
} from 'lucide-react';

const TrackBookingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchVal) => {
    const q = (searchVal !== undefined ? searchVal : query).trim();
    if (!q) {
      toast.error('Please enter a Vehicle Number, Phone, or Booking ID');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/bookings/track/search?query=${encodeURIComponent(q)}`);
      if (res.data.success) {
        setResults(res.data.bookings);
        if (res.data.bookings.length === 0) {
          toast('No bookings found matching your search', { icon: '🔍' });
        }
      }
    } catch (error) {
      console.error('Tracking search error:', error);
      toast.error('Failed to search bookings. Please verify your query.');
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ query: query.trim() });
    handleSearch(query);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Service Completed
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            <Hourglass className="w-3.5 h-3.5 text-amber-600" />
            Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Service Booking
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Enter your Vehicle Number (e.g. WP CAB-4521), Registered Phone, or Booking Reference ID to check live progress.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8">
        <form onSubmit={onFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Vehicle Number, Phone, or Booking ID..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all uppercase placeholder:normal-case font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-md shadow-purple-700/20 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Status'}
          </button>
        </form>

        {/* Quick sample tips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Quick check demo vehicles:</span>
          <button
            type="button"
            onClick={() => {
              setQuery('WP CAB-4521');
              handleSearch('WP CAB-4521');
            }}
            className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold"
          >
            WP CAB-4521
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery('CP CAA-8812');
              handleSearch('CP CAA-8812');
            }}
            className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold"
          >
            CP CAA-8812
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-6">
          {results.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No Bookings Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any service appointments for "{query}". Double check your vehicle number or phone number.
              </p>
            </div>
          ) : (
            results.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6"
              >
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Vehicle Plate
                    </span>
                    <h2 className="text-2xl font-black text-purple-800 tracking-wide mt-0.5">
                      {booking.vehicleNumber}
                    </h2>
                  </div>
                  <div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Progress bar visual indicator */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0"></div>
                    <div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 transition-all duration-500 z-0 ${
                        booking.status === 'Rejected'
                          ? 'bg-rose-500 w-full'
                          : booking.status === 'Completed'
                          ? 'bg-emerald-500 w-full'
                          : booking.status === 'Approved'
                          ? 'bg-purple-600 w-2/3'
                          : 'bg-amber-500 w-1/3'
                      }`}
                    ></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
                        ✓
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 mt-1">Submitted</span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                          booking.status === 'Rejected'
                            ? 'bg-rose-500 text-white'
                            : booking.status === 'Approved' || booking.status === 'Completed'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {booking.status === 'Rejected' ? '✕' : '2'}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 mt-1">
                        {booking.status === 'Rejected' ? 'Declined' : 'Approved'}
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                          booking.status === 'Completed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {booking.status === 'Completed' ? '✓' : '3'}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 mt-1">Completed</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Service Type</span>
                    <span className="font-bold text-slate-800">{booking.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Scheduled Date</span>
                    <span className="font-bold text-slate-800">{booking.date}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Time Slot</span>
                    <span className="font-bold text-slate-800">{booking.time}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Customer Name</span>
                    <span className="font-bold text-slate-800">{booking.customerName}</span>
                  </div>
                </div>

                {booking.notes && (
                  <div className="text-xs text-slate-600 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                    <span className="font-bold text-purple-900 block mb-0.5">Customer Notes:</span>
                    {booking.notes}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>Reference ID: <code className="text-slate-600">{booking._id}</code></span>
                  <span>Booked On: {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default TrackBookingPage;

