import { useState } from "react";

import axios from "axios";

import { useNavigate }
from "react-router-dom";

function ForgotPassword() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  const [otpSent,
    setOtpSent] =
    useState(false);

  const sendOtp = async () => {

    try {

      const response =
        await axios.post(
          "https://ai-study-planner-52s9.onrender.com/api/auth/send-otp",
          {
            email,
          }
        );

      if (
        response.data.success
      ) {

        alert(
          "OTP sent successfully"
        );

        setOtpSent(true);

      } else {

        alert(
          response.data.message
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Failed to send OTP"
      );
    }
  };

  const resetPassword =
    async () => {

    try {

      const response =
        await axios.post(
          "https://ai-study-planner-52s9.onrender.com/api/auth/reset-password",
          {
            email,
            otp,
            password:
              newPassword,
          }
        );

      if (
        response.data.success
      ) {

        alert(
          "Password updated"
        );

        navigate("/signin");

      } else {

        alert(
          response.data.message
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Reset failed"
      );
    }
  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h1>
          Forgot Password
        </h1>

        <p>
          Reset your password
          using OTP verification.
        </p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        {!otpSent ? (

          <button
            onClick={sendOtp}
          >
            Send OTP
          </button>

        ) : (

          <>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                resetPassword
              }
            >
              Reset Password
            </button>

          </>

        )}

      </div>

    </div>
  );
}

export default ForgotPassword;