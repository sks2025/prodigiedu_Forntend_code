import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Compitionspayment.css";
import StudentFooter from "./StudentFooter";
import Studentheaderhome from "./Studentheaderhome";
import credit from "../images/credit.svg";
import bank from "../images/bank.svg";
import upi from "../images/UPI.svg";

// Payment method options data
const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit / Debit Card', icon: credit, selected: true },
  { id: 'upi', name: 'UPI', icon: upi, selected: false },
  { id: 'netbanking', name: 'Net Banking', icon: bank, selected: false }
];

// Card brand icons
const CARD_BRANDS = [
  {
    name: 'Visa',
    src: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg'
  },
  {
    name: 'Mastercard',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png'
  },
  {
    name: 'RuPay',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png'
  }
];

const CompitionsPlansSummery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, form } = location.state || {};
  
  // State management
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [formData, setFormData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState({});
  const [cardBrand, setCardBrand] = useState("");

  // Calculate prices
  const planPrice = Number(plan?.price) || 1200;
  const convenienceFee = 60;
  const total = planPrice + convenienceFee;

  // Card number formatting and brand detection
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const detectCardBrand = (number) => {
    const digits = number.replace(/\D/g, "");
    if (/^4/.test(digits)) return "Visa";
    if (/^5[1-5]/.test(digits)) return "MasterCard";
    if (/^3[47]/.test(digits)) return "Amex";
    return "";
  };

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "cardNumber") {
      const formatted = formatCardNumber(value);
      setFormData(prev => ({ ...prev, cardNumber: formatted }));
      setCardBrand(detectCardBrand(formatted));
    } else if (name === "expiry") {
      let digits = value.replace(/[^\d]/g, "");
      if (digits.length > 4) digits = digits.slice(0, 4);
      let formatted = digits;
      if (digits.length > 2) {
        formatted = digits.slice(0, 2) + " / " + digits.slice(2);
      }
      setFormData(prev => ({ ...prev, expiry: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPayment(methodId);
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!formData.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";
    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length < 12) newErrors.cardNumber = "Valid card number required";
    if (!formData.expiry.trim() || !/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(formData.expiry)) newErrors.expiry = "Expiry must be MM / YY";
    if (!formData.cvc.trim() || formData.cvc.length < 3) newErrors.cvc = "CVC required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePayment();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    
    // Simulate payment success
    window.alert("Payment successful! Registration complete.");
    navigate("/");
  };

  return (
    <>
      <Studentheaderhome />
      <div className="payment-container">
        <div className="payment-content">
          {/* Left Panel - Plan Summary */}
          <div className="left-panel">
            {/* Competition Header */}
            <div className="competition-header">
              <div className="logo-placeholder"></div>
              <div className="competition-info">
                <h2 className="competition-name">
                  {form?.competitionName || "Competition Name"}
                </h2>
                <p className="institute-name">
                  {form?.instituteName || "Institute Name"}
                </p>
              </div>
            </div>

            {/* Plan Summary Card */}
            <div className="plan-summary-card">
              <h3 className="plan-summary-title">Plan summary</h3>
              
              <div className="plan-item">
                <div className="plan-details">
                  <div className="plan-name">
                    {plan?.title || "Advanced Prep"}
                  </div>
                  <div className="plan-description">
                    {plan?.subtitle || "Registration + Prep + Past Year Question Papers"}
                  </div>
                </div>
                <div className="plan-price">INR {planPrice.toFixed(2)}</div>
              </div>

              <div className="plan-item">
                <div className="plan-details">
                  <div className="plan-name">Convenience Fee</div>
                </div>
                <div className="plan-price">INR {convenienceFee.toFixed(2)}</div>
              </div>

              <div className="plan-divider"></div>

              <div className="total-section">
                <div className="total-label">Overall total</div>
                <div className="total-amount">INR {total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Payment Form */}
          <div className="right-panel">
            <div className="payment-form-container">
              {/* Payment Methods Sidebar */}
              <div className="payment-sidebar">
                <h3 className="sidebar-title">Pay with</h3>
                
                <div className="payment-options">
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      className={`payment-option ${selectedPayment === method.id ? "selected" : ""}`}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                    >
                      {selectedPayment === method.id && (
                        <div className="option-indicator"></div>
                      )}
                      <img src={method.icon} alt={method.name} />
                      <span>{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Form */}
              <div className="payment-form-content">
                {selectedPayment === "card" && (
                  <form className="card-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="nameOnCard">Name on Card</label>
                      <input
                        type="text"
                        id="nameOnCard"
                        name="nameOnCard"
                        placeholder="Name"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                      />
                      {errors.nameOnCard && (
                        <div className="error-message">{errors.nameOnCard}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardNumber">Card number</label>
                      <div className="card-input-container">
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 1234 1234 1234"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          maxLength={19}
                          autoComplete="cc-number"
                        />
                        <div className="card-icons">
                          {CARD_BRANDS.map((brand) => (
                            <img
                              key={brand.name}
                              src={brand.src}
                              alt={brand.name}
                            />
                          ))}
                        </div>
                      </div>
                      {errors.cardNumber && (
                        <div className="error-message">{errors.cardNumber}</div>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group half">
                        <label htmlFor="expiry">Expiry</label>
                        <input
                          type="text"
                          id="expiry"
                          name="expiry"
                          placeholder="MM / YY"
                          value={formData.expiry}
                          onChange={handleInputChange}
                        />
                        {errors.expiry && (
                          <div className="error-message">{errors.expiry}</div>
                        )}
                      </div>
                      <div className="form-group half">
                        <label htmlFor="cvc">CVC</label>
                        <input
                          type="text"
                          id="cvc"
                          name="cvc"
                          placeholder="CVC"
                          value={formData.cvc}
                          onChange={handleInputChange}
                        />
                        {errors.cvc && (
                          <div className="error-message">{errors.cvc}</div>
                        )}
                      </div>
                    </div>

                    <button className="make-payment-btn" type="submit">
                      Make Payment
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <StudentFooter />
    </>
  );
};

export default CompitionsPlansSummery;