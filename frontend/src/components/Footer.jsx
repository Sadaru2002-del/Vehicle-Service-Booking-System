import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white">
                <Wrench className="w-5 h-5 -rotate-45" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                FUCHSIUS
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Leading vehicle service appointment and workflow management platform. Fast, transparent, and hassle-free vehicle maintenance.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold bg-purple-950/60 border border-purple-800/40 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Certified Workshop Network
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-purple-400 transition-colors">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-purple-400 transition-colors">
                  Check Booking Status
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-purple-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Working Hours
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Mon – Fri: 8:00 AM – 6:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Saturday: 8:30 AM – 4:00 PM</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Sunday: Closed for maintenance</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Support Center
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>No. 124, High Level Road, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>+94 (11) 234 5678 / +94 (77) 123 4567</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FUCHSIUS Vehicle Service Booking System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

