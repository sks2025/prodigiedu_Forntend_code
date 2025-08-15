import React, { useState, useEffect } from "react";
import OrganiserFooter from "./OrganiserFooter";
import Organisersheader from "./Organisersheader";
import "./BankAcount.css"

const BankAcount = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    ifsc: "",
    accountType: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [organizerId, setOrganizerId] = useState(null);
  // Get organizerId from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user_Data');

      if (userData) {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData._id) {
          setOrganizerId(parsedUserData._id);
          console.log('Organizer ID loaded:', parsedUserData._id);
        } else {
          setMessage({ type: 'error', text: 'Organizer ID not found in user data' });
        }
      } else {
        setMessage({ type: 'error', text: 'User data not found. Please login again.' });
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setMessage({ type: 'error', text: 'Error loading user data. Please login again.' });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!organizerId) {
      setMessage({ type: 'error', text: 'Organizer ID is required. Please login again.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`https://api.prodigiedu.com/api/competitions/bankaccount/${organizerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || 'Bank account added successfully!' });
        // Reset form after successful submission
        setFormData({
          accountNumber: "",
          ifsc: "",
          accountType: ""
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to add bank account' });
      }
    } catch (error) {
      console.error('Error adding bank account:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.accountNumber.trim() &&
    formData.ifsc.trim() &&
    formData.accountType;

  // Show loading message while getting organizerId
  if (!organizerId && !message.text.includes('error')) {
    return (
      <div>
        <Organisersheader />
        <div style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', color: '#666' }}>Loading organizer data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Organisersheader />
      <div className="bankAccount-header">
        <h2 className="bankAccount-title">Bank Account Addition</h2>
      </div>

      {/* Message Display */}
      {message.text && (
        <div style={{
          margin: '20px auto',
          maxWidth: '600px',
          padding: '12px 20px',
          borderRadius: '6px',
          textAlign: 'center',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      <div className="bankAccount-container">
        <form className="bankAccount-form" onSubmit={handleSubmit}>
          <div className="bankAccount-formGroup">
            <label className="bankAccount-label">
              Account No.<span className="bankAccount-required">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              className="bankAccount-input"
              placeholder="Enter Bank Account number"
              value={formData.accountNumber}
              onChange={handleInputChange}
              maxLength="18"
              disabled={loading}
            />
          </div>

          <div className="bankAccount-formGroup">
            <label className="bankAccount-label">
              IFSC<span className="bankAccount-required">*</span>
            </label>
            <input
              type="text"
              name="ifsc"
              className="bankAccount-input"
              placeholder="Enter IFSC"
              value={formData.ifsc}
              onChange={handleInputChange}
              maxLength="11"
              disabled={loading}
            />
          </div>

          <div className="bankAccount-formGroup">
            <label className="bankAccount-label">
              Account Type<span className="bankAccount-required">*</span>
            </label>
            <select
              name="accountType"
              className="bankAccount-select"
              value={formData.accountType}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">Select</option>
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>
          </div>
        </form>
        <div className="bankAccount-button-outer">
          <button
            className="bankAccount-button"
            disabled={!isFormValid || loading}
            onClick={handleSubmit}
            style={{
              opacity: (!isFormValid || loading) ? 0.6 : 1,
              cursor: (!isFormValid || loading) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Adding...' : 'Add Bank Account'}
          </button>
        </div>
      </div>
      <OrganiserFooter />
    </div>
  );
};

export default BankAcount;
