import React from 'react'
import {
    socialIcon1,
    socialIcon11,
    sendIcon,
} from '../assets/images'
import { FaFacebook, FaLinkedin } from 'react-icons/fa'
import "./home.css"
import { Link } from 'react-router-dom'
const StudentFooter = () => {
  return (
    <div>
        <div>
      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <p className="logo-text">Prodigi</p>
            <p>
              Thakur Village, Kandivali (East),
              <br />
              Mumbai - 400101
            </p>
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
          <div className="footer-links">
            <div className="link-column">
              <h4>Company</h4>
              <Link to="/AboutUs">About us</Link>
              <Link to="/StudentContactus">Contact us</Link>
            </div>
            <div className="link-column">
              <h4>Legal</h4>
              <Link to="/terms">Terms of service</Link>
              <Link to="/privacy">Privacy policy</Link>
            </div>
            <div className="newsletter">
              <h4>Stay up to date</h4>
              <div className="subscribe">
                <input type="email" placeholder="Your email address" />
                <button type="submit">
                  <img src={sendIcon} alt="Send" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </div>
  )
}

export default StudentFooter