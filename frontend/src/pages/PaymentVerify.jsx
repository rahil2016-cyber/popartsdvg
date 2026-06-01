import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const PaymentVerify = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, failed

  useEffect(() => {
    const verifyPayment = async () => {
      // Cashfree returns order_id in the query params as configured in return_url
      const returnedOrderId = searchParams.get('order_id') || orderId;
      
      try {
        const res = await api.post('/payments/verify', { order_id: returnedOrderId });
        
        if (res.data.success) {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setStatus('failed');
      }
    };

    if (orderId) {
      verifyPayment();
    } else {
      setStatus('failed');
    }
  }, [orderId, searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-hot-pink animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please do not close or refresh this page.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your order has been placed and payment is confirmed.</p>
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="bg-hot-pink text-white px-8 py-3 rounded-xl font-medium hover:bg-pink-600 transition-colors"
            >
              View Order Details
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed or Pending</h2>
            <p className="text-gray-600 mb-6">We couldn't confirm your payment. If money was deducted, it will be refunded automatically.</p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/order/${orderId}`)}
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                View Order
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-hot-pink text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;
