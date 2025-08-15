import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Competitionsdetail.css";
import HeaderUser from "./HeaderUser";
import FooterUsers from "./FooterUsers";
import Organisersheader from "./Organisersheader";

function Ocompetitionsdetail() {
  const { competitionsid } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
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

  const openTab = (tab) => {
    setActiveTab(tab);
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
        updateSectionData(section, result.data);
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
    fetchSectionData('overview', `https://api.prodigiedu.com/api/competitions/getoverview/${competitionsid}`);
  };

  const fetchSyllabusData = () => {
    fetchSectionData('syllabus', `https://api.prodigiedu.com/api/competitions/getsyllabus/${competitionsid}`);
  };

  const fetchPatternData = () => {
    fetchSectionData('pattern', `https://api.prodigiedu.com/api/competitions/getpattern/${competitionsid}`);
  };

  const fetchEligibilityData = () => {
    fetchSectionData('eligibility', `https://api.prodigiedu.com/api/competitions/eligibility/${competitionsid}`);
  };

  const fetchRegistrationData = () => {
    fetchSectionData('registration', `https://api.prodigiedu.com/api/competitions/registration/${competitionsid}`);
  };

  const fetchAwardsData = () => {
    fetchSectionData('awards', `https://api.prodigiedu.com/api/competitions/awards/${competitionsid}`);
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
  const getStudentInformation = () => {
    // First check if eligibility data has StudentInformation
    if (sectionData.eligibility && sectionData.eligibility.StudentInformation) {
      return sectionData.eligibility.StudentInformation;
    }
    // Return empty object if not found
    return { StudentDetails: [], SchoolDetails: [] };
  };

  return (
    <>
      <Organisersheader />
      <div className="Competitionsdetail">
        <div className="exam-header">
          <div className="exam-title">
            <h1>
              {sectionLoading.overview ? (
                "Loading..."
              ) : sectionErrors.overview ? (
                "Error Loading Competition"
              ) : (
                getOverviewData().name || "Competition Name"
              )}
            </h1>
            <p>Verified by Pradigy</p>
          </div>
          <div className="action-button btn-details">
            <button className="btn-detail">Duplicate Competition</button>
            <button className="btn-detail">Download Enrollments</button>
            <button className="btn-detail">Update Details</button>
            <button className="btn-detail">Download Wishlists</button>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            {[
              { key: "overview", label: "Overview" },
              { key: "exam-pattern", label: "Exam Pattern" },
              { key: "syllabus", label: "Syllabus" },
              { key: "eligibility", label: "Eligibility" },
              { key: "registration", label: "Registration" },
              { key: "awards", label: "Awards" }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => openTab(tab.key)}
              >
                {tab.label}
                {/* Show loading indicator in tab */}
                {sectionLoading[tab.key === 'exam-pattern' ? 'pattern' : tab.key] && (
                  <span style={{ marginLeft: '5px', fontSize: '12px' }}>⏳</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div id="overview" className="tab-pane active">
              <h2>Overview</h2>
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
                  <div style={{ marginBottom: "20px" }}>
                    {getOverviewData().image && (
                      <img 
                        src={getOverviewData().image.startsWith('http') 
                          ? getOverviewData().image 
                          : `https://api.prodigiedu.com${getOverviewData().image}`
                        }
                        alt="Competition"
                        style={{ maxWidth: "300px", height: "auto", marginBottom: "15px" }}
                      />
                    )}
                  </div>
                  <p className="overview-text">
                    {getOverviewData().description || "No description available"}
                  </p>
                  <div className="info-grid">
                    <div className="info-item">
                      <h4>
                        Total stages: {getOverviewData().stages?.length || 0}
                      </h4>
                      {getOverviewData().stages?.map((stage, index) => (
                        <p key={index}>
                          Stage {index + 1}: {stage.name} ({stage.date})
                        </p>
                      ))}
                    </div>
                    <div className="info-item">
                      <h4>Scale: National</h4>
                    </div>
                    <div className="info-item">
                      <h4>
                        Date of 1st level: {getOverviewData().stages?.[0]?.date || "N/A"}
                      </h4>
                    </div>
                    <div className="info-item">
                      <h4>Mode: {getOverviewData().stages?.[0]?.mode || "N/A"}</h4>
                    </div>
                    <div className="info-item">
                      <h4>Participation: {getOverviewData().stages?.[0]?.participation || "N/A"}</h4>
                    </div>
                    <div className="info-item">
                      <h4>Duration: {getOverviewData().stages?.[0]?.duration || "N/A"}</h4>
                    </div>
                    {/* Awards Preview in Overview */}
                    {!sectionLoading.awards && getAwardsData().length > 0 && (
                      <div className="info-item">
                        <h4>Awards</h4>
                        <ul className="list-in">
                          {getAwardsData().slice(0, 3).map((award, index) => (
                            <li key={index}>
                              {award.Award_Type}: {award.Quantity} (Given to: {award.Given_To})
                            </li>
                          ))}
                          {getAwardsData().length > 3 && (
                            <li>... and {getAwardsData().length - 3} more awards</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="why-choose">
                    <h3>Why Choose This Exam?</h3>
                    <div className="benefits-grid">
                      <div className="benefit-col">
                        <ul className="benefit-list">
                          <li>
                            <span className="icon">✔</span>Professional Organization
                          </li>
                          <li>
                            <span className="icon">✔</span>Comprehensive Assessment
                          </li>
                          <li>
                            <span className="icon">✔</span>Recognition and Awards
                          </li>
                          <li>
                            <span className="icon">✔</span>Multiple Competition Stages
                          </li>
                        </ul>
                      </div>
                      <div className="benefit-col right-line">
                        <ul className="benefit-list">
                          <li>
                            <span className="icon">✔</span>Online/Offline Modes Available
                          </li>
                          <li>
                            <span className="icon">✔</span>Individual & School Participation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Exam Pattern Tab */}
          {activeTab === "exam-pattern" && (
            <div id="exam-pattern" className="tab-pane active">
              <h2>Exam Pattern</h2>
              {sectionLoading.pattern ? (
                <SectionLoader section="pattern" />
              ) : sectionErrors.pattern ? (
                <SectionError 
                  section="pattern" 
                  error={sectionErrors.pattern} 
                  onRetry={fetchPatternData}
                />
              ) : (
                <div className="table-container">
                  <table className="exam-table">
                    <thead className="thhead">
                      <tr>
                        <th>Section</th>
                        <th>Pattern</th>
                        <th>No. of Questions</th>
                        <th>Marks per Question</th>
                      </tr>
                    </thead>
                    <tbody className="table-boby">
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
                        <tr>
                          <td colSpan="4">No exam pattern data available</td>
                        </tr>
                      )}
                      {getPatternData().sections?.length > 0 && (
                        <tr>
                          <td>
                            <strong>Grand Total</strong>
                          </td>
                          <td></td>
                          <td>
                            <strong>
                              {getPatternData().sections.reduce(
                                (total, section) => total + (parseInt(section.questions) || parseInt(section.numberOfQuestions) || 0),
                                0
                              )}
                            </strong>
                          </td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Syllabus Tab */}
          {activeTab === "syllabus" && (
            <div id="syllabus" className="tab-pane active">
              <h2>Syllabus</h2>
              {sectionLoading.syllabus ? (
                <SectionLoader section="syllabus" />
              ) : sectionErrors.syllabus ? (
                <SectionError 
                  section="syllabus" 
                  error={sectionErrors.syllabus} 
                  onRetry={fetchSyllabusData}
                />
              ) : (
                <div className="syllabus-grid">
                  {getSyllabusData().topics?.length > 0 ? (
                    getSyllabusData().topics.map((topic, index) => (
                      <div className="syllabus-col" key={index}>
                        <h4>{typeof topic === 'string' ? topic : topic.name}</h4>
                        {typeof topic === 'object' && topic.subtopics?.length > 0 && (
                          <ul className="syllabus-list">
                            {topic.subtopics.map((subtopic, subIndex) => (
                              <li key={subIndex}>{subtopic}</li>
                            ))}
                          </ul>
                        )}
                        {typeof topic === 'object' && topic.weight && (
                          <p><strong>Weight:</strong> {topic.weight}%</p>
                        )}
                        {typeof topic === 'object' && topic.stage && (
                          <p><strong>Stage:</strong> {topic.stage}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div>No syllabus data available</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Eligibility Tab */}
          {activeTab === "eligibility" && (
            <div id="eligibility" className="tab-pane active">
              <h2>Eligibility</h2>
              {sectionLoading.eligibility ? (
                <SectionLoader section="eligibility" />
              ) : sectionErrors.eligibility ? (
                <SectionError 
                  section="eligibility" 
                  error={sectionErrors.eligibility} 
                  onRetry={fetchEligibilityData}
                />
              ) : (
                <>
                  {/* Eligibility Criteria */}
                  {getEligibilityData().length > 0 && (
                    <div>
                      <h3>Eligibility Criteria</h3>
                      <ul>
                        {getEligibilityData().map((criteria, index) => (
                          <li key={`criteria-${index}`}>
                            <span className="icon">✔</span>
                            <strong>{criteria.title}:</strong> {criteria.requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <h3>Student Details Required</h3>
                  <ul>
                    {getStudentInformation().StudentDetails?.length > 0 ? (
                      getStudentInformation().StudentDetails.map((item, index) => (
                        <li key={`student-${index}`}>
                          <span className="icon">✔</span>
                          {item}
                        </li>
                      ))
                    ) : (
                      <li>No student details specified</li>
                    )}
                  </ul>

                  <h3>School Details Required</h3>
                  <ul>
                    {getStudentInformation().SchoolDetails?.length > 0 ? (
                      getStudentInformation().SchoolDetails.map((item, index) => (
                        <li key={`school-${index}`}>
                          <span className="icon">✔</span>
                          {item}
                        </li>
                      ))
                    ) : (
                      <li>No school details specified</li>
                    )}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* Registration Tab */}
          {activeTab === "registration" && (
            <div id="registration" className="tab-pane active">
              <h2>Registration</h2>
              {sectionLoading.registration ? (
                <SectionLoader section="registration" />
              ) : sectionErrors.registration ? (
                <SectionError 
                  section="registration" 
                  error={sectionErrors.registration} 
                  onRetry={fetchRegistrationData}
                />
              ) : (
                <>
                  <div className="registration-info">
                    <p>
                      <strong>
                        Registration for this competitive exam is now open from{" "}
                        {getRegistrationData().registration_type?.registration_start_date || "N/A"}{" "}
                        to{" "}
                        {getRegistrationData().registration_type?.registration_end_date || "N/A"}
                        . Total registration fee: ₹{getRegistrationData().registration_type?.total_registration_fee || "N/A"}
                        . Click the button below to register.
                      </strong>
                    </p>
                    <button className="btn-primary">Register Now</button>
                  </div>
                  
                  {getRegistrationData().plans?.length > 0 && (
                    <div>
                      <h3>Available Plans</h3>
                      <div style={{ display: 'grid', gap: '20px' }}>
                        {getRegistrationData().plans.map((plan, index) => (
                          <div key={index} style={{ 
                            border: '1px solid #ddd', 
                            padding: '20px', 
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                          }}>
                            <h4>{plan.name || "Plan " + (index + 1)}</h4>
                            <p><strong>Fee:</strong> ₹{plan.plan_fee || "N/A"}</p>
                            {plan.student_limit && (
                              <p><strong>Student Limit:</strong> {plan.student_limit}</p>
                            )}
                            {plan.description && (
                              <p><strong>Description:</strong> {plan.description}</p>
                            )}
                            {plan.included && (
                              <div>
                                <p><strong>What's Included:</strong></p>
                                <p>{plan.included}</p>
                              </div>
                            )}
                            {plan.not_included && (
                              <div>
                                <p><strong>What's Not Included:</strong></p>
                                <p>{plan.not_included}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Awards Tab */}
          {activeTab === "awards" && (
            <div id="awards" className="tab-pane active">
              <h2>Awards</h2>
              {sectionLoading.awards ? (
                <SectionLoader section="awards" />
              ) : sectionErrors.awards ? (
                <SectionError 
                  section="awards" 
                  error={sectionErrors.awards} 
                  onRetry={fetchAwardsData}
                />
              ) : getAwardsData().length > 0 ? (
                <div>
                  <h3>Competition Awards</h3>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {getAwardsData().map((award, index) => (
                      <div key={index} style={{ 
                        border: '1px solid #ddd', 
                        padding: '20px', 
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                          {award.Award_Type}
                        </h4>
                        <p><strong>Quantity:</strong> {award.Quantity}</p>
                        <p><strong>Given To:</strong> {award.Given_To}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#666' 
                }}>
                  No awards information available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <FooterUsers />
    </>
  );
}

export default Ocompetitionsdetail;
