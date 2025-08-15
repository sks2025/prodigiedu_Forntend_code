import React, { useEffect, useState } from "react";
import FooterUsers from "./FooterUsers";
import "./UserLogin.css";
import "./OrganiserHomepage.css";
import HeaderUser from "./HeaderUser";
import right from "../images/Rectangle 157.png";
import left from "../images/Rectangle 157.png";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2"; // Import SweetAlert2
import Organisersheader from "./Organisersheader";

const OrganiserHomepage = ({ title }) => {
  const [compitions, setCompitions] = useState([]);
  const [draftCompitions, setDraftCompitions] = useState([]);

  const userData = JSON.parse(localStorage.getItem("user_Data"));
  const organizerId = userData?._id;

  const navigate = useNavigate();

  // Add corner shape image - using the existing right image
  const cornerShape = right;

  // Function to calculate progress percentage for a competition
  const calculateProgress = (comp) => {
    const requiredFields = [
      {
        key: "overview",
        check: (overview) =>
          overview?.name &&
          overview?.image &&
          overview?.description &&
          overview?.stages?.length > 0,
      },
      {
        key: "syllabus.topics",
        check: (syllabus) => syllabus?.topics?.length > 0,
      },
      {
        key: "pattern.sections",
        check: (pattern) => pattern?.sections?.length > 0,
      },
      {
        key: "StudentInformation.StudentDetails",
        check: (info) => info?.StudentDetails?.length > 0,
      },
      {
        key: "StudentInformation.SchoolDetails",
        check: (info) => info?.SchoolDetails?.length > 0,
      },
      {
        key: "registration.plans",
        check: (registration) => registration?.plans?.length > 0,
      },
      { key: "eligibility", check: (eligibility) => eligibility?.length > 0 },
      { key: "awards", check: (awards) => awards?.length > 0 },
    ];

    const totalFields = requiredFields.length;
    let filledFields = 0;

    requiredFields.forEach(({ key, check }) => {
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        if (check(comp[parent])) filledFields++;
      } else {
        if (check(comp[key])) filledFields++;
      }
    });

    return Math.round((filledFields / totalFields) * 100);
  };

  const getAllComplete = () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `https://api.prodigiedu.com/api/competitions/getCompetitionsByOrganizerComplete?organizerId=${organizerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("Active competitions data:", result);
          setCompitions(result);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const getAllisNotComplete = () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `https://api.prodigiedu.com/api/competitions/getCompetitionsByOrganizerNotComplete?organizerId=${organizerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status === false) {
            setDraftCompitions([]);
          } else {
            // Map through results to add progress percentage
            const updatedDrafts = result.map((comp) => ({
              ...comp,
              progress: calculateProgress(comp),
            }));
            setDraftCompitions(updatedDrafts);
          }
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (organizerId) {
      getAllComplete();
      getAllisNotComplete();
    } else {
      console.warn("Organizer ID is not provided");
    }
  }, [organizerId]);

  console.log("Active competitions:", compitions);

  return (
    <div className="OrganiserHomepage">
      <Organisersheader />

      <div className=" container mb-5 active-competitions">

        <div className="active-competitions-box">
          {/* Corner shapes */}
          <img src={cornerShape} alt="corner" className="active-competitions-corner top-right" />
          <img src={cornerShape} alt="corner" className="active-competitions-corner bottom-left" />

          {compitions && compitions.length > 0 ? (
            compitions.map((comp, index) => (
              <div className="active-competitions-card" key={comp._id || index}>
                <div className="active-competitions-row">
                  <div className="active-competitions-info-container">
                    <div className="active-competitions-info">
                      <div className="active-competitions-image">
                        {comp.overview?.image && (
                          <img
                            src={comp.overview.image}
                            alt={comp.overview?.name || "Competition"}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        )}
                      </div>
                      <div>
                        <h3>{comp.overview?.name || "Untitled Competition"}</h3>
                        <p> {comp.daysAway} Days Away
                        </p>
                      </div>
                    </div>
                    <div className="mt-2" style={{ lineHeight: ".5", }}>
                      <p style={{ fontSize: "14px" }}>Total Schools Reached: <b>{comp.schoolsReached || comp.totalSchools || "30,769"}</b></p>
                      <p style={{ fontSize: "14px" }}>Total Wishlists: <b>{comp.wishlists || comp.totalWishlists || 0}</b></p>
                    </div>

                    <div>
                      <p className="active-competitions-highlight" style={{ fontSize: "14px" }}>₹{comp.revenue || comp.totalRevenue || "5.9Cr "}</p>
                      <span style={{ fontSize: "14px" }}>Total Revenue</span>
                    </div>
                    <div>
                      <p className="active-competitions-highlight" style={{ fontSize: "14px" }}>{comp.enrollments || comp.totalEnrollments || "1,00,000"}</p>
                      <span style={{ fontSize: "14px" }}>Total Enrollments</span>
                    </div>
                    <div className="">
                      <button
                        className="active-competitions-manage"
                        onClick={() =>
                          navigate(`/Ocompetitionsdetail/${comp._id}`)
                        }

                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="active-competitions-card">
              <div className="active-competitions-row" style={{ justifyContent: 'center', padding: '40px', height: '100px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500', color: '#374151' }}>
                    No active competitions found
                  </p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                    Create a new competition to get started!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container progress-container">
        <h2>Your Drafts</h2>
        <div className="container progress-card-container">
          {draftCompitions?.length > 0 ? (
            draftCompitions.map((comp, index) => (
              <div
                key={comp._id || index}
                className="progress-card draft-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  background: "#fff",
                }}
              >
                <div
                  className="card-left"
                  style={{ flex: "1", display: "flex", alignItems: "center" }}
                >
                  <div
                    className="card-image"
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "#e0e0e0",
                      marginRight: "10px",
                    }}
                  />
                  <div>
                    <div className="card-title" style={{ fontWeight: "bold" }}>
                      {comp.overview?.name || "Untitled"}
                    </div>
                  </div>
                </div>
                <div style={{ width: "70%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#111827",
                      }}
                    >
                      {comp.overview?.name || "Untitled"}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      {comp.progress}%{" "}
                      <span
                        style={{
                          color: "#9CA3AF",
                          fontWeight: "normal",
                        }}
                      >
                        Completed
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "0.375rem",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "9999px",
                    }}
                  >
                    <div
                      style={{
                        width: `${comp.progress}%`,
                        height: "100%",
                        backgroundColor: "#16A34A",
                        borderRadius: "9999px",
                      }}
                    ></div>
                  </div>
                </div>
                <div style={{ flex: "1", textAlign: "right" }}>
                  <button
                    className="prep-button"
                    style={{
                      padding: "5px 10px",
                      background: "#388E3B",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(`/organiser/competition/${comp._id}`)
                    }
                  >
                    Continue
                  </button>
                  <button
                    style={{
                      padding: "5px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "green",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          const requestOptions = {
                            method: "DELETE",
                            redirect: "follow",
                          };

                          fetch(
                            `https://api.prodigiedu.com/api/competitions/deleteCompetition/${comp._id}`,
                            requestOptions
                          )
                            .then((response) => response.json())
                            .then((result) => {
                              Swal.fire({
                                title: "Deleted!",
                                text: "Your competition has been deleted.",
                                icon: "success",
                              });
                              // Refresh the drafts list after deletion
                              getAllisNotComplete();
                            })
                            .catch((error) => {
                              console.error(error);
                              Swal.fire({
                                title: "Error!",
                                text: "Failed to delete the competition.",
                                icon: "error",
                              });
                            });
                        }
                      });
                    }}
                  >
                    <MdDelete size={20} color="#388E3B" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              No competition found
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <a
          href="/organiser/competition"
          style={{
            padding: "10px 20px",
            background: "#388E3B",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Create New Competition
        </a>
      </div>

      <FooterUsers />
    </div>
  );
};

export default OrganiserHomepage;

