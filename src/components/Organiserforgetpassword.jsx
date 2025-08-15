import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import "./Schoolforgatpassword.css";
import Card from "./common/Card";
import { useOrganisationforgetpassotpMutation } from "../store/api/apiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../components/common/Input";

const Organiserforgetpassword = () => {
  const navigate = useNavigate();
  const [sendotp, { isLoading }] = useOrganisationforgetpassotpMutation();

  const [formData, setFormData] = useState({
    mobileNumber: "",
  });

  const [formValidate, setFormValidate] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormValidate(value.trim() !== "");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      toast.error(
        "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"
      );
      return;
    }

    try {
      const response = await sendotp({
        mobileNumber: formData.mobileNumber,
      }).unwrap();

      if (response.status) {
        console.log(response.message);

        const method = response.method || "sms";
        let successMessage = "OTP sent successfully!";

        if (method === "sms") {
          successMessage = "OTP sent successfully via SMS!";
        } else if (method === "email_fallback") {
          successMessage = "OTP sent via email (SMS failed). Check your email!";
        } else if (method === "email") {
          successMessage = "OTP sent successfully via email!";
        }
        toast.success(successMessage);

        // ✅ Delay navigation so toast is visible for 1.5 seconds
        setTimeout(() => {
          navigate("/organiser/verify-forget-email-otp", {
            state: {
              mobileNumber: formData.mobileNumber,
              method: method,
              otp: response.otp,
            },
          });
        }, 1500);
      } else {
        toast.error(response.message || "Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);

      if (error?.status === 404) {
        toast.error(
          "No account found with this mobile number. Please check and try again."
        );
      } else if (error?.status === 400) {
        toast.error(
          error?.data?.message ||
            "Invalid request. Please check your mobile number."
        );
      } else {
        toast.error(
          error?.data?.message ||
            "Something went wrong. Please try again later."
        );
      }
    }
  };

  return (
    <div className="schoolforgat">
      <div className="">
        <div className="registration-container">
          <div>
            <Card className="registration-form1" style={{ width: "100%" }}>
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "34px",
                  fontWeight: "800",
                  marginBottom: "5px",
                }}
              >
                Forgot your password?
              </h2>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "30px",
                }}
              >
                Don’t worry ! It happens. Please enter your <br /> registered
                email ID
              </p>

              <form>
                <div
                  style={{
                    marginBottom: "25px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginTop: "1.5rem" }}>
                    <span>+91</span>
                  </div>
                  <div>
                    <Input
                      label=" Mobile No"
                      name="mobileNumber"
                      placeholder="Mobile No"
                      type="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      style={{
                        width: "300px",
                        padding: "10px 0",
                        border: "none",
                        borderBottom: "1px solid #000",
                        fontSize: "14px",
                        outline: "none",
                        color: "#333",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginBottom: "25px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="submit"
                    onClick={handleSendOTP}
                    disabled={!formValidate || isLoading}
                    style={{
                      backgroundColor:
                        !formValidate || isLoading ? "#ccc" : "#1c7e41",
                      color: "#fff",
                      padding: "10px 30px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      cursor:
                        !formValidate || isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  <span>Still facing issues? </span>
                  <Link
                    to="/StudentContactus"
                    style={{ color: "#0000EE", textDecoration: "underline" }}
                  >
                    Contact Us
                  </Link>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Organiserforgetpassword;
