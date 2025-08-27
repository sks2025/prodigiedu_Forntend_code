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
import headerlogos from "../images/prodigilogowhite.svg"
import namelogo from "../images/footerlogo.png"

const FooterUsers = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <div>
    <div>
  <footer>
    <div className="footer-content">
      <div className="footer-logo">
      <Link to="/" style={{textDecoration:"none"}} >
                         <div className='pt-1' style={{display: 'flex', alignItems: 'center', gap:'5px'}}>
             {/* <img src={headerlogos} alt="" style={{height: '30px'}} /> */}
             <img src={namelogo} alt="" style={{width: '170px', objectFit: 'cover', display: 'block'}} />
           </div>
        </Link>
        <p>
          ProdigiEdu Services Private Limited
          <br />
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
          <Link to="/AboutUs" onClick={scrollToTop}>About us</Link>
          <Link to="/StudentContactus" onClick={scrollToTop}>Contact us</Link>
        </div>
        <div className="link-column">
          <h4>Legal</h4>
          <Link to="/termcondition" onClick={scrollToTop}>Terms of service</Link>
          <Link to="/privacypolicy" onClick={scrollToTop}>Privacy policy</Link>
          <Link to="/RefyndCancel" onClick={scrollToTop}>Refund & Cancellation Policy</Link>
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
  );
};

export default FooterUsers;
