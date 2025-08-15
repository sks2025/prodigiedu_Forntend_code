import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Button from "./common/Button";
import Card from "./common/Card";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useOrganisationresetpasswordMutation } from "../store/api/apiSlice";
import { toast } from "react-toastify";

const Organisernewpassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mobileNumber } = location.state || {};

  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ password: "", reenterPassword: "" });

  const [resetpassword, { isLoading }] = useOrganisationresetpasswordMutation();

  // Password validation regex: at least 8 characters, 1 letter, 1 number, 1 special character
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validate password
  const validatePassword = (pwd) => {
    if (!pwd) return "Password is required.";
    if (!passwordRegex.test(pwd)) {
      return "Password must be at least 8 characters long, including one letter, one number, and one special character.";
    }
    return "";
  };

  // Validate re-entered password
  const validateReenterPassword = (pwd, rePwd) => {
    if (!rePwd) return "Please confirm your password.";
    if (pwd !== rePwd) return "Passwords do not match.";
    return "";
  };

  // Handle input changes with real-time validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(newPassword),
      reenterPassword: validateReenterPassword(newPassword, reenterPassword),
    }));
  };

  const handleReenterPasswordChange = (e) => {
    const newReenterPassword = e.target.value;
    setReenterPassword(newReenterPassword);
    setErrors((prev) => ({
      ...prev,
      reenterPassword: validateReenterPassword(password, newReenterPassword),
    }));
  };

  const handleOTPVerify = async () => {
    // Validate inputs before submission
    const passwordError = validatePassword(password);
    const reenterPasswordError = validateReenterPassword(password, reenterPassword);

    if (passwordError || reenterPasswordError) {
      setErrors({ password: passwordError, reenterPassword: reenterPasswordError });
      toast.error("Please fix the errors before submitting.");
      return;
    }

    // Check if mobileNumber exists
    if (!mobileNumber) {
      toast.error("Invalid session. Please try again from the start.");
      navigate("/organiser/login");
      return;
    }

    try {
      const credentials = {
        mobileNumber: mobileNumber,
        newPassword: password,
      };
      const response = await resetpassword(credentials).unwrap();
      if (response.status) {
        toast.success("Password updated successfully!");
        navigate("/organiser/login");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(error.data?.message || "Something went wrong. Try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Form is valid if there are no errors and inputs are non-empty
  const isFormValid = !errors.password && !errors.reenterPassword && password && reenterPassword;

  return (
    <div className="contanier-fluid">
      <div className="registration-container">
        <div style={{ width: "100%" }}>
          <Card className="registration-form1">
            <h2>Create New Password</h2>

            <label style={{ marginTop: "3rem" }}>New Password</label>
            <input
              className="custom-input1"
              type="password"
              placeholder="Create New Password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
            />
            {errors.password && <p className="error-text" style={{ color: "red", fontSize: "0.9rem" }}>{errors.password}</p>}

            <label className="mt-4">Re-enter Password</label>
            <div className="password-wrapper">
              <input
                className="custom-input1"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={reenterPassword}
                onChange={handleReenterPasswordChange}
                disabled={isLoading}
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            {errors.reenterPassword && (
              <p className="error-text" style={{ color: "red", fontSize: "0.9rem" }}>{errors.reenterPassword}</p>
            )}

            <Button
              onClick={handleOTPVerify}
              variant="primary"
              size="large"
              className="submit-btn1"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Organisernewpassword;