import React, { useState } from 'react';
import './StudentLogin.css';
import './Schoollogin.css';
import { Link, useNavigate } from 'react-router-dom';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import googleIcon from '../assets/google-icon.svg';
import microsoftIcon from '../assets/microsoft-icon.svg';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Organiserlogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const isFormInvalid = !formData.email.trim() || !formData.password.trim();

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const capital = /[A-Z]/;
    const number = /[0-9]/;
    const special = /[~`!@#$%^&*()_\-+={[}\]|:;"'<,>.?/]/;
    return (
      minLength.test(password) &&
      capital.test(password) &&
      number.test(password) &&
      special.test(password)
    );
  };

  const validate = () => {
    let errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email or mobile number.';
    } else if (
      formData.email.includes('@') &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      errors.email = 'Please enter a valid email ID.';
    } else if (!formData.email.includes('@') && !/^\+91[0-9]{10}$/.test(formData.email)) {
      errors.email = 'Please enter a valid mobile number (+91XXXXXXXXXX).';
    }

    if (!formData.password) {
      errors.password = 'Please enter your password.';
    } else if (!validatePassword(formData.password)) {
      errors.password =
        'Password must be at least 8 characters, include 1 capital letter, 1 number, and 1 special character.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const isEmail = formData.email.includes('@');
    const credentials = isEmail
      ? { email: formData.email, password: formData.password }
      : { mobile_num: formData.email, password: formData.password };

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(credentials),
      redirect: 'follow',
    };

    try {
      const response = await fetch('https://api.prodigiedu.com/api/organisations/login', requestOptions);
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', JSON.stringify(result.token));
        localStorage.setItem('user_Data', JSON.stringify(result.data));
        navigate('/organiser/dashboard');
      } else {
        throw new Error(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        password: 'Please enter correct password',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="schoollogin">
      <div className="registration-container">
        <div style={{ height: '100vh', overflowY: 'scroll' }}>
          <Card className="registration-form">
            <h1>Welcome back!</h1>
            <div className="social-buttons">
              <Button
                onClick={() => console.log('Google')}
                variant="outline"
                className="social-button google"
              >
                <img src={googleIcon} alt="Google" />
                Log In with Google
              </Button>
              <Button
                onClick={() => console.log('Microsoft')}
                variant="outline"
                className="social-button microsoft"
              >
                <img src={microsoftIcon} alt="Microsoft" />
                Log In with Microsoft
              </Button>
              <Button variant="outline" className="social-button microsoft">
                Log In with SSO
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="registration-form2 mt-5">
              <div className="form-group">
                <div className="w-100">
                  <Input
                    label="Email or Mobile Number"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your Email or Mobile Number"
                    required
                  />
                  {formErrors.email && <div className="error-text">{formErrors.email}</div>}
                </div>
              </div>

              <div className="form-group password-group">
                <div className="w-100">
                  <div className="password-group form-group">
                    <Input
                      className="input-grow"
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="*************"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ marginTop: '-20px' }}
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {formErrors.password && <div className="error-text">{formErrors.password}</div>}
                </div>
              </div>

              <div
                className="forgot-password"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/organiser/forgetpassword')}
              >
                Forgot your password?
              </div>

              <div className="form-actions">
                <div className="terms-checkbox">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <label htmlFor="terms">Remember me</label>
                </div>

                <button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={isFormInvalid || isLoading}
                  className="submit-btn"
                  style={{
                    background: isFormInvalid || isLoading ? '#D3D3D3' : '#4CAF4F',
                  }}
                >
                  {isLoading ? 'Logging in...' : 'LOG IN'}
                </button>
              </div>

              <div className="register-link">
                School not registered yet?{' '}
                <Link to="/organiser/register">Register Now</Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Organiserlogin;