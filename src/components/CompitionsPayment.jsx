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
  const [competitionData, setCompetitionData] = useState({
    name: "Competition Name",
    instituteName: "Institute Name",
    image: null,
    stageDate: null,
    grade: "6th",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    studentName: "",
    dob: "",
    school: "",
    grade: "",
    email: "",
    parentName: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
  });
  const [errors, setErrors] = useState({});

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
        `https://api.prodigiedu.com/api/competitions/registration/${competitionsid}`,
        { method: "GET", redirect: "follow" }
      );

      if (!registrationResponse.ok) {
        throw new Error(`HTTP error! status: ${registrationResponse.status}`);
      }

      const registrationResult = await registrationResponse.json();
      console.log("✅ Registration API Response:", registrationResult);

      // Fetch overview data for competition details
      const overviewResponse = await fetch(
        `https://api.prodigiedu.com/api/competitions/getoverview/${competitionsid}`,
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

      // Process plans data
      if (registrationResult.success && registrationResult.data?.plans) {
        const apiPlans = registrationResult.data.plans.map((plan, index) => ({
          price: plan.plan_fee || 0,
          title: plan.name || `Plan ${index + 1}`,
          subtitle: plan.description || plan.name || `Plan ${index + 1}`,
          recommended:
            index === Math.floor(registrationResult.data.plans.length / 2),
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
        setPlans(apiPlans);
      } else {
        console.log("⚠️ No plans found in API response, using fallback plans");
      }
    } catch (error) {
      console.error("❌ Error fetching registration data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrationData();
  }, [competitionsid]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.studentName.trim())
      newErrors.studentName = "Student Name";
    if (!form.parentName.trim())
      newErrors.parentName = "Parent/Guardian Name";
    if (!form.dob) newErrors.dob = "Date of Birth";
    else if (new Date(form.dob) > new Date())
      newErrors.dob = "DOB cannot be in the future";
    if (!form.school.trim()) newErrors.school = "School";
    if (!form.grade.trim()) newErrors.grade = "Grade";
    if (!form.address1.trim())
      newErrors.address1 = "Address Line 1";
    if (!form.city.trim()) newErrors.city = "City";
    if (!form.country.trim()) newErrors.country = "Country";
    if (!form.email.trim()) newErrors.email = "Email";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email))
        newErrors.email = "Invalid email format";
    }
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
        `https://api.prodigiedu.com/api/competitions/add-registration/${competitionsid}`,
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
        `https://api.prodigiedu.com/api/competitions/for/${competitionsid}`,
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
    navigate("/Competitionpaymentsummary", {
      state: { plan, form, competitionData },
    });
  };

  if (!plan) {
    return (
      <div className="paymentC-container">
        <Studentheaderhome />
        <div className="error-message">
          No plan selected. Please select a plan to continue.
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
              <h2>{competitionData.name}</h2>
              <p>{competitionData.instituteName}</p>
            </div>
          </div>
          <p>
            <b>Grade:</b> {competitionData.grade}
          </p>
          <p>
            <b>Date of 1st Level:</b>{" "}
            {competitionData.stageDate || "9th Aug 2025"}
          </p>
          <div className="paymentC-plan-summary">
            <h3>{plan.title || "Advance Prep"}</h3>
            <p>
              {plan.subtitle ||
                "Registration + Prep + Past year question papers"}
            </p>
            <ul>
              {(plan.features || []).map((f, i) => (
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
        <form className="paymentC-form ms-5" onSubmit={handleSubmit}>
          <h3 style={{ marginTop: "2rem", fontWeight: "900" }}>
            We Need Some More Information To Process The Application
          </h3>

          <div style={{ display: "flex", gap: "20px", marginTop: "2rem" }}>
            <Input
              label="Student Name"
              name="studentName"
              placeholder="Student Name"
              value={form.studentName}
              onChange={handleChange}
              error={errors.studentName}
              required
            />
            <Input
              label="Parent / Guardian Name"
              name="parentName"
              placeholder="Parent / Guardian Name"
              value={form.parentName}
              onChange={handleChange}
              error={errors.parentName}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              placeholder="Date of Birth"
              value={form.dob}
              onChange={handleChange}
              error={errors.dob}
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
            <Input
              label="Address Line 1"
              name="address1"
              placeholder="Address Line 1"
              value={form.address1}
              onChange={handleChange}
              error={errors.address1}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <Input
              label="School"
              name="school"
              placeholder="School"
              value={form.school}
              onChange={handleChange}
              error={errors.school}
              required
            />
            <Input
              label="Address Line 2"
              name="address2"
              placeholder="Address Line 2"
              value={form.address2}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <Input
              label="Grade"
              name="grade"
              placeholder="Grade"
              value={form.grade}
              onChange={handleChange}
              error={errors.grade}
              required
            />
            <Input
              label="City"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              error={errors.city}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <Input
              label="School email ID"
              name="email"
              type="email"
              placeholder="School email ID"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label="Country"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              error={errors.country}
              required
            />
          </div>

          <div className="paymentC-btn-container">
            <button type="submit" className="paymentC-save-btn">
              Save and Continue
            </button>
          </div>
        </form>
      </div>
      <StudentFooter />
    </>
  );
};

export default CompetitionsPayment;
