
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Package, LogOut, Plus, Edit2, Trash2, Upload, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '',
    stock: '0',
    featured: false
  });
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const getFullImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : API_BASE_URL + url;
  };

  // Helper function to get admin token
  const getToken = () => localStorage.getItem('adminToken');

  const fetchProducts = async (categoryId = '') => {
    try {
      const url = new URL('http://127.0.0.1:5000/api/admin/products');
      if (categoryId) {
        url.searchParams.set('category', categoryId);
      }
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        }
      });
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
    fetchCategories();
  }, [selectedCategory]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      // Limit total selected images to 6
      const total = selectedImages.length + newImages.length;
      const imagesToAdd = total > 6 ? newImages.slice(0, 6 - selectedImages.length) : newImages;
      setSelectedImages([...selectedImages, ...imagesToAdd]);
    }
  };

  const removeSelectedImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(existingImages.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Copy regular form fields (excluding category_id to prevent double appending as an array)
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'category_id' && value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });
      
      // Send first selected category as category_id for backward compatibility
      if (selectedCategories.length > 0) {
        formDataToSend.append('category_id', selectedCategories[0]);
        // Send all selected categories as an array
        selectedCategories.forEach((catId) => {
          formDataToSend.append('category_ids[]', catId);
        });
      }
      
      // Add new images
      selectedImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      // Add deleted image ids (if editing)
      if (editingProduct && editingProduct.images) {
        const originalImageIds = editingProduct.images.map(img => img.id);
        const remainingImageIds = existingImages.map(img => img.id);
        const deletedIds = originalImageIds.filter(id => !remainingImageIds.includes(id));
        deletedIds.forEach(id => {
          formDataToSend.append('delete_image_ids', id);
        });
      }

      const url = editingProduct
        ? `http://127.0.0.1:5000/api/admin/products/${editingProduct.id}`
        : 'http://127.0.0.1:5000/api/admin/products';

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        toast.success(editingProduct ? 'Product updated!' : 'Product created!');
        setShowModal(false);
        setEditingProduct(null);
        resetForm();
        await fetchProducts();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`http://127.0.0.1:5000/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        toast.success('Product deleted!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setSelectedCategories(product.category_id ? [String(product.category_id)] : []);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price ? String(product.price) : '',
      discount_price: product.discount_price ? String(product.discount_price) : '',
      category_id: product.category_id ? String(product.category_id) : '',
      stock: product.stock ? String(product.stock) : '0',
      featured: product.featured || false
    });
    setExistingImages(product.images || []);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      discount_price: '',
      category_id: '',
      stock: '0',
      featured: false
    });
    setSelectedCategories([]);
    setSelectedImages([]);
    setExistingImages([]);
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
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold">
            <Gift className="h-5 w-5" /> Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <Package className="h-5 w-5" /> Orders
          </Link>
          <Link to="/admin/reels" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
            <PlayCircle className="h-5 w-5" /> Reels
          </Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your products here</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
            <Plus className="h-5 w-5" /> Add Product
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase text-gray-500 font-semibold">
                  <th className="px-6 py-4 pl-8">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading products...</td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 pl-8">
                        <div className="flex items-center gap-4">
                          {product.primary_image && (
                            <img
                              src={getFullImageUrl(product.primary_image)}
                              alt={product.name}
                              className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            {product.featured && (
                              <p className="text-xs text-purple-600 bg-purple-50 inline-block px-2 py-0.5 rounded-full mt-1">On Sale</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-sm text-gray-600">{product.category_name || 'Uncategorized'}</span></td>
                      <td className="px-6 py-4">
                        {product.discount_price ? (
                          <div>
                            <p className="text-sm font-semibold text-red-600">₹{Number(product.discount_price).toFixed(2)}</p>
                            <p className="text-xs text-gray-400 line-through">₹{Number(product.price).toFixed(2)}</p>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900">₹{Number(product.price).toFixed(2)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          Number(product.stock) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {Number(product.stock) > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 pr-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-purple-600 hover:bg-purple-50">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No products yet. Add your first product!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images (Up to 6)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Existing Images (for edit) */}
                  {existingImages.map((img, idx) => (
                    <div key={img.id} className="relative">
                      <img
                        src={getFullImageUrl(img.image_url)}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {/* New Selected Images */}
                  {selectedImages.map((img, idx) => (
                    <div key={`new-${idx}`} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-xl border-2 border-purple-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload Button */}
                  {(existingImages.length + selectedImages.length) < 6 && (
                    <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Add Image</p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="product-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="Product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories (Select multiple)</label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 max-h-40 overflow-y-auto">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          id={`cat-${cat.id}`}
                          checked={selectedCategories.includes(String(cat.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, String(cat.id)]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(id => id !== String(cat.id)));
                            }
                          }}
                          className="h-4 w-4 text-purple-600"
                        />
                        <label htmlFor={`cat-${cat.id}`} className="text-sm text-gray-700">{cat.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-purple-600"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">Mark as Featured</label>
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
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
