
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Package, LogOut, Plus, Edit2, Trash2, Upload, PlayCircle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReel, setEditingReel] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    media_type: 'image',
    is_active: true,
    position: 0
  });
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (import.meta.env.PROD ? '' : 'http://localhost:5000');

  const getFullImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : API_BASE_URL + url;
  };

  // Helper function to get admin token
  const getToken = () => localStorage.getItem('adminToken');

  const fetchReels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reels`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setReels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch reels:', error);
      toast.error('Failed to load reels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto-detect media type
      if (file.type.startsWith('video/')) {
        setFormData({ ...formData, media_type: 'video' });
      } else {
        setFormData({ ...formData, media_type: 'image' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append('media_type', formData.media_type);
      formDataToSend.append('is_active', formData.is_active);
      formDataToSend.append('position', formData.position);

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('media', selectedFile);
      }

      console.log('🔍 Sending form data:', [...formDataToSend.entries()]);

      const url = editingReel
        ? `${API_BASE_URL}/api/admin/reels/${editingReel.id}`
        : `${API_BASE_URL}/api/admin/reels`;

      const response = await fetch(url, {
        method: editingReel ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formDataToSend
      });

      console.log('🔍 Response status:', response.status);

      if (response.ok) {
        toast.success(editingReel ? 'Reel updated!' : 'Reel created!');
        setShowModal(false);
        setEditingReel(null);
        resetForm();
        await fetchReels();
      } else {
        let errorMessage = 'Failed to save reel';
        try {
          const errorData = await response.clone().json(); // Clone response first
          console.error('🔍 Error response:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.error('🔍 Error text response:', errorText);
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('🔍 Network error saving reel:', error);
      toast.error('Network error. Is backend server running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reel?')) {
      try {
        await fetch(`${API_BASE_URL}/api/admin/reels/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        toast.success('Reel deleted!');
        fetchReels();
      } catch (error) {
        console.error('Error deleting reel:', error);
        toast.error('Failed to delete reel');
      }
    }
  };

  const handleEdit = (reel) => {
    setEditingReel(reel);
    setFormData({
      media_type: reel.media_type || 'image',
      is_active: reel.is_active !== false,
      position: reel.position || 0
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      media_type: 'image',
      is_active: true,
      position: 0
    });
    setSelectedFile(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out!');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-playfair font-bold text-gray-900">POPARTS</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        <nav className="space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Package className="h-5 w-5" /> Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Gift className="h-5 w-5" /> Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Package className="h-5 w-5" /> Orders
          </Link>
          <Link to="/admin/reels" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold">
            <PlayCircle className="h-5 w-5" /> Reels
          </Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Instagram Reels</h1>
            <p className="text-gray-500 mt-1">Manage your reels here</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
            <Plus className="h-5 w-5" /> Add Reel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[9/16] bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : reels.length > 0 ? (
            reels.map((reel) => (
              <div key={reel.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="aspect-[9/16] bg-gray-100 relative">
                  {reel.media_type === 'video' ? (
                    <video
                      src={getFullImageUrl(reel.media_url)}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={getFullImageUrl(reel.media_url)}
                      alt="Reel"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${reel.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {reel.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    {reel.media_type === 'video' ? (
                      <PlayCircle className="h-6 w-6 text-white drop-shadow-lg" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-white drop-shadow-lg" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(reel)} className="p-2 bg-white rounded-lg text-purple-600 hover:bg-gray-50">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(reel.id)} className="p-2 bg-white rounded-lg text-red-600 hover:bg-gray-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Position: {reel.position}</span>
                    <span className="text-xs text-gray-400 capitalize">{reel.media_type}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <PlayCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reels yet. Add your first reel!</p>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Reel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingReel ? 'Edit Reel' : 'Add New Reel'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Media (Image or Video)
                </label>
                {selectedFile ? (
                  <div className="relative">
                    {selectedFile.type.startsWith('video/') ? (
                      <video
                        src={URL.createObjectURL(selectedFile)}
                        className="w-full aspect-[3/4] max-h-64 object-cover rounded-xl border-2 border-purple-300"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full aspect-[3/4] max-h-64 object-cover rounded-xl border-2 border-purple-300"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : editingReel ? (
                  <div className="relative">
                    {editingReel.media_type === 'video' ? (
                      <video
                        src={getFullImageUrl(editingReel.media_url)}
                        className="w-full aspect-[3/4] max-h-64 object-cover rounded-xl border-2 border-gray-200"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={getFullImageUrl(editingReel.media_url)}
                        alt="Reel"
                        className="w-full aspect-[3/4] max-h-64 object-cover rounded-xl border-2 border-gray-200"
                      />
                    )}
                  </div>
                ) : null}
                {!selectedFile && (
                  <label className="mt-2 w-full aspect-[3/4] max-h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload media</p>
                    <p className="text-xs text-gray-400 mt-1">Supports images and videos</p>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 text-purple-600"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90"
                >
                  {editingReel ? 'Update' : 'Add'} Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReels;
