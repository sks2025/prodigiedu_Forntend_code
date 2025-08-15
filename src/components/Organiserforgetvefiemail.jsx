import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useOrganisationforgetpassotpverifyMutation,
  useOrganisationforgetpassotpMutation,
} from "../store/api/apiSlice";
import { toast, ToastContainer } from "react-toastify";
import Button from "./common/Button";
import Card from "./common/Card";
import "./OtpVerification.css";

const Organiserforgetvefiemail = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(90); // 1:30 in seconds
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const { mobileNumber, email } = location.state || {};

  console.log(mobileNumber, email, ": MOBILE/EMAIL");

  const [verifyforgetpassOtp, { isLoading }] =
    useOrganisationforgetpassotpverifyMutation();
  const [sendotp, { isLoading: resendLoading }] =
    useOrganisationforgetpassotpMutation();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      const credentials = mobileNumber
        ? { mobileNumber: mobileNumber, otp: otpValue }
        : { email: email, otp: otpValue };

      const response = await verifyforgetpassOtp(credentials).unwrap();
      if (response.status) {
        // ✅ Delay toast to allow navigation without flicker
        toast.success("OTP verified successfully");

        navigate("/organiser/create-new-password", {
          state: { mobileNumber, email },
        });
      }
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        toast.error(err.data?.message || "Invalid OTP. Please try again.");
      }, 300);
    }
  };

  const handleResendOtp = async () => {
    try {
      const credentials = mobileNumber
        ? { mobileNumber: mobileNumber, isResend: true } // ✅ pass isResend
        : { email: email, isResend: true };

      const response = await sendotp(credentials).unwrap();

      if (response.status) {
        setTimeLeft(90);
        setOtp(["", "", "", ""]);
        inputRefs[0].current.focus();

        // ✅ Delay toast for better UX
        toast.success("OTP resent successfully");
      } else {
        setTimeout(() => {
          toast.error(response.message || "Failed to resend OTP");
        }, 300);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setTimeout(() => {
        toast.error(
          error?.data?.message || "Failed to resend OTP. Please try again."
        );
      }, 300);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const displayContact = mobileNumber || email;

  return (
    <div className="registration-container">
      <Card className="registration-form ">
        <h1 style={{ marginTop: "5rem" }}>
          {mobileNumber ? "Verify your Mobile Number" : "Verify your Email ID"}
        </h1>

        <p className="otp-instruction">
          Enter the OTP sent to - {displayContact}
        </p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
            />
          ))}
        </div>

        <div className="timer">{formatTime(timeLeft)} Sec</div>

        <div className="resend-otp">
          Don't receive code?{" "}
          <Button
            onClick={handleResendOtp}
            variant="text"
            className="resend-button"
            disabled={timeLeft > 0 || resendLoading}
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="large"
            disabled={isLoading || otp.some((digit) => digit === "")}
            className="submit-btn"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Organiserforgetvefiemail;
