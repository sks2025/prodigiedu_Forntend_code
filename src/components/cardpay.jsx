import React, { useState } from 'react';
import FooterUsers from "./FooterUsers";
import Studentheaderhome from './Studentheaderhome';
import credit from "../images/credit.svg";
import bank from "../images/bank.svg";
import upi from "../images/UPI.svg";
import './cardpay.css';

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

const CardPay = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Payment processing logic would go here
    console.log('Payment submitted:', formData);
  };

  return (
    <div>
      <Studentheaderhome />
      <div className="cardpay">
        <div className="payment-container">
          {/* Payment Method Sidebar */}
          <div className="payment-sidebar">
            <h3 className="sidebar-title">Pay with</h3>

            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                className={`payment-option ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                {selectedPaymentMethod === method.id && (
                  <div className="option-indicator"></div>
                )}
                <img src={method.icon} alt={method.name} />
                <span>{method.name}</span>
              </div>
            ))}
          </div>

          {/* Payment Form */}
          <div className="payment-form">
            <form onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  placeholder="Name"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card number</label>
                <div className="card-number-container">
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 1234 1234 1234"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
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
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="expiry">Expiry</label>
                  <input
                    type="text"
                    id="expiry"
                    placeholder="MM / YY"
                    value={formData.expiry}
                    onChange={(e) => handleInputChange('expiry', e.target.value)}
                  />
                </div>

                <div className="form-group half">
                  <label htmlFor="cvc">CVC</label>
                  <input
                    type="text"
                    id="cvc"
                    placeholder="CVC"
                    value={formData.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="payment-button">
                Make Payment
              </button>
            </form>
          </div>
        </div>
      </div>
      <FooterUsers />
    </div>
  );
};

export default CardPay;








