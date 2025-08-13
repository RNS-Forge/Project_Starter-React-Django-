import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { FlickeringGrid } from '../components/magicui/flickering-grid';

// Image assets for slider (same as login/register)
import loginScattered11 from '../assets/LoginImg1.png';
import loginScattered22 from '../assets/LoginImg2.png';
import loginScattered33 from '../assets/LoginImg3.png';

const VerifyEmail: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const { token } = useParams<{ token: string }>();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  // Image slider for right side
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const images = [loginScattered11, loginScattered22, loginScattered33];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsTransitioning(false), 1000);
      }
    }, 4000);
    return () => clearInterval(slideInterval);
  }, [isTransitioning, images.length]);

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setMessage('Invalid verification token');
        setLoading(false);
        return;
      }

      try {
        const result = await verifyEmail(token);
        setSuccess(result.success);
        setMessage(result.message);

        if (result.success) {
          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate('/home');
          }, 3000);
        }
      } catch {
        setSuccess(false);
        setMessage('An unexpected error occurred during verification.');
      } finally {
        setLoading(false);
      }
    };

    handleVerification();
  }, [token, verifyEmail, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative p-4  overflow-hidden">
        {/* Animated yellow background blobs */}
        

        {/* Flickering Grid Background */}
        <div className="absolute inset-0 opacity-20 z-0">
          <FlickeringGrid
            squareSize={4}
            gridGap={6}
            flickerChance={0.3}
            color="rgb(234, 179, 8)" // yellow-500
            maxOpacity={0.15}
            className="w-full h-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md mx-4 bg-white rounded-lg border border-gray-300 shadow-xl p-8 flex flex-col justify-center items-center min-h-[400px]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="h-16 w-16 text-yellow-500 mb-6"
          >
            <svg
              className="w-full h-full animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </motion.div>

          <motion.h2
            className="text-xl font-semibold text-yellow-600 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Verifying your email...
          </motion.h2>

          <motion.p
            className="text-gray-700 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Please wait while we verify your email address.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 overflow-hidden">
      {/* Animated yellow background blobs */}
     

      {/* Flickering Grid Background */}
      <div className="absolute inset-0 opacity-20 z-0">
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="rgb(234, 179, 8)"
          maxOpacity={0.15}
          className="w-full h-full"
        />
      </div>

      {/* Main card with form on left and image slider on right */}
      <div className="flex flex-col lg:flex-row bg-white rounded-lg border border-gray-300 shadow-xl w-full max-w-5xl overflow-hidden min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 100 }}
          className="relative z-10 w-full lg:w-1/2 p-8 flex flex-col justify-center items-center"
        >
          <div className="text-center mb-6 w-full max-w-md">
            <div className={`h-16 w-16 mx-auto mb-6 text-${success ? 'green' : 'red'}-500`}>
              {success ? (
                <svg
                  className="w-full h-full animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-full h-full animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              )}
            </div>
            <motion.h2
              className="text-3xl font-bold text-yellow-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {success ? 'Email Verified!' : 'Verification Failed'}
            </motion.h2>
            {!success && (
              <motion.p
                className="text-gray-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {message}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 w-full max-w-md"
          >
            {success ? (
              <>
                <p className="text-sm text-green-600 text-center mb-4">
                  Redirecting to home page in 3 seconds...
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  Go to Home
                </button>
              </>
            ) : (
              <>
                
                <Link
                  to="/register"
                  className="w-full block text-yellow-500 border border-yellow-500 rounded-md py-2 text-center hover:bg-yellow-100 transition mt-2"
                >
                  Create New Account
                </Link>
                <Link
                  to="/login"
                  className="btn-primary w-full bg-yellow-500 text-white py-2 px-15 flex items-center justify-center rounded-md hover:bg-yellow-600 transition text-center"
                >
                  Go to Login
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Image slider on right side */}
        <div className="hidden lg:flex flex-1 justify-center items-center p-8 bg-white">
          <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-lg">
            {images.map((img, index) => (
              <img
                key={index}
                src={img || '/placeholder.svg'}
                alt={`Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out"
                style={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  transform: `scale(${currentImageIndex === index ? 1 : 1.05})`,
                  zIndex: currentImageIndex === index ? 1 : 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;