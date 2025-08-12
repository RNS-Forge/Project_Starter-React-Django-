import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'rememberMe') {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setErrors('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');

    try {
  const result = await login(formData.email, formData.password, rememberMe);
      
      if (result.success) {
        navigate('/home');
      } else {
        setErrors(result.message);
        if (result.emailVerificationRequired) {
          setShowResendVerification(true);
        }
      }
    } catch {
      setErrors('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const result = await resendVerification(formData.email);
      if (result.success) {
        setErrors('Verification email sent successfully. Please check your inbox.');
        setShowResendVerification(false);
      } else {
        setErrors(result.message);
      }
    } catch {
      setErrors('Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-violet-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-violet-400/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-40 w-28 h-28 bg-violet-600/25 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-violet-500/15 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="holographic w-full h-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Main Login Card */}
        <div className="card-primary p-8 space-y-8">
          {/* Header with Glowing Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              className="text-4xl font-bold gradient-text animate-neon-glow mb-2"
              animate={{ 
                textShadow: [
                  "0 0 20px #8b5cf6",
                  "0 0 40px #a78bfa",
                  "0 0 20px #8b5cf6"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Welcome Back
            </motion.h1>
            <motion.p
              className="text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Sign in to your account
            </motion.p>
            <motion.p
              className="text-gray-400 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Or{' '}
              <Link
                to="/register"
                className="text-violet-400 hover:text-violet-300 transition-colors duration-300 font-medium"
              >
                create a new account
              </Link>
            </motion.p>
          </motion.div>

          {/* Error Message */}
          {errors && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm"
            >
              {errors}
            </motion.div>
          )}

          {/* Verification Reminder */}
          {showResendVerification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-4 py-3 rounded-lg backdrop-blur-sm"
            >
              <p className="text-sm">Your email address is not verified.</p>
              <button
                type="button"
                onClick={handleResendVerification}
                className="text-violet-400 hover:text-violet-300 font-medium text-sm mt-1 transition-colors duration-300"
                disabled={loading}
              >
                Resend verification email
              </button>
            </motion.div>
          )}

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-primary"
                placeholder="Enter your email"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-primary pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-400 focus:outline-none"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0112 20C7 20 2.73 16.11 1 12c.74-1.64 1.81-3.16 3.06-4.41M9.88 9.88A3 3 0 1114.12 14.12M9.88 9.88L3 3m6.88 6.88l6.24 6.24" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Remember Me and Login Button */}
            <motion.div className="flex items-center justify-between mt-2">
              <label className="flex items-center text-sm text-gray-300 select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleChange}
                  className="form-checkbox accent-violet-500 mr-2"
                />
                Remember Me
              </label>
            </motion.div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full btn-primary relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  background: [
                    "linear-gradient(45deg, #8b5cf6, #7c3aed)",
                    "linear-gradient(45deg, #a78bfa, #8b5cf6)",
                    "linear-gradient(45deg, #8b5cf6, #7c3aed)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing In...</span>
                  </span>
                ) : (
                  'Sign In'
                )}
              </span>
            </motion.button>
          </motion.form>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link
              to="/forgot-password"
              className="text-violet-400 hover:text-violet-300 transition-colors duration-300 text-sm"
            >
              Forgot your password?
            </Link>
          </motion.div>
        </div>

        {/* Floating Particles */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-violet-500/30 rounded-full"
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-6 h-6 bg-violet-400/40 rounded-full"
          animate={{
            y: [10, -10, 10],
            x: [5, -5, 5],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>
    </div>
  );
};

export default Login;
