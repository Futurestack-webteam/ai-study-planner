import { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

function Signup() {

  const navigate = useNavigate();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [otpLoading, setOtpLoading] =
    useState(false);

  const [signupLoading, setSignupLoading] =
    useState(false);

    const sendOtp = async () => {

  if (otpLoading) return;

  setOtpLoading(true);

  if (
    !fullName ||
    !email ||
    !password
  ) {

    setOtpLoading(false);

    alert(
      "Fill all fields first"
    );

    return;
  }

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
        "OTP sent to email"
      );

      setOtpSent(true);
      setOtpLoading(false);
    } else {

      setOtpLoading(false);

      alert(
        response.data.message
      );
    }

  } catch (error) {

    console.log(error);

    setOtpLoading(false);

    alert(
      "Failed to send OTP"
    );
  }
};

  const signupUser = async () => {

    if (signupLoading) return;

setSignupLoading(true);

    if (
      !fullName ||
      !email ||
      !password
    ) {

      setSignupLoading(false);

      alert("Fill all fields");

      return;
    }

    try {

      const response =
        await axios.post(
          "https://ai-study-planner-52s9.onrender.com/api/auth/signup",
       {
         fullName,
         email,
         password,
         otp,
        }
        );

      if (
        response.data.success
      ) {

        setSignupLoading(false);

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

       alert("Signup Successful");

        navigate("/planner");

      } else {

        setSignupLoading(false);

        alert(
          response.data.message
        );
      }

    } catch (error) {

      setSignupLoading(false);

      console.log(error);

      alert("Signup failed");
    }
  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h1>Create Account</h1>

        <p>
          Start planning your studies smarter with AI.
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(
              e.target.value
            )
          }
        />

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

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        {otpSent && (

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

)}

{!otpSent ? (

<button
  onClick={sendOtp}
  disabled={otpLoading}
>
  {otpLoading
    ? "Sending OTP..."
    : "Send OTP"}
</button>
) : (

<button
  onClick={signupUser}
  disabled={signupLoading}
>
  {signupLoading
    ? "Creating Account..."
    : "Verify & Create Account"}
</button>

)}

        <span
          onClick={() =>
            navigate("/signin")
          }
          style={{
            cursor: "pointer",
          }}
        >
          Already have an account?
          Sign In
        </span>

      </div>

    </div>
  );
}

export default Signup;