import React, { useState } from "react";
import "./AdditionalDetails.css";
import "./Schoolmobile.css";
import { useSendOtpOrganiserPhoneMutation } from "../store/api/apiSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "./common/Input";
import { message } from "antd";
// import Label from "./common/Label";

const Organiserveriemail = () => {
  const [sendOtpOrganiserPhone, { isLoading }] =
    useSendOtpOrganiserPhoneMutation();
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile_num: "",
    name: "",
    role: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [backendError, setBackendError] = useState("");

  const isFormInvalid =
    !formData.mobile_num.trim() ||
    !formData.name.trim() ||
    !formData.role.trim() ||
    !termsAccepted;

  const [formErrors, setFormErrors] = useState({});
  const options = [
    "Admistrator",
    "Trustee / Director",
    "Operations Manager",
    "Teacher",
    "Coach",
    "Principal",
    " Competition POC",
    "Other Staff",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    if (!formData.mobile_num.trim()) {
      errors.mobile_num = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile_num)) {
      errors.mobile_num = "Enter a valid 10-digit mobile number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validate()) return;

  //   try {
  //     const response = await sendOtpOrganiserPhone({
  //       mobileNumber: formData.mobile_num,
  //     }).unwrap();
  //     console.log(response);

  //     if (response.status) {
  //       toast.success("OTP sent successfully!");
  //       Navigate("/organiser/verify-opt", {
  //         state: {
  //           mobileNumber: formData.mobile_num,
  //           role: formData.role,
  //           name: formData.name,
  //         },
  //       });
  //     }
  //   } catch (error) {

  //     console.error("OTP send failed:",error);
  //     console.log(error.data);
  //     toast.error(error?.data?.message || error?.message || "OTP send failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setBackendError("");
    try {
      const response = await sendOtpOrganiserPhone({
        mobileNumber: formData.mobile_num,
      }).unwrap();
      console.log("API Response:", response);

      if (response.status) {
        // toast.success("OTP sent successfully!");
        Navigate("/organiser/verify-opt", {
          state: {
            mobileNumber: formData.mobile_num,
            role: formData.role,
            name: formData.name,
          },
        });
      }
    } catch (error) {
      console.error("OTP send failed:", error);
      let errorMessage = "Failed to send OTP. Please try again.";
      if (error.data && error.data.message) {
        errorMessage = error.data.message; // e.g., "Mobile number already registered. Please use login instead."
      } else if (error.error) {
        errorMessage = error.error;
      }
      setBackendError(errorMessage);
      // toast.error(errorMessage);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form orgenaiser-registration-form">
        <h1 className="heading-details">
          Register Your Organisation To Elevate Your Competitions!
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              label="Your Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Your Full Name"
              required={true}
              className="form-label"
            />
            {formErrors.name && (
              <div className="error-text">{formErrors.name}</div>
            )}
          </div>

          <div className="form-group">
            <h6 className="form-label">
              Your Role in Organisation{" "}
              <span className="required-asterisk">*</span>
            </h6>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select-input inslect"
            >
              <option value="" disabled>
                Select
              </option>
              {options.map((opt, index) => (
                <option key={index} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {formErrors.role && (
              <div className="error-text">{formErrors.role}</div>
            )}
          </div>

          <div className="form-group">
            <h6 className="form-label">
              Your Mobile Number <span style={{ color: "red" }}>*</span>
            </h6>
            <div className="phone-input-wrapper">
              <div className="mains">
                <span className="phone-country">+91</span>
              </div>
              <div>
                <input
                  type="text"
                  name="mobile_num"
                  value={formData.mobile_num}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  maxLength={10}
                  className="phone-input1"
                  style={{ border: "none" }}
                />
              </div>
            </div>
            {formErrors.mobile_num && (
              <div className="error-message1">{formErrors.mobile_num}</div>
            )}
          </div>

          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={handleTermsChange}
            />
            I accept the{" "}
            <a href="#">
              {" "}
              <NavLink to="/termcondition">Terms & Condition</NavLink>{" "}
            </a>{" "}
            and{" "}
            <a href="#">
              <NavLink to="/privacypolicy">Privacy Policy</NavLink>
            </a>
          </label>
          <div>
            {backendError && (
              <div className="error-text" style={{ marginBottom: '10px', color: 'red', fontWeight: 'bold' }}>{backendError}</div>
            )}
          </div>
          <div className="form-button">

            <button
              type="submit"
              disabled={isFormInvalid}
              className="submit-btn mb-2"
              style={{
                background: isFormInvalid ? "#D3D3D3" : "#4CAF4F",
                borderRadius: "4px",
              }}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Organiserveriemail;
