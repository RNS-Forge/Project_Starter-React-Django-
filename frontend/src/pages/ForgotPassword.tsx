import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { FlickeringGrid } from '../components/magicui/flickering-grid';

// Image assets (same as login/register)
import loginScattered11 from '../assets/LoginImg1.png';
import loginScattered22 from '../assets/LoginImg2.png';
import loginScattered33 from '../assets/LoginImg3.png';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const images = [loginScattered11, loginScattered22, loginScattered33];

  const { forgotPassword } = useAuth();

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

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear previous errors and messages when user starts typing
    if (emailError) setEmailError('');
    if (message) setMessage('');
    
    // Real-time validation
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage('');
    setEmailError('');
    
    // Validate email before submission
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(email.trim());
      setMessage(result.message || 'Password reset link sent successfully!');
      setSuccess(result.success);
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 ">
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

      {/* Main container with form left, image slider right */}
      <div className="flex flex-col lg:flex-row bg-white rounded-lg border border-gray-300 shadow-xl w-full max-w-5xl overflow-hidden min-h-[600px]">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 100 }}
          className="relative z-10 w-full lg:w-1/2 p-8 flex flex-col justify-center items-center"
        >
          <div className="text-center mb-6 w-full max-w-md">
            <h1 className="text-4xl font-bold text-yellow-500 mb-2">
              Forgot your password?
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 w-full max-w-md"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full border rounded-md py-2 px-4 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </motion.div>

            {/* Success/Error Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`px-4 py-3 rounded text-center ${
                  success
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {message}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading || !!emailError}
              whileHover={{ scale: loading || emailError ? 1 : 1.02 }}
              whileTap={{ scale: loading || emailError ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`w-full py-2 rounded-md focus:outline-none transition-all shadow-md relative overflow-hidden ${
                loading || emailError
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
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
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <Link
                to="/login"
                className="text-yellow-500 hover:text-yellow-600 transition-colors duration-300 text-sm font-medium"
              >
                Back to Login
              </Link>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Image slider section on right side */}
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

        {/* Floating animated particles */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-500/30 rounded-full"
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400/40 rounded-full"
          animate={{
            y: [10, -10, 10],
            x: [5, -5, 5],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
