import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import GoogleSignInButton from "../components/GoogleSignInButton";

// Assets
import loginbg from "../assets/loginbg.svg";
import emailIcon from "../assets/mail.svg";
import passwordIcon from "../assets/password.svg";
import loginScattered11 from "../assets/LoginImg1.png";
import loginScattered22 from "../assets/LoginImg2.png";
import loginScattered33 from "../assets/LoginImg3.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [loginScattered11, loginScattered22, loginScattered33];

  const { login } = useAuth();
  const navigate = useNavigate();

  // Image slider effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        setTimeout(() => setIsTransitioning(false), 1000);
      }
    }, 4000);
    return () => clearInterval(slideInterval);
  }, [isTransitioning, images.length]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setErrors({});
    setLoading(true);
    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        navigate("/home");
      } else {
        setErrorMessage(result.message || "Invalid email or password");
        setErrors({ email: true, password: true });
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setErrors({ email: true, password: true });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((p) => !p);

  return (
    <div className="min-h-screen flex items-center justify-center relative p-2">
      <img
        src={loginbg || "../../assets/loginbg.svg"}
        alt="Login background"
        className="absolute inset-0 w-full h-full object-cover -z-5"
      />
      {/* Main container */}
      <div className="flex flex-col lg:flex-row bg-white rounded-lg border border-gray-300 shadow-xl w-full max-w-5xl overflow-hidden">
        {/* Login Form Section with background image */}
        <div
          className="w-full lg:w-1/2 px-10 py-28 bg-cover bg-center rounded-l-lg relative"
          style={{ backgroundImage: `url(${loginbg})` }}
        >
          <div className="bg-white bg-opacity-90 rounded-lg p-2">
            <div className="text-center mb-8">
              <p className="text-yellow-500 font-medium mb-2">User Login</p>
              <h1 className="text-2xl font-bold mb-2 text-yellow-600">Welcome Back!</h1>
              <p className="text-gray-500 text-sm text-center">
                Please enter your login credentials to access <br />
                your account
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Or{" "}
                <Link
                  to="/register"
                  className="text-yellow-500 hover:text-yellow-600 transition-colors duration-300 font-medium"
                >
                  create a new account
                </Link>
              </p>
            </div>
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSignIn}>
              <div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your mail ID"
                    className={`w-full border ${errors.email ? "border-red-500" : "border-gray-200"} rounded-md py-2 px-4 pl-10 transition-colors duration-200 focus:border-yellow-500 hover:border-yellow-400`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value.replace(/\s/g, "").toLowerCase())}
                    required
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <img src={emailIcon || "/placeholder.svg"} alt="Email" className="h-5 w-5" />
                  </div>
                </div>
                <p className={`text-xs text-red-500 mt-1 ml-2 ${errors.email ? "visible" : "invisible"}`}>
                  {errors.email ? "Invalid Username" : "Invalid Username"}
                </p>
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    className={`w-full border ${errors.password ? "border-red-500" : "border-gray-200"} rounded-md py-2 px-4 pl-10 transition-colors duration-200 focus:border-yellow-500 hover:border-yellow-400`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <img src={passwordIcon || "/placeholder.svg"} alt="Password" className="h-5 w-5" />
                  </div>
                  <div
                    className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </div>
                </div>
                <p className={`text-xs text-red-500 mt-1 ml-2 ${errors.password ? "visible" : "invisible"}`}>
                  {errors.password ? "Invalid password" : "Invalid password"}
                </p>
                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Stay logged in
                  </label>
                </div>
                <div className="flex justify-end mt-1">
                  <Link to="/forgot-password" className="text-sm font-semibold text-yellow-500 hover:text-yellow-600 transition-colors duration-300">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors mt-4 flex items-center justify-center relative"
                disabled={loading}
              >
                {loading && (
                  <span className="absolute left-4 flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FACC15" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="#FACC15"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                )}
                {loading ? "Logging in..." : "Sign In"}
              </button>
              
              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              
              {/* Google Sign In Button */}
              <GoogleSignInButton
                onSuccess={() => navigate("/home")}
                onError={(error) => {
                  setErrorMessage(error);
                  setErrors({ email: true, password: true });
                }}
                text="signin_with"
                theme="outline"
                size="large"
              />
              
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  By clicking login you are accepting to all <span className="text-yellow-500">terms and conditions</span>{" "}
                  laid by the platform
                </p>
              </div>
            </form>
          </div>
        </div>
        {/* Image Slider Section */}
        <div className="hidden lg:flex flex-1 justify-center items-center flex-col p-8 bg-white">
          <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-lg">
            {images.map((img, index) => (
              <img
                key={index}
                src={img || "/placeholder.svg"}
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

export default Login;
