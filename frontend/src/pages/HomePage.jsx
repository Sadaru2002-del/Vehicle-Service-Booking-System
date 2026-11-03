import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { 
  CalendarCheck2, 
  Wrench, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Sparkles,
  Car,
  Award
} from 'lucide-react';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.25),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-purple-300" />
                Next-Gen Vehicle Service Appointment System
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Premium Care For Your Vehicle, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                  Booked In Seconds.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Skip long workshop queues and scheduling delays. Schedule maintenance, oil changes, engine diagnostics, and inspections effortlessly with FUCHSIUS.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  <CalendarCheck2 className="w-5 h-5" />
                  Book Service Now
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/track"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:text-white transition-all"
                >
                  <Search className="w-5 h-5 text-purple-400" />
                  Track Existing Booking
                </Link>
              </div>

              {/* Quick stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-white">99.8%</div>
                  <div className="text-xs text-slate-400 font-medium">On-Time Service</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">15+ Mins</div>
                  <div className="text-xs text-slate-400 font-medium">Fast Approvals</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">4.9 / 5</div>
                  <div className="text-xs text-slate-400 font-medium">Customer Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-600 text-white">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Quick Appointment</h3>
                      <p className="text-xs text-purple-200">Instant confirmation slot</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Booking
                  </span>
                </div>

                <div className="space-y-4 py-5 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                    <span className="text-slate-300">Available Date:</span>
                    <span className="font-semibold text-white">Today & Tomorrow</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                    <span className="text-slate-300">Slots:</span>
                    <span className="font-semibold text-purple-300">Morning & Afternoon</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                    <span className="text-slate-300">Track:</span>
                    <span className="font-semibold text-emerald-300">Real-time status updates</span>
                  </div>
                </div>

                <Link
                  to="/book"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                >
                  Schedule Your Appointment
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Effortless Scheduling</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Choose your preferred vehicle service, date, and convenient time slot in less than 2 minutes without phone calls.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Live Progress Tracking</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track your booking status instantly (Pending, Approved, In Progress, Completed) by your vehicle or phone number.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Certified Mechanics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every service is handled by skilled automotive technicians adhering strictly to OEM safety and diagnostic standards.
            </p>
          </div>

        </div>
      </section>

      {/* Available Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
              Workshop Capabilities
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Our Professional Vehicle Services
            </h2>
          </div>
          <Link
            to="/book"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-700 hover:text-purple-800"
          >
            <span>Book one of these services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv._id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-purple-50 group-hover:bg-purple-600 text-purple-700 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {srv.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                    Est: {srv.durationEstimate || '1-2 hrs'}
                  </span>
                  <Link
                    to={`/book?service=${encodeURIComponent(srv.name)}`}
                    className="font-bold text-slate-700 hover:text-purple-700 inline-flex items-center gap-1"
                  >
                    Select & Book <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              How The Booking Process Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A clear 3-step digital journey designed to save your time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="relative bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-extrabold flex items-center justify-center text-base mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Submit Booking Form</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your contact info, vehicle plate number, select the required service and pick your preferred time slot.
              </p>
            </div>

            <div className="relative bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-fuchsia-600 text-white font-extrabold flex items-center justify-center text-base mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Admin Review & Approval</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                The service workshop administrator verifies workshop bay availability and approves your appointment slot.
              </p>
            </div>

            <div className="relative bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-base mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Service Completion</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drop your vehicle on the scheduled date. Track progress in real-time until service completion.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-fuchsia-950 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Ready to schedule your vehicle service?
            </h2>
            <p className="text-purple-200 text-sm sm:text-base leading-relaxed">
              Book online right now and receive instantaneous confirmation. No waiting, no hassle.
            </p>
            <div className="pt-2">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-purple-900 bg-white hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <CalendarCheck2 className="w-5 h-5 text-purple-700" />
                Book Your Appointment Now
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

