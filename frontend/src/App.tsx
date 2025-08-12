import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black-secondary to-black-accent">
      <div className="cyber-grid min-h-screen">
        <AuthProvider>
          <Router>
            <div className="relative">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                
                {/* Protected routes */}
                <Route 
                  path="/home" 
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;
