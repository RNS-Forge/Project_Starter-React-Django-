import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'Weak'|'Medium'|'Strong'|'Very Strong'|''>('');
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  function evaluatePasswordStrength(password: string) {
    let score = 0;
    const feedback: string[] = [];
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Lowercase letter');
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Uppercase letter');
    if (/\d/.test(password)) score++;
    else feedback.push('Number');
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('Special character');
    if (password.length >= 12) score++;
    if (/[^a-zA-Z0-9]/.test(password) && password.length >= 16) score++;
    if (score <= 2) setPasswordStrength('Weak');
    else if (score === 3) setPasswordStrength('Medium');
    else if (score === 4 || score === 5) setPasswordStrength('Strong');
    else setPasswordStrength('Very Strong');
    setPasswordFeedback(feedback);
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the Terms and Conditions';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
      else if (!/[a-z]/.test(formData.password)) newErrors.password = 'Password must contain at least one lowercase letter';
      else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter';
      else if (!/\d/.test(formData.password)) newErrors.password = 'Password must contain at least one number';
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) newErrors.password = 'Password must contain at least one special character';
      else if (formData.password.length > 128) newErrors.password = 'Password must be less than 128 characters';
      else if (/\s/.test(formData.password)) newErrors.password = 'Password cannot contain spaces';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await register(
        formData.first_name,
        formData.last_name,
        formData.email,
        formData.password
      );
      
      if (result.success) {
        setSuccess(true);
      } else {
        setErrors({ general: result.message });
      }
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-violet-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-violet-400/30 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 bg-violet-600/25 rounded-full animate-pulse delay-700"></div>
        </div>

        {/* Holographic Grid */}
        <div className="absolute inset-0 opacity-30">
          <div className="holographic w-full h-full"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <div className="card-primary p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto h-16 w-16 text-green-400"
            >
              <svg className="w-full h-full animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-1xl font-bold gradient-text"
            >
              Registration Successful!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300"
            >
              We've sent a verification email to{' '}
              <span className="text-violet-400 font-semibold">{formData.email}</span>.
              Please check your inbox and click the verification link to activate your account.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <Link
                to="/login"
                className="btn-primary w-full inline-block text-center"
              >
                Go to Login
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
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
        {/* Main Register Card */}
        <div className="card-primary p-8 space-y-6">
          {/* Header */}
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
              Join Us
            </motion.h1>
            <motion.p
              className="text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Create your account
            </motion.p>
            <motion.p
              className="text-gray-400 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300 transition-colors duration-300 font-medium"
              >
                Sign in
              </Link>
            </motion.p>
          </motion.div>

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm"
            >
              {errors.general}
            </motion.div>
          )}

          {/* Register Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`input-primary ${errors.first_name ? 'border-red-500' : ''}`}
                  placeholder="First name"
                />
                {errors.first_name && <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`input-primary ${errors.last_name ? 'border-red-500' : ''}`}
                  placeholder="Last name"
                />
                {errors.last_name && <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>}
              </motion.div>
            </div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-primary ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-primary pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Create a password"
                  maxLength={128}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-400 focus:outline-none"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={`h-2 w-24 rounded-full transition-all duration-300 ${
                    passwordStrength === 'Weak' ? 'bg-red-500' :
                    passwordStrength === 'Medium' ? 'bg-yellow-500' :
                    passwordStrength === 'Strong' ? 'bg-green-500' :
                    passwordStrength === 'Very Strong' ? 'bg-violet-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={`text-xs font-semibold ${
                    passwordStrength === 'Weak' ? 'text-red-400' :
                    passwordStrength === 'Medium' ? 'text-yellow-400' :
                    passwordStrength === 'Strong' ? 'text-green-400' :
                    passwordStrength === 'Very Strong' ? 'text-violet-400' : 'text-gray-400'
                  }`}>{passwordStrength}</span>
                </div>
              )}
              {/* Password Feedback */}
              {passwordFeedback.length > 0 && (
                <ul className="text-xs text-gray-400 mt-1 space-y-0.5">
                  {passwordFeedback.map((msg, i) => (
                    <li key={i}>• {msg}</li>
                  ))}
                </ul>
              )}
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-primary pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm your password"
                  maxLength={128}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-400 focus:outline-none"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </motion.div>

            {/* Register Button */}
            {/* Terms and Conditions Checkbox */}
            <motion.div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="form-checkbox accent-violet-500 mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-300 select-none">
                I accept the{' '}
                <button
                  type="button"
                  className="underline text-violet-400 hover:text-violet-300 focus:outline-none"
                  onClick={() => setShowTermsModal(true)}
                >
                  Terms and Conditions
                </button>
              </label>
            </motion.div>
            {errors.terms && <p className="text-red-400 text-sm mt-1">{errors.terms}</p>}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full btn-primary relative overflow-hidden group mt-6"
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
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h5zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  'Create Account'
                )}
              </span>
            </motion.button>
      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm select-none flex flex-col" style={{ userSelect: 'none' }}>
          <div className="flex-1 flex flex-col justify-center items-center w-full h-full p-0 m-0">
            <div className="bg-gray-900 rounded-none shadow-none w-full h-full flex flex-col animate-fade-in" onCopy={e => e.preventDefault()} onContextMenu={e => e.preventDefault()}>
              <div className="flex flex-col h-full w-full px-0 py-0">
                <h2 className="text-5xl font-extrabold mb-8 text-violet-400 text-center drop-shadow-lg mt-12">Terms and Conditions</h2>
                <div className="text-gray-200 text-2xl overflow-y-auto px-16 flex-1" style={{ WebkitUserSelect: 'none', userSelect: 'none', maxHeight: 'calc(100vh - 200px)' }}>
                  <section className="mb-10">
                    <h5 className="text-1xl font-bold text-violet-300 mb-3">1. Acceptance of Terms</h5>
                    <p>By creating an account, you agree to abide by all rules and policies set forth by our platform. If you do not agree, please do not register.</p>
                  </section>
                  <section className="mb-10">
                    <h5 className="text-1xl font-bold text-violet-300 mb-3">2. Eligibility</h5>
                    <p>You must be at least 18 years old to use this service. By registering, you confirm that you meet this requirement.</p>
                  </section>
                  <section className="mb-10">
                    <h5 className="text-1xl font-bold text-violet-300 mb-3">3. User Conduct</h5>
                    <ul className="list-disc pl-10 space-y-2">
                      <li>No spamming, harassment, or abusive language.</li>
                      <li>Do not upload or share illegal, harmful, or offensive content.</li>
                      <li>Respect the privacy and rights of other users and staff.</li>
                      <li>Do not attempt to hack, disrupt, or misuse the platform.</li>
                    </ul>
                  </section>
                  <section className="mb-10">
                    <h5 className="text-1xl font-bold text-violet-300 mb-3">4. Privacy & Data</h5>
                    <p>Your data is handled according to our <span className="text-violet-400">Privacy Policy</span>. We use industry-standard security to protect your information. We do not sell your data to third parties.</p>
                  </section>
                  <section className="mb-10">
                    <h5 className="text-1xl font-bold text-violet-300 mb-3">5. Account Termination</h5>
                    <p>We reserve the right to suspend or terminate accounts for violations of these terms, or for any activity deemed harmful to the community or platform.</p>
                  </section>
                  <section className="mb-10">
                    <h5 className="text-1xl font-bold text-violet-300 mb-3">6. Limitation of Liability</h5>
                    <p>We are not liable for any damages or losses resulting from your use of the platform. Use the service at your own risk.</p>
                  </section>
                  <section className="mb-10">
                    <h5 className="text-1xl font-bold text-violet-300 mb-3">7. Changes to Terms</h5>
                    <p>We may update these Terms and Conditions at any time. Continued use of the service constitutes acceptance of the new terms.</p>
                  </section>
                  <section>
                    <h5 className="text-1xl font-bold text-violet-300 mb-3">8. Contact</h5>
                    <p>For questions or support, contact us at <span className="text-violet-400">support@example.com</span>.</p>
                  </section>
                </div>
                <div className="w-full flex justify-center items-center py-8 bg-gray-900">
                  <button
                    className="btn-primary text-2xl px-12 py-4"
                    onClick={() => setShowTermsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
          </motion.form>
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

export default Register;