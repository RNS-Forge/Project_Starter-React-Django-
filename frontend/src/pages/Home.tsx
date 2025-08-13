import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlickeringGrid } from '../components/magicui/flickering-grid';

const Home: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-violet-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-violet-400/30 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 bg-violet-600/25 rounded-full animate-pulse delay-700"></div>
        </div>
        {/* Flickering Grid Background */}
        <div className="absolute inset-0 opacity-20 z-0">
          <FlickeringGrid
            squareSize={4}
            gridGap={6}
            flickerChance={0.3}
            color="rgb(255, 255, 255)"
            maxOpacity={0.15}
            className="w-full h-full" />
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
              className="mx-auto h-16 w-16 text-violet-400"
            >
              <svg className="w-full h-full animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
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
      {/* Flickering Grid Background */}
      <div className="absolute inset-0 opacity-20 z-0">
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="rgb(255, 255, 255)"
          maxOpacity={0.15}
          className="w-full h-full" />
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
        className="relative z-10 w-full max-w-2xl mx-4"
      >
        <div className="card-primary p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="text-center sm:text-left">
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
                Welcome, {user.first_name}!
              </motion.h1>
              <motion.p
                className="text-gray-300 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                You have successfully logged in. Your email verification status is below.
              </motion.p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-primary px-6 py-2 text-base"
            >
              Logout
            </button>
          </motion.div>

          {/* Email Status */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium text-gray-300">Email Status:</span>
            {user.is_verified ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx={4} cy={4} r={3} />
                </svg>
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx={4} cy={4} r={3} />
                </svg>
                Pending Verification
              </span>
            )}
          </div>

          {/* User Information */}
          <div className="bg-violet-900/10 rounded-xl p-6 shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Full name</div>
                <div className="text-lg text-gray-100 font-semibold">{user.first_name} {user.last_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Email address</div>
                <div className="text-lg text-gray-100 font-semibold">{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Account created</div>
                <div className="text-lg text-gray-100 font-semibold">{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              {user.last_login && (
                <div>
                  <div className="text-sm text-gray-400">Last login</div>
                  <div className="text-lg text-gray-100 font-semibold">{new Date(user.last_login).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-400">Verification status</div>
                <div className="text-lg text-gray-100 font-semibold">{user.is_verified ? (
                  <span className="text-green-400 font-medium">Email Verified</span>
                ) : (
                  <span className="text-yellow-400 font-medium">Email Pending Verification</span>
                )}</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-violet-900/20 rounded-xl p-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-100">Secure Authentication</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Your account is protected with email verification and secure password requirements.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-violet-900/20 rounded-xl p-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-100">Email Verification</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Complete email verification system with activation and password reset links.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-violet-900/20 rounded-xl p-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-100">Password Security</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Strong password requirements and secure password reset functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>

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

export default Home;
