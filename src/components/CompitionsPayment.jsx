import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Compitionspayment.css";
import "./pay.css";
import Studentheaderhome from "./Studentheaderhome";
import StudentFooter from "./StudentFooter";
import { FaCheck, FaTimes, FaCalendarAlt } from "react-icons/fa";
import Input from "./common/Input";

// Fallback plans in case API fails or no plans are found
const fallbackPlans = [
  {
    price: 100,
    title: "Basic Plan",
    subtitle: "Basic registration",
    recommended: false,
    features: [
      { text: "Registration included", included: true },
      { text: "No extra benefits", included: false },
      { text: "No past papers", included: false },
      { text: "Up to 1 student", included: true },
    ],
  },
  {
    price: 200,
    title: "Advance Prep",
    subtitle: "Registration + Prep + Past year question papers",
    recommended: true,
    features: [
      { text: "Registration included", included: true },
      { text: "Prep material", included: true },
      { text: "Past year question papers", included: true },
      { text: "Up to 5 students", included: true },
    ],
  },
];

const CompetitionsPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { competitionsid } = useParams();
  const plan = location.state?.plan;
  const dobInputRef = useRef(null);

  const [plans, setPlans] = useState(fallbackPlans);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [competitionData, setCompetitionData] = useState({
    name: "Competition Name",
    instituteName: "Institute Name",
    image: null,
    stageDate: null,
    grade: "6th",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eligibilityData, setEligibilityData] = useState({
    studentInformation: {
      StudentDetails: [],
      SchoolDetails: []
    },
    additionalDetails: []
  });

  const [form, setForm] = useState({
    // Student Details
    studentName: "",
    studentAge: "",
    dob: "",
    grade: "",
    section: "",
    rollNumber: "",
    ageGroup: "",
    parentName: "",
    contactNumber: "",
    email: "",
    city: "",
    address1: "",
    address2: "",
    country: "",
    
    // School Details
    school: "",
    schoolAddress: "",
    schoolContactNumber: "",
    schoolCity: "",
    schoolType: "",
    pocName: "",
    schoolEmail: "",
    additionalInfo: "",
    
    // Additional student details
    fatherName: "",
    fatherOccupation: "",
    fatherPhone: "",
    motherName: "",
    motherOccupation: "",
    motherPhone: "",
    emergencyContact: "",
    emergencyPhone: "",
    // Academic details
    previousSchool: "",
    academicYear: "",
    // Additional information
    bloodGroup: "",
    medicalConditions: "",
    specialNeeds: "",
    transportMode: "",
    // Checkbox state
    isChecked: false,
  });
  const [errors, setErrors] = useState({});

  // Helper function to render student/school fields based on API
  const renderStudentField = (fieldName, label) => {
    const fieldValue = form[fieldName] || "";
    
    return (
      <div className="d-flex flex-column gap-2 w-50">
        <Input
          label={label}
          name={fieldName}
          placeholder={label}
          value={fieldValue}
          onChange={handleChange}
          required
        />
        <p style={{ color: "red" }}>{errors[fieldName]}</p>
      </div>
    );
  };

  // Helper function to render different field types
  const renderDynamicField = (field, index) => {
    const fieldName = `dynamic_${field.id}`;
    const fieldValue = form[fieldName] || "";

    switch (field.type) {
      case "Multiple Choice":
        return (
          <div key={index} className="d-flex flex-column gap-2 w-50">
            <label style={{ fontWeight: "600", marginBottom: "5px" }}>
              {field.name} {field.settings?.allowMultiple ? "(Multiple Selection)" : ""}
            </label>
            {field.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="d-flex align-items-center gap-2">
                <input
                  type={field.settings?.allowMultiple ? "checkbox" : "radio"}
                  name={fieldName}
                  value={option}
                  checked={fieldValue.includes(option)}
                  onChange={(e) => {
                    if (field.settings?.allowMultiple) {
                      const newValue = e.target.checked
                        ? [...(fieldValue || []), option]
                        : (fieldValue || []).filter(v => v !== option);
                      setForm({ ...form, [fieldName]: newValue });
                    } else {
                      setForm({ ...form, [fieldName]: option });
                    }
                  }}
                />
                <span>{option}</span>
              </div>
            ))}
            <p style={{ color: "red" }}>{errors[fieldName]}</p>
          </div>
        );

      case "Checkbox":
        return (
          <div key={index} className="d-flex flex-column gap-2 w-50">
            <label style={{ fontWeight: "600", marginBottom: "5px" }}>
              {field.name}
            </label>
            {field.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  name={`${fieldName}_${optionIndex}`}
                  checked={fieldValue.includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(fieldValue || []), option]
                      : (fieldValue || []).filter(v => v !== option);
                    setForm({ ...form, [fieldName]: newValue });
                  }}
                />
                <span>{option}</span>
              </div>
            ))}
            <p style={{ color: "red" }}>{errors[fieldName]}</p>
          </div>
        );

      case "Dropdown":
        return (
          <div key={index} className="d-flex flex-column gap-2 w-50">
            <label style={{ fontWeight: "600", marginBottom: "5px" }}>
              {field.name}
            </label>
            <select
              name={fieldName}
              value={fieldValue}
              onChange={(e) => setForm({ ...form, [fieldName]: e.target.value })}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px"
              }}
            >
              <option value="">Select {field.name}</option>
              {field.options?.map((option, optionIndex) => (
                <option key={optionIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p style={{ color: "red" }}>{errors[fieldName]}</p>
          </div>
        );

      case "Date":
        return (
          <div key={index} className="d-flex flex-column gap-2 w-50">
            <Input
              label={field.name}
              name={fieldName}
              type="date"
              placeholder={field.name}
              value={fieldValue}
              onChange={(e) => setForm({ ...form, [fieldName]: e.target.value })}
              required
            />
            <p style={{ color: "red" }}>{errors[fieldName]}</p>
          </div>
        );

      case "Short Answer":
      default:
        return (
          <div key={index} className="d-flex flex-column gap-2 w-50">
            <Input
              label={field.name}
              name={fieldName}
              placeholder={field.name}
              value={fieldValue}
              onChange={(e) => setForm({ ...form, [fieldName]: e.target.value })}
              required
            />
            <p style={{ color: "red" }}>{errors[fieldName]}</p>
          </div>
        );
    }
  };

  const fetcheligibilityData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/competitions/eligibility/${competitionsid}`, { method: "GET", redirect: "follow" });
      const result = await response.json();
      console.log("Eligibility API Response:", result);
      
      if (result.success && result.data) {
        setEligibilityData({
          studentInformation: result.data.studentInformation || {
            StudentDetails: [],
            SchoolDetails: []
          },
          additionalDetails: result.data.eligibility?.[0]?.additionalDetails || []
        });
      }
    } catch (error) {
      console.error("Error fetching eligibility data:", error);
    }
  }

  const fetchRegistrationData = async () => {
    if (!competitionsid) {
      console.log("No competition ID provided, using fallback data");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch registration data
      const registrationResponse = await fetch(
        `http://localhost:3001/api/competitions/registration/${competitionsid}`,
        { method: "GET", redirect: "follow" }
      );

      if (!registrationResponse.ok) {
        throw new Error(`HTTP error! status: ${registrationResponse.status}`);
      }

      const registrationResult = await registrationResponse.json();
      console.log("✅ Registration API Response:", registrationResult);

      // Fetch overview data for competition details
      const overviewResponse = await fetch(
        `http://localhost:3001/api/competitions/getoverview/${competitionsid}`,
        { method: "GET", redirect: "follow" }
      );

      let competitionName = "Competition Name";
      let instituteName = "Institute Name";
      let image = null;
      let stageDate = null;

      if (overviewResponse.ok) {
        const overviewResult = await overviewResponse.json();
        if (overviewResult.success && overviewResult.data) {
          competitionName = overviewResult.data.name || "Competition Name";
          instituteName =
            overviewResult.data.instituteName ||
            overviewResult.data.organizerName ||
            "Institute Name";
          image = overviewResult.data.image || null;
          stageDate = overviewResult.data.stages?.[0]?.date || null;
        }
      }

      setCompetitionData({
        name: competitionName,
        instituteName: instituteName,
        image: image,
        stageDate: stageDate,
      });

      // Process plans data - check both plans array and registration_type
      let apiPlans = [];

      // First check if plans array exists and has data
      if (
        registrationResult.success &&
        registrationResult.data?.plans &&
        registrationResult.data.plans.length > 0
      ) {
        apiPlans = registrationResult.data.plans.map((plan, index) => ({
          price: plan.plan_fee || 0,
          title: plan.name || `Plan ${index + 1}`,
          subtitle: plan.description || plan.name || `Plan ${index + 1}`,
          recommended: index === Math.floor(registrationResult.data.plans.length / 2),
          features: [
            { text: "Registration included", included: true },
            {
              text: plan.included || "Additional benefits",
              included: !!plan.included,
            },
            {
              text: plan.not_included
                ? `${plan.not_included} (not included)`
                : "Extra features",
              included: !plan.not_included,
            },
            {
              text: plan.student_limit
                ? `Up to ${plan.student_limit} students`
                : "Student participation",
              included: true,
            },
          ],
          originalPlan: plan,
        }));
      }
      // If no plans array, check registration_type for single plan data
      else if (
        registrationResult.success &&
        registrationResult.data?.registration_type
      ) {
        const regType = registrationResult.data.registration_type;
        apiPlans = [
          {
            price: regType.total_registration_fee || 0,
            title: "Registration Plan",
            subtitle: `Registration for ${competitionName}`,
            recommended: true,
            features: [
              { text: "Registration included", included: true },
              { text: "Competition participation", included: true },
              { text: "Certificate of participation", included: true },
              { text: "Individual participation", included: true },
            ],
            originalPlan: regType,
          },
        ];
      }

      if (apiPlans.length > 0) {
        console.log("✅ Using API plans data:", apiPlans);
        setPlans(apiPlans);
        // Auto-select first plan if no plan is passed via state
        if (!plan) {
          setSelectedPlan(apiPlans[0]);
        }
      } else {
        console.log("⚠️ No plans found in API response, using fallback plans");
        setPlans(fallbackPlans);
        // Auto-select first fallback plan if no plan is passed via state
        if (!plan) {
          setSelectedPlan(fallbackPlans[0]);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching registration data:", error);
      setError(error.message);
      // Set fallback plans on error
      setPlans(fallbackPlans);
      if (!plan) {
        setSelectedPlan(fallbackPlans[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrationData();
    fetcheligibilityData();
  }, [competitionsid]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate only API fields from studentInformation
    eligibilityData.studentInformation?.StudentDetails?.forEach(field => {
      let fieldName = "";
      
      switch (field) {
        case "Student's Name":
          fieldName = "studentName";
          break;
        case "Student's Age":
          fieldName = "studentAge";
          break;
        case "Parent's / Guardian's Name":
          fieldName = "parentName";
          break;
        case "Contact number":
          fieldName = "contactNumber";
          break;
        case "Email ID":
          fieldName = "email";
          break;
        case "City":
          fieldName = "city";
          break;
        case "Address":
          fieldName = "address1";
          break;
        case "Roll number":
          fieldName = "rollNumber";
          break;
        case "Grade":
          fieldName = "grade";
          break;
        case "Section":
          fieldName = "section";
          break;
        case "Birth Date":
          fieldName = "dob";
          break;
        case "Age Group":
          fieldName = "ageGroup";
          break;
        default:
          fieldName = field.toLowerCase().replace(/\s+/g, '');
      }
      
      if (fieldName === "dob") {
        if (!form[fieldName]) {
          newErrors[fieldName] = `${field} is required`;
        } else if (new Date(form[fieldName]) > new Date()) {
          newErrors[fieldName] = "Date cannot be in the future";
        }
      } else if (fieldName === "email" || fieldName === "schoolEmail") {
        if (!form[fieldName]?.trim()) {
          newErrors[fieldName] = `${field} is required`;
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(form[fieldName])) {
            newErrors[fieldName] = "Invalid email format";
          }
        }
      } else {
        if (!form[fieldName]?.trim()) {
          newErrors[fieldName] = `${field} is required`;
        }
      }
    });

    // Validate only API fields from schoolDetails
    eligibilityData.studentInformation?.SchoolDetails?.forEach(field => {
      let fieldName = "";
      
      switch (field) {
        case "School Name":
          fieldName = "school";
          break;
        case "Address":
          fieldName = "schoolAddress";
          break;
        case "Contact Number":
          fieldName = "schoolContactNumber";
          break;
        case "City":
          fieldName = "schoolCity";
          break;
        case "Type of School":
          fieldName = "schoolType";
          break;
        case "POC Name":
          fieldName = "pocName";
          break;
        case "Email ID":
          fieldName = "schoolEmail";
          break;
        case "Student":
          fieldName = "studentCount";
          break;
        case "Additional":
          fieldName = "additionalInfo";
          break;
        default:
          fieldName = field.toLowerCase().replace(/\s+/g, '');
      }
      
      if (fieldName === "schoolEmail") {
        if (!form[fieldName]?.trim()) {
          newErrors[fieldName] = `${field} is required`;
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(form[fieldName])) {
            newErrors[fieldName] = "Invalid email format";
          }
        }
      } else if (fieldName !== "additionalInfo") { // Additional info is optional
        if (!form[fieldName]?.trim()) {
          newErrors[fieldName] = `${field} is required`;
        }
      }
    });

    // Dynamic fields validation
    eligibilityData.additionalDetails?.forEach(field => {
      const fieldName = `dynamic_${field.id}`;
      const fieldValue = form[fieldName];
      
      if (field.type === "Multiple Choice" || field.type === "Checkbox") {
        if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
          newErrors[fieldName] = `${field.name} is required`;
        }
      } else if (field.type === "Dropdown" || field.type === "Date" || field.type === "Short Answer") {
        if (!fieldValue || fieldValue.toString().trim() === "") {
          newErrors[fieldName] = `${field.name} is required`;
        }
      }
    });

    if (!form.isChecked) newErrors.isChecked = "You must agree to the terms";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    // Save registration data
    try {
      const regResponse = await fetch(
        `http://localhost:3001/api/competitions/add-registration/${competitionsid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      const regData = await regResponse.json();
      console.log("Registration API response:", regData);

      // (Optional) Save 'for' field as before
      await fetch(
        `http://localhost:3001/api/competitions/for/${competitionsid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            forField: "School Students",
          }),
        }
      );
    } catch (err) {
      console.error("Error saving registration:", err);
      // Optionally: error handling
    }
    // Show toast/alert on success
    window.alert("Form submitted successfully!");
    navigate(`/Competitionpaymentsummary/${competitionsid}`, {
      state: { plan: currentPlan, form, competitionData },
    });
  };

  // Get the current plan (either from state or selected plan)
  const currentPlan = plan || selectedPlan;

  // Show loading state if no plan is available yet
  if (!currentPlan) {
    return (
      <div className="paymentC-container">
        <Studentheaderhome />
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div>Loading competition data...</div>
        </div>
        <StudentFooter />
      </div>
    );
  }

  return (
    <>
      <Studentheaderhome />
      <div className="paymentC-container">
        <div className="paymentC-plan-info">
          <div className="d-flex">
            <div>
              <h3 style={{ color: "#fff", fontWeight: "400" }}>{competitionData.name}</h3>
              <p>{competitionData.instituteName}</p>
            </div>
          </div>
          <h5 className="mt-2">
            <b>Grade:</b> {competitionData.grade}
          </h5>
          <p>
            <b>Date of 1st Level:</b>{" "}
            {competitionData.stageDate || "9th Aug 2025"}
          </p>
          <div className="paymentC-plan-summary">
            <h3>{currentPlan.title || "Advance Prep"}</h3>
            <p>
              {currentPlan.subtitle ||
                "Registration + Prep + Past year question papers"}
            </p>
            <div style={{ marginBottom: "20px" }}>
              <strong>Price: ₹{currentPlan.price || 0}</strong>
            </div>
            <ul>
              {(currentPlan.features || []).map((f, i) => (
                <li key={i}>
                  {f.included ? (
                    <FaCheck style={{ color: "green", marginRight: "5px" }} />
                  ) : (
                    <FaTimes style={{ color: "red", marginRight: "5px" }} />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <form className="paymentC-form me-2" onSubmit={handleSubmit}>
            <h3 style={{ marginTop: "2rem", fontWeight: "900" }}>
              We Need Some More Information To Process The Application
            </h3>

            {/* Dynamic Student Details based on API */}
            {eligibilityData.studentInformation?.StudentDetails && eligibilityData.studentInformation.StudentDetails.length > 0 && (
              <>
                <h4 style={{ marginTop: "2rem", fontWeight: "700", color: "#333" }}>
                  Student Details
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "1rem", width: "100%" }}>
                  {eligibilityData.studentInformation.StudentDetails.map((field, index) => {
                    // Map API field names to form field names
                    let fieldName = "";
                    let label = field;
                    
                    switch (field) {
                      case "Student's Name":
                        fieldName = "studentName";
                        break;
                      case "Student's Age":
                        fieldName = "studentAge";
                        break;
                      case "Parent's / Guardian's Name":
                        fieldName = "parentName";
                        break;
                      case "Contact number":
                        fieldName = "contactNumber";
                        break;
                      case "Email ID":
                        fieldName = "email";
                        break;
                      case "City":
                        fieldName = "city";
                        break;
                      case "Address":
                        fieldName = "address1";
                        break;
                      case "Roll number":
                        fieldName = "rollNumber";
                        break;
                      case "Grade":
                        fieldName = "grade";
                        break;
                      case "Section":
                        fieldName = "section";
                        break;
                      case "Birth Date":
                        fieldName = "dob";
                        break;
                      case "Age Group":
                        fieldName = "ageGroup";
                        break;
                      default:
                        fieldName = field.toLowerCase().replace(/\s+/g, '');
                    }
                    
                    return (
                      <div key={index} style={{ width: "48%" }}>
                        {fieldName === "dob" ? (
                          <div className="d-flex flex-column gap-2 w-50">
                            <Input
                              label={label}
                              name={fieldName}
                              type="date"
                              placeholder={label}
                              value={form[fieldName] || ""}
                              onChange={handleChange}
                              required
                              ref={dobInputRef}
                              icon={
                                <FaCalendarAlt
                                  onClick={() =>
                                    dobInputRef.current &&
                                    dobInputRef.current.showPicker &&
                                    dobInputRef.current.showPicker()
                                  }
                                  size={18}
                                  title="Open calendar"
                                />
                              }
                            />
                            <p style={{ color: "red" }}>{errors[fieldName]}</p>
                          </div>
                        ) : (
                          renderStudentField(fieldName, label)
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Dynamic School Details based on API */}
            {eligibilityData.studentInformation?.SchoolDetails && eligibilityData.studentInformation.SchoolDetails.length > 0 && (
              <>
                <h4 style={{ marginTop: "3rem", fontWeight: "700", color: "#333" }}>
                  School Details
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "1rem", width: "100%" }}>
                  {eligibilityData.studentInformation.SchoolDetails.map((field, index) => {
                    // Map API field names to form field names
                    let fieldName = "";
                    let label = field;
                    
                    switch (field) {
                      case "School Name":
                        fieldName = "school";
                        break;
                      case "Address":
                        fieldName = "schoolAddress";
                        break;
                      case "Contact Number":
                        fieldName = "schoolContactNumber";
                        break;
                      case "City":
                        fieldName = "schoolCity";
                        break;
                      case "Type of School":
                        fieldName = "schoolType";
                        break;
                      case "POC Name":
                        fieldName = "pocName";
                        break;
                      case "Email ID":
                        fieldName = "schoolEmail";
                        break;
                      case "Student":
                        fieldName = "studentCount";
                        break;
                      case "Additional":
                        fieldName = "additionalInfo";
                        break;
                      default:
                        fieldName = field.toLowerCase().replace(/\s+/g, '');
                    }
                    
                    return (
                      <div key={index} style={{ width: "48%" }}>
                        {fieldName === "schoolEmail" ? (
                          <div className="d-flex flex-column gap-2 w-50">
                            <Input
                              label={label}
                              name={fieldName}
                              type="email"
                              placeholder={label}
                              value={form[fieldName] || ""}
                              onChange={handleChange}
                              required
                            />
                            <p style={{ color: "red" }}>{errors[fieldName]}</p>
                          </div>
                        ) : (
                          renderStudentField(fieldName, label)
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Dynamic Fields from API */}
            {eligibilityData.additionalDetails && eligibilityData.additionalDetails.length > 0 && (
              <>
                <h4 style={{ marginTop: "3rem", fontWeight: "700", color: "#333" }}>
                  Additional Information
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "1rem", width: "100%" }}>
                  {eligibilityData.additionalDetails.map((field, index) => (
                    <div key={field.id} style={{ width: "48%" }}>
                      {renderDynamicField(field, index)}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-3">
              <div className="d-flex align-items-start gap-2">
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={form.isChecked}
                  onChange={(e) => setForm({ ...form, isChecked: e.target.checked })}
                />
                <p>
                  I hereby confirm that the details provided for my child are true and correct to the best of my knowledge. I understand that any false or misleading information may lead to cancellation of the registration. I also give my consent for my child to participate in this competition and for the organisers to use the provided details for necessary communication.
                </p>
              </div>
            </div>

            <div className="paymentC-btn-container">
              <button
                type="submit"
                className="paymentC-save-btn"
                disabled={!form.isChecked}
              >
                Save and Continue
              </button>
            </div>
          </form>
        </div>
      </div>
      <StudentFooter />
    </>
  );
};

export default CompetitionsPayment;                                                                                                                                                         