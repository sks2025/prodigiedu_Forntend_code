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
    // Additional school details
    schoolAddress: "",
    schoolPhone: "",
    schoolEmail: "",
    principalName: "",
    schoolBoard: "",
    schoolType: "",
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
    rollNumber: "",
    // Additional information
    bloodGroup: "",
    medicalConditions: "",
    specialNeeds: "",
    transportMode: "",
    // Checkbox state
    isChecked: false,
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
  }, [competitionsid]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.studentName.trim()) newErrors.studentName = "Student Name is required";
    if (!form.parentName.trim()) newErrors.parentName = "Parent/Guardian Name is required";
    if (!form.dob) newErrors.dob = "Date of Birth is required";
    else if (new Date(form.dob) > new Date())
      newErrors.dob = "DOB cannot be in the future";

    if (!form.school.trim()) newErrors.school = "School is required";
    if (!form.grade.trim()) newErrors.grade = "Grade is required";
    if (!form.address1.trim()) newErrors.address1 = "Address Line 1 is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";
    }
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

            <div style={{ display: "flex", gap: "20px", marginTop: "2rem", width: "100%" }}>
              <div className="d-flex flex-column gap-2 w-50">
                <Input
                  label="Student Name"
                  name="studentName"
                  placeholder="Student Name"
                  value={form.studentName}
                  onChange={handleChange}
                  // error={errors.studentName}
                  required
                />
                <p style={{ color: "red" }}>{errors.studentName}</p>
              </div>
              <div className="d-flex flex-column gap-2 w-50">
                <Input
                  label="Parent / Guardian Name"
                  name="parentName"
                  placeholder="Parent / Guardian Name"
                  value={form.parentName}
                  onChange={handleChange}

                  required
                />
                <p style={{ color: "red" }}>{errors.parentName}</p>

              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px", width: "100%" }}>
              <div className="d-flex flex-column gap-2 w-50">
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  placeholder="Date of Birth"
                  value={form.dob}
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
                <p style={{ color: "red" }}>{errors.dob}</p>
              </div>
              <div className="d-flex flex-column gap-2 w-50">
                <Input
                  label="Address Line 1"
                  name="address1"
                  placeholder="Address Line 1"
                  value={form.address1}
                  onChange={handleChange}
                  required
                />
                <p style={{ color: "red" }}>{errors.address1}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px", width: "100%" }}>
              <div className="d-flex flex-column gap-2 w-50">
                <Input
                  label="School"
                  name="school"
                  placeholder="School"
                  value={form.school}
                  onChange={handleChange}

                  required
                />
                <p style={{ color: "red" }}>{errors.school}</p>
              </div>
              <div className="d-flex flex-column gap-2 w-50">
                <Input
                  label="Address Line 2"
                  name="address2"
                  placeholder="Address Line 2"
                  value={form.address2}
                  onChange={handleChange}
                />
                <p style={{ color: "red" }}>{errors.address2}</p>
              </div>


            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px", width: "100%" }}>
              <div className="d-flex flex-column gap-2 w-50">
                <Input
                  label="Grade"
                  name="grade"
                  placeholder="Grade"
                  value={form.grade}
                  onChange={handleChange}
                  required
                />
                <p style={{ color: "red" }}>{errors.grade}</p>
              </div>

              <div className="d-flex flex-column gap-2 w-50">
                <Input
                  label="City"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
                <p style={{ color: "red" }}>{errors.city}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px", width: "100%" }}>
              <div className="d-flex flex-column gap-2 w-50">
                <Input
                  label="School email ID"
                  name="email"
                  type="email"
                  placeholder="School email ID"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <p style={{ color: "red" }}>{errors.email}</p>

              </div>
              <div className="d-flex flex-column gap-2 w-50">

                <Input
                  label="Country"
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  required
                />

                <p style={{ color: "red" }}>{errors.country}</p>
              </div>
            </div>

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