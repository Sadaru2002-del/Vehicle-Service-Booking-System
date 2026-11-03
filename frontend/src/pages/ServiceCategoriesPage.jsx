import React, { useState, useEffect } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Clock, 
  Tag, 
  Wrench, 
  AlertCircle,
  FileText,
  DollarSign,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCategoriesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceEstimate, setPriceEstimate] = useState('');
  const [durationEstimate, setDurationEstimate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (error) {
      console.error('Fetch services error:', error);
      toast.error('Failed to load service categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error('Please enter service name and description');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/services', {
        name: name.trim(),
        description: description.trim(),
        priceEstimate: priceEstimate.trim() || 'Contact for quote',
        durationEstimate: durationEstimate.trim() || '1-2 hours'
      });

      if (res.data.success) {
        toast.success('New service category added!');
        setName('');
        setDescription('');
        setPriceEstimate('');
        setDurationEstimate('');
        fetchServices();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add service category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id, serviceName) => {
    if (!window.confirm(`Are you sure you want to remove "${serviceName}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/services/${id}`);
      if (res.data.success) {
        toast.success(`Service "${serviceName}" removed`);
        setServices((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (error) {
      toast.error('Failed to remove service category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-purple-700" />
            Service Category Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Configure vehicle service packages offered to customers on the booking portal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form to Add New Category */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-700" />
              Add New Service Category
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customers will see this option in the service selection dropdown.
            </p>
          </div>

          <form onSubmit={handleAddService} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Service Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Battery Replacement & Test"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what is included in this service package..."
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Est. Duration
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={durationEstimate}
                    onChange={(e) => setDurationEstimate(e.target.value)}
                    placeholder="e.g. 1 hour"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Est. Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={priceEstimate}
                    onChange={(e) => setPriceEstimate(e.target.value)}
                    placeholder="e.g. $50 - $80"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 mt-2"
            >
              {submitting ? 'Adding Category...' : 'Create Service Category'}
            </button>
          </form>
        </div>

        {/* Right Column: Existing Categories List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">
                Active Categories ({services.length})
              </h3>
              <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-full">
                Live in System
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400">
                <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                <p className="text-xs">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">No categories found</p>
                <p className="text-xs text-slate-400">Add your first service category using the form.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((srv) => (
                  <div
                    key={srv._id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-purple-600" />
                        <h4 className="font-bold text-slate-900 text-sm">
                          {srv.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {srv.description}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                        <span>Est: <strong className="text-slate-600">{srv.durationEstimate}</strong></span>
                        <span>•</span>
                        <span>Price: <strong className="text-purple-700">{srv.priceEstimate}</strong></span>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => handleDeleteService(srv._id, srv.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ServiceCategoriesPage;

