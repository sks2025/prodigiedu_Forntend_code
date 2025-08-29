import React, { useState, useEffect } from 'react';
import Studentheaderhome from './Studentheaderhome';
import StudentFooter from './StudentFooter';
import './StudentContactus.css';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaTwitter, FaInstagram } from 'react-icons/fa';
import {
  socialIcon1,
  socialIcon11,
  sendIcon,
} from '../assets/images'
import { FaFacebook, FaLinkedin } from 'react-icons/fa'

const initialState = {
  name: '',
  organizationName: '',
  email: '',
  phone: '',
  message: '',
};

const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

const StudentContactus = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.name) newErrors.name = 'Please enter a valid name';
    if (!form.email) newErrors.email = 'Please enter a valid email ID';
    else if (!validateEmail(form.email)) newErrors.email = 'Please enter a valid email ID';
    if (!form.phone) newErrors.phone = 'Please enter a valid mobile number';
    else if (!validatePhone(form.phone)) newErrors.phone = 'Please enter a valid mobile number';
    if (!form.message) newErrors.message = 'Please write your message';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://api.prodigiedu.com/api/contact-us/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          organizationName: form.organizationName,
          email: form.email,
          phone: form.phone, // Send 10-digit phone number without +91
          message: form.message,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setForm(initialState);
      } else {
        setErrors({ api: data.message || 'Something went wrong' });
      }
    } catch (err) {
      setErrors({ api: 'Server error. Please try again later.' });
    }
    setLoading(false);
  };

  return (
    <>
      <Studentheaderhome />
      <div className="gen-contact-container" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Contact Info */}
        <div className="gen-contact-card">
          <h2>Contact Information</h2>
          <div className="gen-contact-info-row">
            <FiPhone color="#fff" size={22} style={{ minWidth: 22 }} />
            <span>+91 9251033310</span>
          </div>
          <div className="gen-contact-info-row">
            <FiMail color="#fff" size={22} style={{ minWidth: 22 }} />
            <span>support@prodigiedu.com</span>
          </div>
          <div className="gen-contact-info-row">
            <FiMapPin color="#fff" size={22} style={{ minWidth: 22 }} />
            <span>
              ProdigiEdu Services Private Limited
              <br />
              A-401, Oberoi Park View,
              <br />
              Thakur Village, Kandivali (East),
              <br />
              Mumbai - 400101
            </span>
          </div>
          {/* <div className=" gap-4 pb-4" style={{ paddingBottom: '20px',gap:"5px" }}>
            <a href="https://x.com/ProdigiEdu" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} className="gen-contact-icon" />
            </a>
            <a href="https://www.instagram.com/prodigi_edu/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} className="gen-contact-icon ms-2" />
            </a>
          </div> */}
          <div className="social-links">
              <a href="https://www.instagram.com/prodigi_edu/" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <img src={socialIcon11} alt="Instagram" />
              </a>
              <a href="https://www.facebook.com/people/Prodigi/61577937643476/" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <FaFacebook />
              </a>
              <a href="https://x.com/ProdigiEdu" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <img src={socialIcon1} alt="Twitter" />
              </a>
              <a href="https://www.linkedin.com/company/106125564/" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <FaLinkedin />
              </a>
            </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="gen-contact-form">
          <div className="gen-contact-row" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            <div className="gen-contact-col">
              <label className="gen-contact-label">
                Name<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`gen-contact-input${errors.name ? ' gen-contact-input-error' : ''}`}
              />
              {errors.name && <span className="gen-contact-error">{errors.name}</span>}
            </div>
            <div className="gen-contact-col">
              <label className="gen-contact-label">Organization Name</label>
              <input
                name="organizationName"
                value={form.organizationName}
                onChange={handleChange}
                placeholder="Enter Organization Name"
                className="gen-contact-input"
              />
            </div>
          </div>
          <div className="gen-contact-row" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            <div className="gen-contact-col">
              <label className="gen-contact-label">
                Email<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email ID"
                className={`gen-contact-input${errors.email ? ' gen-contact-input-error' : ''}`}
              />
              {errors.email && <span className="gen-contact-error">{errors.email}</span>}
            </div>
            <div className="gen-contact-col">
              <label className="gen-contact-label">
                Phone Number<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                name="phone"
                value={form.phone ? `+91${form.phone}` : ''}
                onChange={(e) => {
                  let val = e.target.value.replace(/^\+91/, '').replace(/\D/g, '');
                  setForm({ ...form, phone: val });
                  setErrors({ ...errors, phone: '' });
                }}
                placeholder="+91 Enter your mobile number"
                className={`gen-contact-input gen-contact-phone-input${errors.phone ? ' gen-contact-input-error' : ''}`}
                maxLength={13}
              />
              {errors.phone && <span className="gen-contact-error">{errors.phone}</span>}
            </div>
          </div>
          <div className="gen-contact-col">
            <label className="gen-contact-label">
              Message<span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message"
              className={`gen-contact-textarea${errors.message ? ' gen-contact-input-error' : ''}`}
            />
            {errors.message && <span className="gen-contact-error">{errors.message}</span>}
          </div>
          {errors.api && <span className="gen-contact-error">{errors.api}</span>}
          <button type="submit" disabled={loading} className="gen-contact-btn">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {success && (
            <div className="gen-contact-popup-overlay">
              <div className="gen-contact-popup">
                <div style={{ fontSize: 54, color: '#1e6b3a', marginBottom: 18 }}>✔️</div>
                <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Message sent successfully.</div>
                <div style={{ color: '#555', marginBottom: 28 }}>Someone from our team will contact you soon.</div>
                <button onClick={() => setSuccess(false)} className="gen-contact-btn">
                  OK
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <StudentFooter />
    </>
  );
};

export default StudentContactus;