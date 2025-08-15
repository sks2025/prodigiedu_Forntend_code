import React from "react";
import "./OrganiserProfileEdit.css";
import { FaUpload } from "react-icons/fa";
import "./Compition.css";
import {
  socialIcon1,
  socialIcon2,
  socialIcon,
  socialIcon11,
  sendIcon,
} from "../assets/images";
import { Link } from "react-router-dom";

import { FaFacebook, FaLinkedin } from "react-icons/fa";

const OrganiserFooter = () => {
  return (
    <div>
      <footer>
        <div class="footer-content">
          <div class="footer-logo">
            <p class="logo-text">Prodigi</p>
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
          <div class="footer-links">
            <div class="link-column">
              <h4>Company</h4>
              <Link to="/AboutUs">About us</Link>
              <Link to="/contact">Contact us</Link>
            </div>
            <div class="link-column">
              <h4>Legal</h4>
              <Link to="/terms">Terms of service</Link>
              <Link to="/privacy">Privacy policy</Link>
            </div>
            <div class="newsletter">
              <h4>Stay up to date</h4>
              <div class="subscribe">
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
  )
}

export default OrganiserFooter