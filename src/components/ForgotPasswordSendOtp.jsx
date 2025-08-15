import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Button from "./common/Button";
import Input from "./common/Input";
import Card from "./common/Card";
import { API_BASE_URL, API_ENDPOINTS } from "../config/apiConfig";

const ForgotPasswordSendOtp = () => {
  const navigate = useNavigate();
  const [mobileNumber, setmobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!mobileNumber.trim()) return;

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
          mobile_num: mobileNumber.trim()
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage(result.message);
        // Pass mobile number to next component via state
        navigate("/ForgotPasswordVerify", {
          state: {
            mobileNumber: mobileNumber.trim(),
            message: result.message
          }
        });
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormInvalid = !mobileNumber.trim() || isLoading


  return (
    <div>

      <div className="registration-container">
        <div className="registration-form" style={{ paddingTop: "7rem", textAlign: "center" }}>

          <div style={{ textAlign: "center" , lineHeight:"1.3"  }}>
            <h2>Forgot your password?</h2>
            <p className="forgot-password-text">
              Don't worry! It happens. Please enter your  registered <br />  mobile
              number
            </p>
          </div>

          <form onSubmit={handleSendOTP}>
            <div className="form-group d-block">
              <Input
                label="Mobile Number"
                name="mobileNumber"
                placeholder="+91  enter your mobile number"
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => { setmobileNumber(e.target.value) }}
              />

              {/* Error Message */}
              {error && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '14px',
                  marginTop: '8px',
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
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '4px'
                }}>
                  {successMessage}
                </div>
              )}

              <div style={{textAlign:"center"}}>
                <button
                  type="submit"
                  size="large"
                
                  disabled={isFormInvalid}
                  style={{
                    background: isFormInvalid ? "#D3D3D3" : "#4CAF4F",
                    cursor: isFormInvalid ? "not-allowed" : "pointer",
                     padding:"10px" , borderRadius:"5px" , backgroundColor:"#4CAF4F" , color:"white" , border:"none" , cursor:"pointer"
                  }}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            </div>

            <div>
              <Link className="email-link">
                Try using Email ID
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>

  );
};

export default ForgotPasswordSendOtp;