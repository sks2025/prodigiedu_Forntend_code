import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ForgotPassword.css";
import Button from "./common/Button";
import Card from "./common/Card";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { API_BASE_URL, API_ENDPOINTS } from "../config/apiConfig";

const ForgotPasswordResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Get mobile number from navigation state
  useEffect(() => {
    const state = location.state;
    if (state && state.mobileNumber && state.otpVerified) {
      setMobileNumber(state.mobileNumber);
    } else {
      // If no proper verification state, redirect back to send OTP
      navigate("/ForgotPasswordSendOtp");
    }
  }, [location.state, navigate]);

  // Password validation
  const validatePassword = (pwd) => {
    const errors = {
      length: pwd.length < 8,
      uppercase: !/[A-Z]/.test(pwd),
      lowercase: !/[a-z]/.test(pwd),
      number: !/\d/.test(pwd),
      special: !/[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
    setPasswordErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validatePassword(value);
    setError(""); // Clear errors when user types
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccessMessage("");

    // Validation checks
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (!reenterPassword.trim()) {
      setError("Please re-enter your password");
      return;
    }

    if (password !== reenterPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password does not meet security requirements");
      return;
    }

    if (!mobileNumber) {
      setError("Mobile number not found. Please start over.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_num: mobileNumber,
          newPassword: password
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage(result.message);
        // Navigate to login page after 2 seconds
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "Password reset successfully! Please login with your new password.",
              mobileNumber: mobileNumber 
            } 
          });
        }, 2000);
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleReenterPasswordVisibility = () => {
    setShowReenterPassword(!showReenterPassword);
  };

  const isFormValid = password.trim() && 
                     reenterPassword.trim() && 
                     password === reenterPassword && 
                     validatePassword(password) && 
                     !isLoading;

  return (
    <div className="contanier-fluid">
      <div className="row">
        <div className="col-lg-6 left-panel"></div>
        <div className="col-lg-6">
          <Card className="registration-form1">
            <h2>Create New Password</h2>
            
            {/* Error Message */}
            {error && (
              <div style={{ 
                color: '#dc3545', 
                fontSize: '14px', 
                marginBottom: '16px',
                padding: '8px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {successMessage && (
              <div style={{ 
                color: '#155724', 
                fontSize: '14px', 
                marginBottom: '16px',
                padding: '8px',
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '4px'
              }}>
                {successMessage}
              </div>
            )}

            <label style={{marginTop:"3rem"}}>Password</label>
            <div className="password-wrapper">
              <input
                className="custom-input1"
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={password}
                disabled={isLoading}
                onChange={(e) => handlePasswordChange(e.target.value)}
                style={{
                  opacity: isLoading ? 0.6 : 1
                }}
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
                style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            {/* Password Requirements */}
            <div style={{ fontSize: '12px', marginTop: '8px', marginBottom: '16px' }}>
              <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Password Requirements:</p>
              <div style={{ color: passwordErrors.length ? '#dc3545' : '#28a745' }}>
                ✓ At least 8 characters
              </div>
              <div style={{ color: passwordErrors.uppercase ? '#dc3545' : '#28a745' }}>
                ✓ One uppercase letter
              </div>
              <div style={{ color: passwordErrors.lowercase ? '#dc3545' : '#28a745' }}>
                ✓ One lowercase letter
              </div>
              <div style={{ color: passwordErrors.number ? '#dc3545' : '#28a745' }}>
                ✓ One number
              </div>
              <div style={{ color: passwordErrors.special ? '#dc3545' : '#28a745' }}>
                ✓ One special character
              </div>
            </div>

            <label>Re-enter Password</label>
            <div className="password-wrapper">
              <input
                className="custom-input1"
                type={showReenterPassword ? "text" : "password"}
                placeholder="************"
                value={reenterPassword}
                disabled={isLoading}
                onChange={(e) => setReenterPassword(e.target.value)}
                style={{
                  opacity: isLoading ? 0.6 : 1,
                  borderColor: reenterPassword && password !== reenterPassword ? '#dc3545' : ''
                }}
              />
              <span
                className="password-toggle"
                onClick={toggleReenterPasswordVisibility}
                style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {showReenterPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            {/* Password Match Indicator */}
            {reenterPassword && (
              <div style={{ 
                fontSize: '12px', 
                marginTop: '4px',
                color: password === reenterPassword ? '#28a745' : '#dc3545'
              }}>
                {password === reenterPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}

            <Button
              onClick={handleResetPassword}
              variant="primary"
              size="large"
              className="submit-btn1"
              disabled={!isFormValid}
              style={{
                background: !isFormValid ? "#D3D3D3" : "#4CAF4F",
                cursor: !isFormValid ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.8 : 1,
                marginTop: "20px"
              }}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordResetPassword;