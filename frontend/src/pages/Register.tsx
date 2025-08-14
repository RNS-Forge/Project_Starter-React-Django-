import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Image assets (use your actual image imports)
import loginScattered11 from "../assets/LoginImg1.png";
import loginScattered22 from "../assets/LoginImg2.png";
import loginScattered33 from "../assets/LoginImg3.png";

type PasswordStrength = "Weak" | "Medium" | "Strong" | "Very Strong" | "";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("");
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Image slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const images = [loginScattered11, loginScattered22, loginScattered33];

  // Image slider effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsTransitioning(false), 1000);
      }
    }, 4000);
    return () => clearInterval(slideInterval);
  }, [isTransitioning, images.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "terms") {
      setAcceptedTerms(checked);
      if (errors.terms) {
        setErrors((prev) => ({ ...prev, terms: "" }));
      }
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  function evaluatePasswordStrength(password: string) {
    let score = 0;
    const feedback: string[] = [];
    if (password.length >= 8) score++;
    else feedback.push("At least 8 characters");
    if (/[a-z]/.test(password)) score++;
    else feedback.push("Lowercase letter");
    if (/[A-Z]/.test(password)) score++;
    else feedback.push("Uppercase letter");
    if (/\d/.test(password)) score++;
    else feedback.push("Number");
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push("Special character");
    if (password.length >= 12) score++;
    if (/[^a-zA-Z0-9]/.test(password) && password.length >= 16) score++;

    if (score <= 2) setPasswordStrength("Weak");
    else if (score === 3) setPasswordStrength("Medium");
    else if (score === 4 || score === 5) setPasswordStrength("Strong");
    else setPasswordStrength("Very Strong");
    setPasswordFeedback(feedback);
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the Terms and Conditions";
    }
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters long";
      else if (!/[a-z]/.test(formData.password))
        newErrors.password = "Password must contain at least one lowercase letter";
      else if (!/[A-Z]/.test(formData.password))
        newErrors.password = "Password must contain at least one uppercase letter";
      else if (!/\d/.test(formData.password))
        newErrors.password = "Password must contain at least one number";
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
        newErrors.password = "Password must contain at least one special character";
      else if (formData.password.length > 128)
        newErrors.password = "Password must be less than 128 characters";
      else if (/\s/.test(formData.password))
        newErrors.password = "Password cannot contain spaces";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Use the full backend URL for local development
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      let result: { error?: string; message?: string } = {};
      try {
        result = await response.json();
      } catch {
        setErrors({ general: "Server error. Please try again later." });
        setLoading(false);
        return;
      }

      if (response.ok) {
        setSuccess(true);
      } else {
        setErrors({
          general: result.error ?? result.message ?? "Registration failed.",
        });
      }
    } catch {
      setErrors({ general: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 bg-gradient-to-br">
      {/* Main container */}
      <div className="flex flex-col lg:flex-row bg-white rounded-lg border border-gray-300 shadow-xl w-full max-w-5xl overflow-hidden">
        {/* Register Form Section */}
        <div className="w-full lg:w-1/2 px-10 py-14 overflow-y-auto max-h-[90vh]">
          {success ? (
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold text-yellow-600 mb-4">
                Registration Successful!
              </h2>
              <p className="text-gray-700">
                We've sent a verification email to{" "}
                <span className="font-semibold">{formData.email}</span>. Please check your inbox and click the verification link to activate your account.
              </p>
              <Link
                to="/login"
                className="inline-block mt-6 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
              noValidate
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold text-yellow-500 mb-2">Sign Up</h1>
                <p className="text-gray-600 text-lg">Create your account</p>
                <p className="text-gray-500 text-sm mt-2">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-yellow-500 hover:text-yellow-600 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full border rounded-md py-2 px-3 ${
                      errors.first_name ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="First name"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full border rounded-md py-2 px-3 ${
                      errors.last_name ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Last name"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border rounded-md py-2 px-3 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border rounded-md py-2 px-3 pr-10 ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Create a password"
                    maxLength={128}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-yellow-500 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {/* Password strength meter */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="w-full h-2 rounded bg-gray-200">
                      <div
                        className={`h-2 rounded transition-all duration-300 ${
                          passwordStrength === "Weak"
                            ? "bg-red-500"
                            : passwordStrength === "Medium"
                            ? "bg-yellow-500"
                            : passwordStrength === "Strong"
                            ? "bg-green-500"
                            : passwordStrength === "Very Strong"
                            ? "bg-blue-600"
                            : ""
                        }`}
                        style={{
                          width:
                            passwordStrength === "Weak"
                              ? "25%"
                              : passwordStrength === "Medium"
                              ? "50%"
                              : passwordStrength === "Strong"
                              ? "75%"
                              : passwordStrength === "Very Strong"
                              ? "100%"
                              : "0%",
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1 flex items-center">
                      <span
                        className={
                          passwordStrength === "Weak"
                            ? "text-red-500"
                            : passwordStrength === "Medium"
                            ? "text-yellow-500"
                            : passwordStrength === "Strong"
                            ? "text-green-500"
                            : passwordStrength === "Very Strong"
                            ? "text-blue-600"
                            : ""
                        }
                      >
                        {passwordStrength}
                      </span>
                      {passwordFeedback.length > 0 && (
                        <span className="ml-2 text-gray-400">
                          ({passwordFeedback.join(", ")})
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full border rounded-md py-2 px-3 pr-10 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Confirm your password"
                    maxLength={128}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-yellow-500 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and conditions */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="terms"
                  checked={acceptedTerms}
                  onChange={handleChange}
                  className="mr-2 accent-yellow-500"
                  id="terms"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 select-none">
                  I accept the{" "}
                  <button
                    type="button"
                    className="underline text-yellow-500 hover:text-yellow-600 focus:outline-none"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition hover:shadow-lg focus:outline-none disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </motion.form>
          )}
        </div>

        {/* Image slider section */}
        <div className="hidden lg:flex flex-1 justify-center items-center p-8 bg-white">
          <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-lg">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
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

      {/* Terms and conditions modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-yellow-50/60 backdrop-blur-sm flex flex-col items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8">
            <h2 className="text-4xl font-extrabold mb-6 text-yellow-600 text-center">
              Terms and Conditions
            </h2>
            <section className="mb-6">
              <h5 className="text-xl font-bold text-yellow-500 mb-2">1. Acceptance of Terms</h5>
              <p>
                By creating an account, you agree to abide by all rules and policies set forth by our platform. If you do not agree, please do not register.
              </p>
            </section>
            <section className="mb-6">
              <h5 className="text-xl font-bold text-yellow-500 mb-2">2. Eligibility</h5>
              <p>
                You must be at least 18 years old to use this service. By registering, you confirm that you meet this requirement.
              </p>
            </section>
            <section className="mb-6">
              <h5 className="text-xl font-bold text-yellow-500 mb-2">3. User Conduct</h5>
              <ul className="list-disc pl-6 space-y-1">
                <li>No spamming, harassment, or abusive language.</li>
                <li>Do not upload or share illegal, harmful, or offensive content.</li>
                <li>Respect the privacy and rights of other users and staff.</li>
                <li>Do not attempt to hack, disrupt, or misuse the platform.</li>
              </ul>
            </section>
            <section className="mb-6">
              <h5 className="text-xl font-bold text-yellow-500 mb-2">4. Privacy & Data</h5>
              <p>
                Your data is handled according to our{" "}
                <span className="text-yellow-600">Privacy Policy</span>. We use industry-standard security to protect your information. We do not sell your data to third parties.
              </p>
            </section>
            <section className="mb-6">
              <h5 className="text-xl font-bold text-yellow-500 mb-2">5. Account Termination</h5>
              <p>
                We reserve the right to suspend or terminate accounts for violations of these terms, or for any activity deemed harmful to the community or platform.
              </p>
            </section>
            <section className="mb-6">
              <h5 className="text-xl font-bold text-yellow-500 mb-2">6. Limitation of Liability</h5>
              <p>
                We are not liable for any damages or losses resulting from your use of the platform. Use the service at your own risk.
              </p>
            </section>
            <section className="mb-6">
              <h5 className="text-xl font-bold text-yellow-500 mb-2">7. Changes to Terms</h5>
              <p>
                We may update these Terms and Conditions at any time. Continued use of the service constitutes acceptance of the new terms.
              </p>
            </section>
            <section className="mb-6">
              <h5 className="text-xl font-bold text-yellow-500 mb-2">8. Contact</h5>
              <p>
                For questions or support, contact us at{" "}
                <span className="text-yellow-600">support@example.com</span>.
              </p>
            </section>
            <div className="flex justify-center">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
