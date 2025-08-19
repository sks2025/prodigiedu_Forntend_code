import React, { useState } from "react";
import "./StudentLogin.css";
import "./SchoolDetails.css";
import "./AdditionalDetails.css";

import { useLocation, useNavigate } from "react-router-dom";
import Button from "./common/Button"; // Ensure this is the correct Button component
import Input from "./common/Input";
import Card from "./common/Card";
import { useOrganisationRegisterMutation } from "../store/api/apiSlice";
// import { toast } from "react-toastify";
import { City } from 'country-state-city';
const Organiserdetails = () => {
  const cities = City.getCitiesOfState('IN', 'RJ'); // IN = India, RJ = Rajasthan
  console.log(cities);
  const navigate = useNavigate();
  const [organisationRegister, { isLoading }] = useOrganisationRegisterMutation();
  const location = useLocation();
  const { mobileNumber, role, name, password, email } = location.state || {};
  console.log(mobileNumber, role, name, password, email, "last data");

  const [formData, setFormData] = useState({
    name: name || "",
    role: role || "",
    mobileNumber: mobileNumber || "",
    organiserName: "",
    organiserAddress: {
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      cityDistrict: "",
      pincode: "",
      country: "India",
    },
    organiserMobileNumber: "",
    organiserEmail: "",
    organiserWebsite: "",
    directorName: "",
    directorMobileNumber: "",
    password: password || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.organiserName.trim()) {
      newErrors.organiserName = "Organiser Name is required";
    }

    if (!formData.organiserAddress.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required";
    }

    if (!formData.organiserAddress.cityDistrict.trim()) {
      newErrors.cityDistrict = "City / District is required";
    }

    if (!formData.organiserAddress.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{5,6}$/.test(formData.organiserAddress.pincode.trim())) {
      newErrors.pincode = "Pincode must be 5 or 6 digits";
    }

    if (!formData.organiserAddress.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.organiserMobileNumber.trim()) {
      newErrors.organiserMobileNumber = "Organiser Mobile Number is required";
    } else if (!/^\+91\d{10}$/.test(formData.organiserMobileNumber.trim())) {
      newErrors.organiserMobileNumber = "Enter valid 10 digit mobile number starting with +91";
    }

    if (!formData.organiserEmail.trim()) {
      newErrors.organiserEmail = "Organiser Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.organiserEmail.trim()
      )
    ) {
      newErrors.organiserEmail = "Enter valid email address";
    }

    if (
      formData.organiserWebsite.trim() &&
      !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(
        formData.organiserWebsite.trim()
      )
    ) {
      newErrors.organiserWebsite =
        "Enter valid website URL starting with http/https";
    }

    if (
      formData.directorMobileNumber.trim() &&
      !/^\+91\d{10}$/.test(formData.directorMobileNumber.trim())
    ) {
      newErrors.directorMobileNumber =
        "Enter valid 10 digit mobile number starting with +91";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value, nestedField) => {
    if (nestedField) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nestedField]: value,
        },
      }));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[nestedField];
        return copy;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const isFormCompletelyFilled = () => {
    const {
      organiserName,
      organiserAddress,
      organiserMobileNumber,
      organiserEmail,
    } = formData;

    return (
      organiserName.trim() &&
      organiserAddress.addressLine1.trim() &&
      organiserAddress.cityDistrict.trim() &&
      organiserAddress.pincode.trim() &&
      organiserAddress.country.trim() &&
      organiserMobileNumber.trim() &&
      organiserEmail.trim()
    );
  };

  return (
    <div className="Organiserform Organiserform-detail-form">
      <div className="registration-container">
        <div style={{ height: "100vh", overflowY: "scroll" }}>
          <Card className="registration-form">
            <h1>Tell us more about your Organisation</h1>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (validate()) {
                  try {
                    const response = await organisationRegister(formData).unwrap();
                    console.log(response, "response");
                    if (response.status || response.data?.status) {
                      // toast.success("Registration successful!");
                      navigate("/organiser/login");
                    } else {
                      // toast.error(
                      //   response.message || "Registration failed. Please try again."
                      // );
                    }
                  } catch (error) {
                    console.error("Registration error:", error);
                    // toast.error(
                    //   error?.data?.message || "An error occurred. Please try again."
                    // );
                  }
                } else {
                  // toast.error("Please fix the form errors before submitting.");
                }
              }}
            >
              <div className="form-group">
                <Input
                  label="Organiser Name"
                  name="organiserName"
                  value={formData.organiserName}
                  onChange={(e) => handleChange("organiserName", e.target.value)}
                  placeholder="Enter Organiser Name"
                  required
                />
                {errors.organiserName && (
                  <div className="error-message">{errors.organiserName}</div>
                )}
              </div>

              <div
                className="form-group password-group"
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <div
                  className="form-group"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Input
                    label="Organiser Address Line 1"
                    name="addressLine1"
                    value={formData.organiserAddress.addressLine1}
                    onChange={(e) =>
                      handleChange(
                        "organiserAddress",
                        e.target.value,
                        "addressLine1"
                      )
                    }
                    type="text"
                    placeholder="Address Line 1"
                    required
                  />
                  {errors.addressLine1 && (
                    <div className="error-message1">{errors.addressLine1}</div>
                  )}

                  <Input
                    name="addressLine2"
                    value={formData.organiserAddress.addressLine2}
                    onChange={(e) =>
                      handleChange(
                        "organiserAddress",
                        e.target.value,
                        "addressLine2"
                      )
                    }
                    type="text"
                    placeholder="Address Line 2"
                  />
                  {errors.addressLine2 && (
                    <div className="error-message1">{errors.addressLine2}</div>
                  )}

                  <Input
                    name="addressLine3"
                    value={formData.organiserAddress.addressLine3}
                    onChange={(e) =>
                      handleChange(
                        "organiserAddress",
                        e.target.value,
                        "addressLine3"
                      )
                    }
                    type="text"
                    placeholder="Address Line 3"
                  />
                  {errors.addressLine3 && (
                    <div className="error-message1">{errors.addressLine3}</div>
                  )}
                </div>

                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cityDistrict" className="contit">
                      City / District
                    </label>
                    <select
                      className="custom-select select-input"
                      name="cityDistrict"
                      value={formData.organiserAddress.cityDistrict}
                      onChange={(e) =>
                        handleChange(
                          "organiserAddress",
                          e.target.value,
                          "cityDistrict"
                        )
                      }
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.cityDistrict && (
                      <div className="error-message1">{errors.cityDistrict}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <Input
                      label="Pincode"
                      name="pincode"
                      value={formData.organiserAddress.pincode}
                      onChange={(e) =>
                        handleChange(
                          "organiserAddress",
                          e.target.value,
                          "pincode"
                        )
                      }
                      placeholder="Enter Pincode"
                      required
                    />
                    {errors.pincode && (
                      <div className="error-message1">{errors.pincode}</div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="Country" className="contit">
                    Country
                  </label>
                  <select
                    className="custom-select select-input"
                    value={formData.organiserAddress.country}
                    onChange={(e) =>
                      handleChange("organiserAddress", e.target.value, "country")
                    }
                  >
                    <option value="India">India</option>
                  </select>
                  {errors.country && (
                    <div className="error-message1">{errors.country}</div>
                  )}
                </div>

                <div className="form-group">
                  <Input
                    label="Organiser Mobile number"
                    name="organiserMobileNumber"
                    value={formData.organiserMobileNumber || "+91"}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith("+91")) {
                        value = "+91" + value.replace(/^\+?91?/, "");
                      }
                      value = value.replace(/[^\d+]/g, "");
                      if (value.length > 13) value = value.slice(0, 13);
                      handleChange("organiserMobileNumber", value);
                    }}
                    maxLength={13}
                    placeholder="Enter organisation's official mobile number"
                    required
                  />
                  {errors.organiserMobileNumber && (
                    <div className="error-message1">
                      {errors.organiserMobileNumber}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <Input
                    label="Organiser Email ID"
                    name="organiserEmail"
                    value={formData.organiserEmail}
                    onChange={(e) =>
                      handleChange("organiserEmail", e.target.value)
                    }
                    placeholder="Enter organisation's official email ID"
                    required
                  />
                  {errors.organiserEmail && (
                    <div className="error-message1">{errors.organiserEmail}</div>
                  )}
                </div>

                <div className="form-group">
                  <Input
                    label="Organiser Website link"
                    name="organiserWebsite"
                    value={formData.organiserWebsite}
                    onChange={(e) =>
                      handleChange("organiserWebsite", e.target.value)
                    }
                    placeholder="Enter link to Organiser's website"
                  />
                  {errors.organiserWebsite && (
                    <div className="error-message1">{errors.organiserWebsite}</div>
                  )}
                </div>

                <div className="form-group">
                  <Input
                    label="Director's Name"
                    name="directorName"
                    value={formData.directorName}
                    onChange={(e) => handleChange("directorName", e.target.value)}
                    placeholder="Enter Director's Name"
                  />
                  {errors.directorName && (
                    <div className="error-message1">{errors.directorName}</div>
                  )}
                </div>

                <div className="form-group">
                  <Input
                    label="Director's Mobile Number"
                    name="directorMobileNumber"
                    value={formData.directorMobileNumber || "+91"}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith("+91")) {
                        value = "+91" + value.replace(/^\+?91?/, "");
                      }
                      value = value.replace(/[^\d+]/g, "");
                      if (value.length > 13) value = value.slice(0, 13);
                      handleChange("directorMobileNumber", value);
                    }}
                    maxLength={13}
                    placeholder="Enter Director's Mobile Number"
                  />
                  {errors.directorMobileNumber && (
                    <div className="error-message1">
                      {errors.directorMobileNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions d-flex justify-content-center">
                <button
                  type="submit"
                  size="large"
                  className="submit-btn sub-but"
                  disabled={isLoading || !formData.organiserAddress.addressLine1.trim()}
                  style={{
                    background: formData.organiserAddress.addressLine1.trim()
                      ? "#4CAF4F"
                      : "#D3D3D3",
                  }}
                >
                  {isLoading ? "Submitting..." : "Continue"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Organiserdetails;