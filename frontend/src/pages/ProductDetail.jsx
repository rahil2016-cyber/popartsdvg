
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ChevronLeft } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const getFullImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/600';
    return url.startsWith('http') ? url : API_BASE_URL + url;
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      console.log('Adding to cart - Product ID:', product.id, 'Quantity:', quantity, 'Product:', product);
      await addToCart(product.id, quantity);
      toast.success('Added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error('Add to cart error:', error.response?.data || error.message);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-2xl h-96 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse"></div>
            <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];
  const price = product.discount_price || product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-hot-pink mb-8 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
            <img
              src={getFullImageUrl(images[selectedImage]?.image_url || product.primary_image)}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-hot-pink'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={getFullImageUrl(image.image_url)}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2">
            <Link
              to={`/products?category=${product.category_name?.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-royal-purple hover:text-hot-pink transition-colors"
            >
              {product.category_name}
            </Link>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">₹{price}</span>
            {product.discount_price && (
              <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-hot-pink hover:text-hot-pink transition-colors"
              >
                -
              </button>
              <span className="text-xl font-semibold text-gray-800 w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-hot-pink hover:text-hot-pink transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-hot-pink to-royal-purple text-white py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button className="w-14 h-14 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:border-hot-pink hover:text-hot-pink transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Reviews</h3>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-800">{review.user_name}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
