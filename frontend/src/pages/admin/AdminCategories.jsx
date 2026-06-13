import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Package, LogOut, Heart, PlayCircle, Plus, Edit2, Trash2, Upload, Smile, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '../../utils/cloudinary';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (import.meta.env.PROD ? '' : 'http://localhost:5000');
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:5000/api');

  const getFullImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : API_BASE_URL + url;
  };

  const getToken = () => localStorage.getItem('adminToken');

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
    
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slug // only auto-generate slug for new categories
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image;

      // Upload image to Cloudinary if selected
      if (selectedFile) {
        toast.loading('Uploading category image...', { id: 'upload' });
        try {
          imageUrl = await uploadToCloudinary(selectedFile, getToken, API_BASE_URL);
          toast.dismiss('upload');
        } catch (err) {
          toast.dismiss('upload');
          toast.error('Image upload failed');
          setLoading(false);
          return;
        }
      }

      const bodyToSend = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: imageUrl
      };

      const url = editingCategory
        ? `${API_URL}/admin/categories/${editingCategory.id}`
        : `${API_URL}/admin/categories`;

      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyToSend)
      });

      if (response.ok) {
        toast.success(editingCategory ? 'Category updated!' : 'Category created!');
        setShowModal(false);
        setEditingCategory(null);
        resetForm();
        await fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? All products under this category will become uncategorized.')) {
      try {
        const response = await fetch(`${API_URL}/admin/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        if (response.ok) {
          toast.success('Category deleted!');
          fetchCategories();
        } else {
          toast.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || ''
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: ''
    });
    setSelectedFile(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully!');
    navigate('/admin/login');
  };

  const isActive = (path) => window.location.pathname === path;

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
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Package className="h-5 w-5" /> Dashboard
          </Link>
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/products') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Gift className="h-5 w-5" /> Products
          </Link>
          <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/orders') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <ShoppingCart className="h-5 w-5" /> Orders
          </Link>
          <Link to="/admin/categories" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/categories') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Heart className="h-5 w-5" /> Categories
          </Link>
          <Link to="/admin/coupons" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/coupons') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Smile className="h-5 w-5" /> Coupons
          </Link>
          <Link to="/admin/reels" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('/admin/reels') ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <PlayCircle className="h-5 w-5" /> Reels
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500 mt-1">Manage your product categories</p>
          </div>
          <button 
            onClick={() => { resetForm(); setEditingCategory(null); setShowModal(true); }} 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
          >
            <Plus className="h-5 w-5" /> Add Category
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase text-gray-500 font-semibold">
                  <th className="px-6 py-4 pl-8">Category Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading categories...</td>
                  </tr>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 pl-8">
                        {cat.image ? (
                          <img
                            src={getFullImageUrl(cat.image)}
                            alt={cat.name}
                            className="h-14 w-14 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{cat.name}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm font-mono">{cat.slug}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{cat.description || '-'}</td>
                      <td className="px-6 py-4 pr-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleEdit(cat)} className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No categories found. Create one now!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                <div className="flex items-center gap-4">
                  {selectedFile ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border-2 border-purple-300"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : formData.image ? (
                    <div className="relative">
                      <img
                        src={getFullImageUrl(formData.image)}
                        alt="Existing"
                        className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : null}

                  <label className="flex-1 max-w-xs h-16 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                    <Upload className="h-5 w-5 text-gray-400 mb-0.5" />
                    <p className="text-xs text-gray-500">Upload Image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="category-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Category description"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition"
                >
                  {editingCategory ? 'Update' : 'Add'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
