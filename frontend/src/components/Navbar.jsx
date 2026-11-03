import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Wrench, 
  Calendar, 
  Search, 
  LayoutDashboard, 
  FolderKanban, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
      isActive
        ? 'text-purple-700 bg-purple-50 font-semibold'
        : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
              <Wrench className="w-5 h-5 -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-800 via-fuchsia-700 to-pink-600 bg-clip-text text-transparent">
                FUCHSIUS
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase -mt-1">
                Vehicle Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/book" className={navLinkClass}>
              <Calendar className="w-4 h-4 text-purple-600" />
              Book Service
            </NavLink>
            <NavLink to="/track" className={navLinkClass}>
              <Search className="w-4 h-4 text-slate-500" />
              Track Booking
            </NavLink>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <NavLink to="/admin" className={navLinkClass} end>
                  <LayoutDashboard className="w-4 h-4 text-purple-600" />
                  Dashboard
                </NavLink>
                <NavLink to="/admin/services" className={navLinkClass}>
                  <FolderKanban className="w-4 h-4 text-purple-600" />
                  Categories
                </NavLink>
                
                <div className="flex items-center gap-2 ml-2 pl-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    {user?.username || 'Admin'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="ml-4 pl-4 border-l border-slate-200">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-xs hover:shadow-md shadow-purple-500/25 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
          >
            Home
          </Link>
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
          >
            <Calendar className="w-4 h-4 text-purple-600" />
            Book Service
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
          >
            <Search className="w-4 h-4 text-slate-500" />
            Track Booking
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
                Admin Panel ({user?.username})
              </div>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-600" />
                Dashboard
              </Link>
              <Link
                to="/admin/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <FolderKanban className="w-4 h-4 text-purple-600" />
                Manage Categories
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600"
              >
                <LogIn className="w-4 h-4" />
                Admin Portal Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

