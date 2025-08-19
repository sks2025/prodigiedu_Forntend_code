import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ForgotPassword.css";
import Button from "./common/Button";
import Input from "./common/Input";
import Card from "./common/Card";
import { API_BASE_URL, API_ENDPOINTS } from "../config/apiConfig";
// import { toast } from "react-toastify";
const ForgotPasswordVerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  // Get mobile number from navigation state
  useEffect(() => {
    const state = location.state;
    if (state && state.mobileNumber) {
      setMobileNumber(state.mobileNumber);
    } else {
      // If no mobile number in state, redirect back to send OTP page
      navigate("/ForgotPasswordSendOtp");
    }
  }, [location.state, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Helper to format timer as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOTPVerify = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 4) {
      setError("Please enter complete 4-digit OTP");
      // toast.error("Please enter complete 4-digit OTP");
      return;
    }

    if (!mobileNumber) {
      setError("Mobile number not found. Please start over.");
              // toast.error("Mobile number not found. Please start over.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_RESET_OTP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_num: mobileNumber,
          otp: otpString
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // toast.success(result.message);
        setSuccessMessage("");
        // Navigate to password reset page with mobile number
        setTimeout(() => {
          navigate("/ForgotPasswordResetPassword", { 
            state: { 
              mobileNumber: mobileNumber,
              otpVerified: true 
            } 
          });
        }, 1500);
      } else {
        setError(result.message || 'Invalid OTP. Please try again.');
        // toast.error(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Network error. Please check your connection and try again.');
              // toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_num: mobileNumber
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // toast.success("OTP resent successfully!");
        setSuccessMessage("");
        setTimer(120);
        setCanResend(false);
        setOtp(["", "", "", ""]);
      } else {
        setError(result.message || 'Failed to resend OTP');
        // toast.error(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('Network error. Please try again.');
              // toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const isFormValid = otp.every(digit => digit !== "") && !isLoading;
  return (
    <div>
      <div className="contanier-fluid ">
        <div className="registration-container">
          <div >
            <Card className="registration-form1">
              <h2>Verify your mobile Number</h2>

              <p className="otp-instruction mt-5">
                Enter the OTP sent to +91 {mobileNumber ? mobileNumber : "**********"}
              </p>

           
           

              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    className="otp-input"
                    data-index={index}
                    disabled={isLoading}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    style={{
                      opacity: isLoading ? 0.6 : 1,
                      cursor: isLoading ? 'not-allowed' : 'text'
                    }}
                  />
                ))}
              </div>

              <div className="timer">{timer > 0 ? `${formatTime(timer)} Sec` : "Time expired"}</div>

              <div className="resend-otp">
                Don't receive code?{" "}
                <Button 
                  variant="text" 
                  className="resend-button"
                  onClick={handleResendOTP}
                  disabled={!canResend || isLoading}
                  style={{
                    opacity: (!canResend || isLoading) ? 0.5 : 1,
                    cursor: (!canResend || isLoading) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? "Sending..." : "Resend OTP"}
                </Button>
              </div>
             

              <button
                onClick={handleOTPVerify}
                variant="primary"
                size="large"
                disabled={!isFormValid}
                style={{
                  background: !isFormValid ? "#D3D3D3" : "#4CAF4F",
                  cursor: !isFormValid ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.8 : 1,
                  padding:"10px" , borderRadius:"5px" , backgroundColor:"#4CAF4F" , color:"white" , border:"none" , cursor:"pointer", width:"100px", marginLeft:"11rem" , marginTop:"1rem"
                }}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordVerifyOTP;
