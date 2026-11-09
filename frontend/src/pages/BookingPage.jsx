import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  Car, 
  User, 
  Phone, 
  Wrench, 
  FileText, 
  CheckCircle, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const timeSlots = [
  '08:30 AM',
  '09:30 AM',
  '10:30 AM',
  '11:30 AM',
  '01:30 PM',
  '02:30 PM',
  '03:30 PM',
  '04:30 PM'
];

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    vehicleNumber: '',
    serviceType: searchParams.get('service') || '',
    date: '',
    time: '09:30 AM',
    notes: ''
  });

  // Success Confirmation State
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Today's date string for min date in picker
  const todayDateString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success) {
          setServices(res.data.services);
          // If no service selected in URL and list is not empty, set first as default
          if (!searchParams.get('service') && res.data.services.length > 0) {
            setFormData((prev) => ({
              ...prev,
              serviceType: prev.serviceType || res.data.services[0].name
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load services:', err);
        toast.error('Could not fetch services list');
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'vehicleNumber' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!formData.vehicleNumber.trim()) {
      toast.error('Please enter your vehicle registration number');
      return;
    }
    if (!formData.serviceType) {
      toast.error('Please select a service category');
      return;
    }
    if (!formData.date) {
      toast.error('Please select an appointment date');
      return;
    }
    if (!formData.time) {
      toast.error('Please select a time slot');
      return;
    }

    setSubmitting(true);
    try {
      const selectedService = services.find(s => s.name === formData.serviceType);
      const payload = {
        ...formData,
        priceEstimate: selectedService?.priceEstimate || ''
      };
      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        toast.success('Service booking submitted successfully!');
        setConfirmedBooking(res.data.booking);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit booking. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Booking ID copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* If booking was confirmed, show Success Confirmation Screen */}
      {confirmedBooking ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8 animate-fadeIn">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Booking Submitted Successfully!
            </h2>
            <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base">
              Your appointment request has been received and is currently waiting for admin approval.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400">
                  Booking Reference Number
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-slate-800 text-base sm:text-lg">
                    {confirmedBooking._id}
                  </span>
                  <button
                    onClick={() => copyToClipboard(confirmedBooking._id)}
                    className="p-1.5 text-slate-500 hover:text-purple-600 rounded-md hover:bg-white border border-slate-200 transition-colors"
                    title="Copy ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                  Status: {confirmedBooking.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
              <div>
                <span className="text-slate-500">Customer Name:</span>
                <p className="font-semibold text-slate-800">{confirmedBooking.customerName}</p>
              </div>
              <div>
                <span className="text-slate-500">Phone Number:</span>
                <p className="font-semibold text-slate-800">{confirmedBooking.phone}</p>
              </div>
              <div>
                <span className="text-slate-500">Vehicle Number:</span>
                <p className="font-semibold text-purple-700 tracking-wider">
                  {confirmedBooking.vehicleNumber}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Service Category:</span>
                <p className="font-semibold text-slate-800">{confirmedBooking.serviceType}</p>
              </div>
              <div>
                <span className="text-slate-500">Estimated Service Fee:</span>
                <p className="font-black text-emerald-700 text-base">
                  {confirmedBooking.priceEstimate || 'Contact for quote'}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Appointment Date:</span>
                <p className="font-semibold text-slate-800">{confirmedBooking.date}</p>
              </div>
              <div>
                <span className="text-slate-500">Appointment Time:</span>
                <p className="font-semibold text-slate-800">{confirmedBooking.time}</p>
              </div>
              {confirmedBooking.notes && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500">Customer Note:</span>
                  <p className="text-slate-700 italic">{confirmedBooking.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={() => navigate(`/track?query=${encodeURIComponent(confirmedBooking.vehicleNumber)}`)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-md shadow-purple-700/20 transition-all"
            >
              Track Live Status
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setConfirmedBooking(null);
                setFormData({
                  customerName: '',
                  phone: '',
                  vehicleNumber: '',
                  serviceType: services[0]?.name || '',
                  date: '',
                  time: '09:30 AM',
                  notes: ''
                });
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all"
            >
              Book Another Service
            </button>
          </div>

        </div>
      ) : (
        /* The Booking Form */
        <div className="space-y-8">
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Schedule Your Vehicle Service
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Fill out the details below. Our workshop team will review and confirm your preferred time slot immediately.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Customer Details */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-700 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" /> 1. Customer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="e.g. Kamal Perera"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 0771234567"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Vehicle & Service Details */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-700 mb-4 flex items-center gap-2">
                  <Car className="w-4 h-4" /> 2. Vehicle & Service Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Vehicle Plate Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Car className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        placeholder="e.g. WP CAB-4521"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm uppercase font-semibold outline-none transition-all tracking-wide"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Service Type *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                        disabled={loadingServices}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all bg-white font-medium"
                      >
                        {loadingServices ? (
                          <option>Loading services...</option>
                        ) : (
                          services.map((srv) => (
                            <option key={srv._id} value={srv.name}>
                              {srv.name} — {srv.priceEstimate} ({srv.durationEstimate || '1-2 hrs'})
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Selected Service Detail & LKR Pricing Card */}
                    {services.find(s => s.name === formData.serviceType) && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Service Fee:</span>
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-sm border border-emerald-300">
                              {services.find(s => s.name === formData.serviceType)?.priceEstimate}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {services.find(s => s.name === formData.serviceType)?.description}
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                          <Clock className="w-3.5 h-3.5 text-purple-600" />
                          <span>Est: {services.find(s => s.name === formData.serviceType)?.durationEstimate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Date & Preferred Time */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-700 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> 3. Schedule Appointment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        min={todayDateString}
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Time Slot *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all bg-white"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional notes */}
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Specific Symptoms or Instructions (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <textarea
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g. Please check strange rattling noise during braking or acceleration..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No payment required right now. Pay upon service completion.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-md shadow-purple-600/25 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting Request...' : 'Confirm Appointment Request'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

    </div>
  );
};

export default BookingPage;

