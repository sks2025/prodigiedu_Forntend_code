import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./Competitionsdetail.css";
import FooterUsers from "./FooterUsers";
import Organisersheader from "./Organisersheader";

function Ocompetitionsdetail() {
  const { competitionsid } = useParams();

  // Separate state for each section
  const [sectionData, setSectionData] = useState({
    overview: null,
    syllabus: null,
    pattern: null,
    eligibility: null,
    registration: null,
    awards: null
  });

  // Loading states for each section
  const [sectionLoading, setSectionLoading] = useState({
    overview: true,
    syllabus: true,
    pattern: true,
    eligibility: true,
    registration: true,
    awards: true
  });

  // Error states for each section
  const [sectionErrors, setSectionErrors] = useState({
    overview: null,
    syllabus: null,
    pattern: null,
    eligibility: null,
    registration: null,
    awards: null
  });

  // Add studentInformation state
  const [studentInformation, setStudentInformation] = useState({ StudentDetails: [], SchoolDetails: [] });

  // Get organizer data from localStorage
  const getOrganizerName = () => {
    try {
      const userDataString = localStorage.getItem("user_Data");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData?.name || userData?.directorName || "Prodigi";
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
    return "Prodigi";
  };

  // Helper function to update section loading state
  const updateSectionLoading = (section, isLoading) => {
    setSectionLoading(prev => ({
      ...prev,
      [section]: isLoading
    }));
  };

  // Helper function to update section error state
  const updateSectionError = (section, error) => {
    setSectionErrors(prev => ({
      ...prev,
      [section]: error
    }));
  };

  // Helper function to update section data
  const updateSectionData = (section, data) => {
    setSectionData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Generic API call function
  const fetchSectionData = async (section, endpoint) => {
    try {
      updateSectionLoading(section, true);
      updateSectionError(section, null);

      console.log(`🔍 Fetching ${section} data from: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "GET",
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ ${section} API Response:`, result);

      if (result.success && result.data) {
        if (section === "eligibility") {
          // Store eligibility array and studentInformation object
          updateSectionData("eligibility", result.data.eligibility || []);
          setStudentInformation(result.data.studentInformation || { StudentDetails: [], SchoolDetails: [] });
        } else {
          updateSectionData(section, result.data);
        }
        console.log(`✅ ${section} data loaded successfully`);
      } else {
        throw new Error(result.message || `Failed to fetch ${section} data`);
      }
    } catch (error) {
      console.error(`❌ Error fetching ${section} data:`, error);
      updateSectionError(section, error.message);
    } finally {
      updateSectionLoading(section, false);
    }
  };

  // Individual API calls for each section
  const fetchOverviewData = () => {
    fetchSectionData('overview', `http://localhost:3001/api/competitions/getoverview/${competitionsid}`);
  };

  const fetchSyllabusData = () => {
    fetchSectionData('syllabus', `http://localhost:3001/api/competitions/getsyllabus/${competitionsid}`);
  };

  const fetchPatternData = () => {
    fetchSectionData('pattern', `http://localhost:3001/api/competitions/getpattern/${competitionsid}`);
  };

  const fetchEligibilityData = () => {
    fetchSectionData('eligibility', `http://localhost:3001/api/competitions/eligibility/${competitionsid}`);
  };

  const fetchRegistrationData = () => {
    fetchSectionData('registration', `http://localhost:3001/api/competitions/registration/${competitionsid}`);
  };

  const fetchAwardsData = () => {
    fetchSectionData('awards', `http://localhost:3001/api/competitions/awards/${competitionsid}`);
  };

  // Fetch all data when component mounts
  useEffect(() => {
    if (competitionsid) {
      console.log(`🚀 Starting to fetch all competition data for ID: ${competitionsid}`);

      // Fetch all sections data
      fetchOverviewData();
      fetchSyllabusData();
      fetchPatternData();
      fetchEligibilityData();
      fetchRegistrationData();
      fetchAwardsData();
    } else {
      console.error("❌ No competition ID provided");
    }
  }, [competitionsid]);

  // Loading component for individual sections
  const SectionLoader = ({ section }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '16px',
      color: '#666'
    }}>
      Loading {section} data...
    </div>
  );

  // Error component for individual sections
  const SectionError = ({ section, error, onRetry }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '16px',
      color: 'red',
      textAlign: 'center'
    }}>
      <p>Error loading {section}: {error}</p>
      <button
        onClick={onRetry}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    </div>
  );

  // Helper functions to safely access data
  const getOverviewData = () => sectionData.overview || {};
  const getSyllabusData = () => sectionData.syllabus || {};
  const getPatternData = () => sectionData.pattern || {};
  const getEligibilityData = () => sectionData.eligibility || [];
  const getRegistrationData = () => sectionData.registration || {};
  const getAwardsData = () => sectionData.awards || [];

  // Get student information from eligibility data or separate call
  const getStudentInformation = () => studentInformation;

  // Helper function to get registration URL based on plans availability
  const getRegistrationUrl = () => {
    const registrationData = getRegistrationData();
    return registrationData.plans?.length > 0
      ? `/compitions-plans/${competitionsid}`
      : `/compitions-payment/${competitionsid}`;
  };

  // Function to scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Organisersheader />
      <div className="Competitionsdetail">

        <div className="header-main">
          <div className="header-left">
            <h1 className="competition-title">
              {sectionLoading.overview ? "Loading..." : getOverviewData().name || "MINDSTORM 2025"}
            </h1>
            <p className="verification-text">
              {`Verified by ${getOrganizerName()}`}
            </p>
          </div>
          <div className="header-right">
            <div className="action-buttons-grid">
              <button className="action-btn">
                <span>Duplicate Competition</span>
              </button>
              <button className="action-btn">
                <svg className="download-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Download Enrollments</span>
              </button>
              <button className="action-btn">
                <span>Update Details</span>
              </button>
              <button className="action-btn">
                <svg className="download-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Download Wishlists</span>
              </button>
            </div>
          </div>
        </div>


        {/* Header Section */}
        <div className="competition-header">


          {/* Navigation Tabs */}
          <div className="navigation-tabs">
            <button
              className="nav-tab active"
              onClick={() => scrollToSection('overview')}
            >
              Overview
            </button>
            <button
              className="nav-tab"
              onClick={() => scrollToSection('exam-pattern')}
            >
              Exam Pattern
            </button>
            <button
              className="nav-tab"
              onClick={() => scrollToSection('syllabus')}
            >
              Syllabus
            </button>
            <button
              className="nav-tab"
              onClick={() => scrollToSection('eligibility')}
            >
              Eligibility
            </button>
            <button
              className="nav-tab"
              onClick={() => scrollToSection('registration')}
            >
              Registration
            </button>
            <button
              className="nav-tab"
              onClick={() => scrollToSection('awards')}
            >
              Awards
            </button>
            <button
              className="nav-tab"
              onClick={() => scrollToSection('rules')}
            >
              Rules
            </button>
          </div>
        </div>

        <div className="main-container">

          {/* Overview Section */}
          <div id="overview" className="section">
            <div className="section-header">
              <h2 className="section-title">Overview</h2>
              <span className="chevron-icon">›</span>
            </div>

            {sectionLoading.overview ? (
              <SectionLoader section="overview" />
            ) : sectionErrors.overview ? (
              <SectionError
                section="overview"
                error={sectionErrors.overview}
                onRetry={fetchOverviewData}
              />
            ) : (
              <>
                {/* Competition Image */}
                {getOverviewData().image && (
                  <div style={{ marginBottom: "20px" }}>
                    <img
                      src={getOverviewData().image.startsWith('http')
                        ? getOverviewData().image
                        : `http://localhost:3001${getOverviewData().image}`
                      }
                      alt="Competition"
                      style={{
                        maxWidth: "50%",
                        height: "auto",
                        maxHeight: "400px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                      }}
                    />
                  </div>
                )}

                {/* Competition Name */}
                <div className="competition-name-section">
                  {/* <h2 className="competition-main-title">
                    {getOverviewData().name || "MINDSTORM 2025"}
                  </h2> */}
                  <p className="competition-description">
                    {getOverviewData().description || "Unleash the power of your brain!"}
                  </p>
                </div>

                <div className="competition-details">
                  <div>
                    <div className="detail-item">
                      <div className="detail-label">
                        Total Stages: {getOverviewData().stages?.length > 0 
                          ? getOverviewData().stages.map(stage => stage.name).join(' And ') 
                          : "Primary And Final"}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Date Of 1st Level: {getOverviewData().stages?.[0]?.date || "9th Aug 2025"}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Awards</div>
                      {sectionLoading.awards ? (
                        <div>Loading awards...</div>
                      ) : getAwardsData().length > 0 ? (
                        <ul className="awards-list">
                          {getAwardsData().map((award, index) => (
                            <li key={index}>
                              {award.Award_Type}: {award.Quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>No awards information available</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="detail-item">
                      <div className="detail-label">
                        Subjects: {getOverviewData().subject || 
                          (getOverviewData().subjects ? getOverviewData().subjects.join(', ') : 
                          (getSyllabusData().topics?.length > 0 
                            ? [...new Set(getSyllabusData().topics.map(topic => topic.name))].join(', ')
                            : 'Maths'))}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Registration Fees: ₹{getRegistrationData().registration_type?.total_registration_fee || "150"}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Variance: 97%</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">
                        Location: {getOverviewData().stages?.[0]?.location?.length > 0 
                          ? getOverviewData().stages[0].location.map(loc => 
                              loc === 'IN' ? 'India' : loc
                            ).join(', ') 
                          : (getOverviewData().location || 
                             getOverviewData().state || 
                             getOverviewData().city || 
                             "Rajasthan")}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Syllabus Section */}
          <div id="syllabus" className="section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Syllabus</h2>
                <span className="section-tag">
                  {getOverviewData().stages?.[0]?.name || "Primary"}
                </span>
              </div>
              <span className="chevron-icon">›</span>
            </div>

            {sectionLoading.syllabus ? (
              <SectionLoader section="syllabus" />
            ) : sectionErrors.syllabus ? (
              <SectionError
                section="syllabus"
                error={sectionErrors.syllabus}
                onRetry={fetchSyllabusData}
              />
            ) : (
              <div className="syllabus-container">
                {getOverviewData().stages?.length > 1 ? (
                  // Multiple stages - show slider
                  <div className="syllabus-slider-container">
                    <div className="syllabus-slider">
                      {getOverviewData().stages.map((stage, stageIndex) => (
                        <div key={stageIndex} className="syllabus-stage-slide">
                          <h4 className="stage-title">{stage.name}</h4>
                          <div className="syllabus-grid">
                            {getSyllabusData().topics?.length > 0 ? (
                              getSyllabusData().topics.map((topic, index) => (
                                <div className="syllabus-item" key={index}>
                                  {typeof topic === 'string' ? topic : topic.name}
                                </div>
                              ))
                            ) : (
                              <>
                                <div className="syllabus-item">Knowing Our Numbers</div>
                                <div className="syllabus-item">Whole Number</div>
                                <div className="syllabus-item">Playing with Numbers</div>
                                <div className="syllabus-item">Basic Geometrical Ideas</div>
                                <div className="syllabus-item">Understanding Elementary Shapes</div>
                                <div className="syllabus-item">Integers</div>
                                <div className="syllabus-item">Fractions</div>
                                <div className="syllabus-item">Decimals</div>
                                <div className="syllabus-item">Data Handling</div>
                                <div className="syllabus-item">Mensuration</div>
                                <div className="syllabus-item">Algebra</div>
                                <div className="syllabus-item">Ratio & Proportion</div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Single stage - show static grid
                  <div className="syllabus-grid">
                    {getSyllabusData().topics?.length > 0 ? (
                      getSyllabusData().topics.map((topic, index) => (
                        <div className="syllabus-item" key={index}>
                          {typeof topic === 'string' ? topic : topic.name}
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="syllabus-item">Knowing Our Numbers</div>
                        <div className="syllabus-item">Whole Number</div>
                        <div className="syllabus-item">Playing with Numbers</div>
                        <div className="syllabus-item">Basic Geometrical Ideas</div>
                        <div className="syllabus-item">Understanding Elementary Shapes</div>
                        <div className="syllabus-item">Integers</div>
                        <div className="syllabus-item">Fractions</div>
                        <div className="syllabus-item">Decimals</div>
                        <div className="syllabus-item">Data Handling</div>
                        <div className="syllabus-item">Mensuration</div>
                        <div className="syllabus-item">Algebra</div>
                        <div className="syllabus-item">Ratio & Proportion</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Exam Pattern Section */}
          <div id="exam-pattern" className="section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Exam Pattern</h2>
                <span className="section-tag">
                  {getOverviewData().stages?.[0]?.name || "Primary"}
                </span>
              </div>
              <span className="chevron-icon">›</span>
            </div>

            {sectionLoading.pattern ? (
              <SectionLoader section="pattern" />
            ) : sectionErrors.pattern ? (
              <SectionError
                section="pattern"
                error={sectionErrors.pattern}
                onRetry={fetchPatternData}
              />
            ) : (
              <table className="exam-pattern-table">
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Pattern</th>
                    <th>No. of Question</th>
                    <th>Marks per Question</th>
                  </tr>
                </thead>
                <tbody>
                  {getPatternData().sections?.length > 0 ? (
                    getPatternData().sections.map((section, index) => (
                      <tr key={index}>
                        <td>{section.name || section.sectionName || "N/A"}</td>
                        <td>{section.type || section.format || "MCQ"}</td>
                        <td>{section.questions || section.numberOfQuestions || "N/A"}</td>
                        <td>{section.marks || section.marksPerQuestion || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <td>Logical Reasoning</td>
                        <td>MCQ</td>
                        <td>15</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>Mathematical Reasoning</td>
                        <td>MCQ</td>
                        <td>20</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>Everyday Mathematics</td>
                        <td>MCQ</td>
                        <td>10</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>Achievers Section</td>
                        <td>MCQ</td>
                        <td>5</td>
                        <td>3</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Eligibility Section */}
          <div id="eligibility" className="section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Eligibility</h2>
                <span className="section-tag">
                  {getOverviewData().stages?.[0]?.name || "Primary"}
                </span>
              </div>
              <span className="chevron-icon">›</span>
            </div>

            {sectionLoading.eligibility ? (
              <SectionLoader section="eligibility" />
            ) : sectionErrors.eligibility ? (
              <SectionError
                section="eligibility"
                error={sectionErrors.eligibility}
                onRetry={fetchEligibilityData}
              />
            ) : (
              <div className="eligibility-content">
                {getEligibilityData().length > 0 && getEligibilityData().some(item => item.criteria && item.criteria.length > 0) ? (
                  getEligibilityData().map((eligibilityItem, index) => (
                    eligibilityItem.criteria && eligibilityItem.criteria.length > 0 ? (
                      <div key={`eligibility-${index}`} className="eligibility-container">
                        <div className="eligibility-criteria">
                          <h4 className="eligibility-category">Eligibility Criteria</h4>
                          <ul className="eligibility-list">
                            {eligibilityItem.criteria.map((criteria, criteriaIndex) => (
                              <li key={`criteria-${criteriaIndex}`}>
                                <span className="eligibility-icon">✔</span>
                                <span>
                                  {criteria.title ? `${criteria.title}: ${criteria.requirement}` : 
                                   (criteria.requirement || criteria)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null
                  ))
                ) : (
                  <div className="eligibility-container">
                    <div className="eligibility-criteria">
                      <h4 className="eligibility-category">Eligibility Criteria</h4>
                      <div className="no-eligibility">
                        <p>No age range information available</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rules Section */}
          <div id="rules" className="section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Rules</h2>
                <span className="section-tag">
                  {getOverviewData().stages?.[0]?.name || "Primary"}
                </span>
              </div>
              <span className="chevron-icon">›</span>
            </div>
            {sectionLoading.pattern ? (
              <SectionLoader section="rules" />
            ) : sectionErrors.pattern ? (
              <SectionError
                section="rules"
                error={sectionErrors.pattern}
                onRetry={fetchPatternData}
              />
            ) : (
              <div className="rules-content">
                <div className="rules-box">
                  <p className="rules-text">
                    {getPatternData().sections?.[0]?.rules || getPatternData().rules || "No rules available for this competition."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Registration Section */}
          <div id="registration" className="section">
            <div className="section-header">
              <h2 className="section-title">Registration</h2>
            </div>
            <div className="registration-content">
              <div className="registration-info">
                <ul className="registration-points">
                  <li>
                    <span className="point-label">Registration Period:</span>{" "}
                    {getRegistrationData().registration_type?.registration_start_date || "N/A"} to{" "}
                    {getRegistrationData().registration_type?.registration_end_date || "N/A"}
                  </li>
                  <li>
                    <span className="point-label">Registration Fee:</span>{" "}
                    ₹{getRegistrationData().registration_type?.total_registration_fee || "N/A"}
                  </li>
                </ul>
              </div>
              {/* <button className="register-button">
                <NavLink
                  to={getRegistrationUrl()}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Register Now
                </NavLink>
              </button> */}
            </div>
          </div>

          {/* Awards Section */}
          {/* <div id="awards" className="section">
            <div className="section-header">
              <h2 className="section-title">Awards</h2>
            </div>
            {sectionLoading.awards ? (
              <SectionLoader section="awards" />
            ) : sectionErrors.awards ? (
              <SectionError
                section="awards"
                error={sectionErrors.awards}
                onRetry={fetchAwardsData}
              />
            ) : getAwardsData().length > 0 ? (
              <div className="awards-content">
                {getAwardsData().map((award, index) => (
                  <div key={index} className="award-item">
                    <h4 className="award-type">{award.Award_Type}: {award.Quantity}</h4>
                    <p className="award-details">Given to: {award.Given_To}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-awards">
                <p>No awards information available</p>
              </div>
            )}
          </div> */}
        </div>
      </div>
      <FooterUsers />
    </>
  );
}

export default Ocompetitionsdetail;
