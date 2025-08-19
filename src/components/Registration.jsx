import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import './Registration.css';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

const Registration = () => {
    const [mobileError, setMobileError] = useState('');
  const [apiError, setApiError] = useState('');

  const [mobileNumber, setMobileNumber] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form is invalid if mobile number is empty OR terms are not accepted
  const isFormInvalid = !mobileNumber.trim() || !acceptTerms;
  
  const validateMobileNumber = (mobile) => {
    // Check if it's exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) {
      return 'Enter a valid 10-digit mobile number';
    }
    
    // Check for invalid patterns like all same digits
    if (/^(\d)\1{9}$/.test(mobile)) {
      return 'Please enter a valid mobile number';
    }
    
    // Check for common invalid patterns
    if (/^0{10}$/.test(mobile) || /^1{10}$/.test(mobile)) {
      return 'Please enter a valid mobile number';
    }
    
    return '';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMobileError('');
    setApiError('');

    if (!mobileNumber.trim()) {
      setMobileError('Mobile number is required');
      return;
    }

    // Validate mobile number format
    const validationError = validateMobileNumber(mobileNumber.trim());
    if (validationError) {
      setMobileError(validationError);
      return;
    }

    if (!acceptTerms) {
      setApiError('Please accept the terms and conditions');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SEND_OTP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_num: mobileNumber })
      });
      const data = await response.json();
      setIsLoading(false);
      
      if (!response.ok) {
        if (data.message && data.message.includes('Test mode is active')) {
          setApiError('Test mode is active. Please use the test mobile number: +911234567890');
        } else {
          setApiError(data.message || 'Failed to send OTP. Please try again.');
        }
        return;
      }
      
      // toast.success('OTP sent successfully!');
      navigate('/student/register/verify-mobile-otp', { state: { mobileNumber } });
    } catch (err) {
      setIsLoading(false);
      setApiError('Failed to send OTP. Please try again.');
    }
  };


  return (
    <div className="registration-container">
      <Card className="registration-form">
        <h1>Register Now to Begin Your Success Journey</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="mobileNumber" style={{ fontSize: '16px', fontWeight: '' }}>Mobile Number <span style={{ color: 'red' }}> *</span></label>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' ,borderBottom:"2px solid grey"}}>
             <div style={{ 
               fontSize: '16px', 
               fontWeight: 'bold', 
               color: '#333',
               minWidth: '40px'
             }}>
               +91
             </div>
             <div style={{ flex: 1 }}>
               <Input
                 id="mobileNumber"
                 name="mobileNumber"
                 value={mobileNumber}
                 onChange={(e) => {
                   const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                   if (value.length <= 10) {
                     setMobileNumber(value);
                     if (value.length === 10 || value.length === 0) {
                       setMobileError('');
                     } else {
                       setMobileError('Enter a valid 10-digit mobile number');
                     }
                   }
                 }}
                 placeholder="Enter your Mobile Number"
                 type="tel"
                 required
                                   style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '0',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-bottom-color 0.3s ease',
                    backgroundColor: 'transparent'
                  }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#4CAF4F'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#ccc'}
                />
             </div>
           </div>
                     {mobileError && <p className="input-error" style={{ color: 'red', fontSize: '14px', marginTop: '5px', marginBottom: '0' }}>{mobileError}</p>}
           {apiError && <p className="api-error" style={{ color: 'red', fontSize: '14px', marginTop: '5px', marginBottom: '15px', textAlign: 'center' }}>{apiError}</p>}

          {/* Test mode notice
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '4px', 
            padding: '8px 12px', 
            marginBottom: '16px',
            fontSize: '12px',
            color: '#856404'
          }}>
            <strong>Test Mode:</strong> For testing purposes, please use the mobile number: <strong>8838838838</strong>
          </div> */}

          <div className="form-action">
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I accept the{" "}
                <NavLink to="/termcondition">Terms & Condition</NavLink>{" "}
                and{" "}
                <NavLink to="/privacypolicy">Privacy Policy</NavLink>
              </label>
            </div>


          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              variant="primary"
              size="large"
              disabled={isFormInvalid}

              style={{
                background: isFormInvalid ? "#D3D3D3" : "#4CAF4F",
                width: '200px',
                padding: '10px',
                borderRadius: '5px',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
          <br />
          <div className="login-link">
            Own an Account? <Link to="/student/login">Log In</Link>
          </div>
        </form>
      </Card>

    </div>
  );
};

export default Registration; 