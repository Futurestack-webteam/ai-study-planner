import { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

function Signin() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const signinUser = async () => {

    if (
      !email ||
      !password
    ) {

      alert("Fill all fields");

      return;
    }

    try {

      const response =
        await axios.post(
          "http://localhost:8080/api/auth/signin",
          {
            email,
            password,
          }
        );

      if (
        response.data.success
      ) {

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

        alert(
          "Login Successful"
        );

        navigate("/planner");

      } else {

        alert(
          response.data.message
        );
      }

    } catch (error) {

      console.log(error);

      alert("Signin failed");
    }
  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h1>Welcome Back</h1>

        <p>
          Sign in to continue your smart study journey.
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

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={signinUser}
        >
          Sign In
        </button>

        <p
  onClick={() =>
    navigate(
      "/forgot-password"
    )
  }
  style={{
    cursor: "pointer",
    marginTop: "10px",
    color: "#2563eb",
    fontSize: "14px",
  }}
>
  Forgot Password?
</p>

        <span
          onClick={() =>
            navigate("/signup")
          }
          style={{
            cursor: "pointer",
          }}
        >
          Don't have an account?
          Sign Up
        </span>

      </div>

    </div>
  );
}

export default Signin;