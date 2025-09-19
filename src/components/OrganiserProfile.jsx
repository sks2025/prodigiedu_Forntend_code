import React, { useEffect, useState } from "react";
import "./OrganiserProfileEdit.css";
import { FaUser } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Compition.css";
import {
  socialIcon1,
  socialIcon2,
  socialIcon,
  socialIcon11,
  sendIcon,
} from "../assets/images";
import Organisersheader from "./Organisersheader";
import { useNavigate } from "react-router-dom";
import OrganiserFooter from "./OrganiserFooter";

const OrganiserProfile = () => {
  const [cards, setcards] = useState([]);
  const [profile, setProfile] = useState({});

  const userData = JSON.parse(localStorage.getItem("user_Data"));
  const organizerId = userData?._id;
  const navigate = useNavigate();

  // Fetch all competitions
  const getAllComplete = () => {
    if (!organizerId) return;
    
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `http://localhost:3001/api/competitions/getCompetitionsByOrganizerComplete?organizerId=${organizerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result, "dsfgf");
          // Ensure we always set an array to cards state
          if (Array.isArray(result)) {
            setcards(result);
          } else if (result && Array.isArray(result.data)) {
            setcards(result.data);
          } else if (result && Array.isArray(result.competitions)) {
            setcards(result.competitions);
          } else {
            console.warn("API response is not an array:", result);
            setcards([]);
          }
        })
        .catch((error) => {
          console.error(error);
          setcards([]);
        });
    } catch (error) {
      console.log(error);
      setcards([]);
    }
  };

  const getprofileOrganizer = () => {
    if (!organizerId) return;
    
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        mobileNumber: profile?.mobileNumber || "9876543210",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        `http://localhost:3001/api/organisations/profile/${organizerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("Profile data received:", result);
          setProfile(result.data);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  // On page load
  useEffect(() => {
    if (organizerId) {
      getAllComplete();
      getprofileOrganizer();
    }
  }, [organizerId]);

  // Scroll functionality
  const scrollCards = (direction) => {
    const container = document.getElementById("organiseCardWrapper");
    if (!container) return;
    
    const scrollAmount = 300;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Function to render profile image or avatar
  const renderProfileImage = () => {
    if (profile?.image) {
      return (
        <img
          src={`http://localhost:3001${profile.image}`}
          alt="Organisation"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    return null;
  };

  // Function to render avatar fallback
  const renderAvatar = () => {
    return (
      <div
        style={{
          display: profile?.image ? 'none' : 'flex',
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e0e0e0",
          color: "#666",
          fontSize: "20px",
        }}
      >
        <FaUser size={24} />
      </div>
    );
  };

  if (!organizerId || !profile || Object.keys(profile).length === 0) {
    return null;
  }

  return (
    <div>
      <div className="organiser-edit-container">
        <Organisersheader />
        <main className="organiser-main">
          <div className="organiser-info justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="organiser-image-box edit-mode"
                style={{
                  width: "50px",
                  height: "50px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                  margin: "auto",
                }}
              >
                {renderProfileImage()}
                {renderAvatar()}
              </div>

              <h2 className="organiser-name">
                {profile.name || "Organiser Name"}
              </h2>
            </div>
            <div>
              <button
                onClick={() => {
                  navigate(`/OraganiserProfileUpdate/${organizerId}`);
                }}
                className="organiser-save-button"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <section className="organiser-about">
            <h3>About Us</h3>
            <div className="organiser-editor" style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              minHeight: "100px"
            }}>
              {profile.about || profile.aboutUs || profile.description ? (
                <div 
                  style={{ 
                    lineHeight: "1.6", 
                    color: "#333", 
                    margin: "0",
                    textAlign: "justify",
                    fontSize: "16px"
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: profile.about || profile.aboutUs || profile.description 
                  }}
                />
              ) : (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "80px",
                  color: "#666"
                }}>
                  <p style={{
                    lineHeight: "1.6",
                    color: "#aaa",
                    margin: "0",
                    fontStyle: "italic",
                    textAlign: "center",
                    fontSize: "16px"
                  }}>
                    No About Us information available.
                  </p>
                  <p style={{
                    lineHeight: "1.6",
                    color: "#999",
                    margin: "10px 0 0 0",
                    fontSize: "14px"
                  }}>
                    Click "Edit Profile" to add your organization's description.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="organise-slider-container">
            <button
              className="organise-slider-btn left"
              style={{ top: '50%', transform: 'translateY(-50%)' , left:"-20px" }}
              onClick={() => scrollCards("left")}
            >
              <FiChevronLeft size={32} />
            </button>
            <div className="organise-card-wrapper" id="organiseCardWrapper">
              {Array.isArray(cards) && cards.map((card, index) => (
                <div key={card._id || index} className="organise-user-card">
                  <div className="organise-user-card-image-container">
                    <img
                      src={card.overview?.image ? `http://localhost:3001${card.overview?.image}` : "https://via.placeholder.com/300x200"}
                      alt={card.overview?.name || "Competition"}
                      className="organise-user-card-image"
                      style={{ objectFit: 'contain', width: '100%', height: '180px', borderRadius: '10px 10px 0 0' }}
                      onError={e => { e.target.src = "https://via.placeholder.com/300x200"; }}
                    />
                    <div className="organise-bookmark-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="24"
                        viewBox="0 0 18 24"
                        fill="none"
                      >
                        <path
                          d="M0 24V2.66667C0 1.93333 0.251786 1.30556 0.755357 0.783333C1.25893 0.261111 1.86429 0 2.57143 0H15.4286C16.1357 0 16.7411 0.261111 17.2446 0.783333C17.7482 1.30556 18 1.93333 18 2.66667V24L9 20L0 24Z"
                          fill="#103E13"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="organise-user-card-content">
                    <h2 className="organise-user-card-name">
                      {card.overview?.name || "Unnamed Competition"}
                    </h2>
                    <div className="organise-user-card-details">
                     <div className="d-flex gap-3">
                     <div className="d-flex gap-2">
                        <p className="organise-user-card-label">Date:</p>
                        <p className="organise-user-card-value">
                          {card.overview?.stages?.[0]?.date || "TBD"}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <p className="organise-user-card-label">
                          Variance Score:
                        </p>
                        <p className="organise-user-card-badge">97%</p>
                      </div>
                     </div>
                     <div className="d-flex gap-3">
                     <div className="d-flex gap-2">
                        <p className="organise-user-card-label">Enrollments:</p>
                        <p className="organise-user-card-value">1M+</p>
                      </div>
                      <div className="d-flex gap-2">
                        <p className="organise-user-card-label">
                          Registration Fee:
                        </p>
                        <p className="organise-user-card-value">
                          ₹
                          {card.registration?.registration_type
                            ?.total_registration_fee || "0"}
                        </p>
                      </div>
                     </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="organise-slider-btn right"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => scrollCards("right")}
            >
              <FiChevronRight size={32} />
            </button>
          </div>

          <section className="organiser-contact">
            <h3>Contact Us</h3>
            <div className="organiser-editor">
              <div className="contact-item">
                <strong>Mobile No 1:</strong> 
              </div>
              <div className="contact-item">
                <strong>Mobile No 2:</strong> 
              </div>
              <div className="contact-item">
                <strong>Director Mobile No:</strong> 
              </div>
              <div className="contact-item">
                <strong>Email:</strong> 
              </div>
            </div>
          </section>
        </main>
      </div>
   <OrganiserFooter/>
    </div>
  );
};

export default OrganiserProfile;
