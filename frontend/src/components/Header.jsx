import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function Header() {

  const navigate = useNavigate();

  const [showHeader, setShowHeader] =
  useState(true);

useEffect(() => {

  let lastScroll = 0;

  const handleScroll = () => {

    const currentScroll =
      window.pageYOffset;

    if (
      currentScroll > lastScroll &&
      currentScroll > 80
    ) {

      setShowHeader(false);

    } else {

      setShowHeader(true);
    }

    lastScroll = currentScroll;
  };

  window.addEventListener(
    "scroll",
    handleScroll
  );

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll
    );

}, []);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const logoutUser = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/");

    window.location.reload();
  };

  return (

    <header
  className={`main-header ${
    showHeader
      ? "show-navbar"
      : "hide-navbar"
  }`}
>

      <div
        className="header-logo"
        onClick={() => navigate("/")}
      >
        AI Study Planner
      </div>

      <div className="header-right">

        {!token ? (

          <>

            <button
              className="header-btn"
              onClick={() =>
                navigate("/signin")
              }
            >
              Sign In
            </button>

            <button
              className="header-btn signup-btn"
              onClick={() =>
                navigate("/signup")
              }
            >
              Sign Up
            </button>

          </>

        ) : (

          <div className="profile-wrapper">

            <div
              className="profile-circle"
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
            >
              {
                user?.fullName
                  ?.charAt(0)
                  ?.toUpperCase()
              }
            </div>

            {menuOpen && (

              <div className="profile-menu">

                <p className="profile-name">
                  {
                    user?.fullName
                  }
                </p>

                <p className="profile-email">
                  {
                    user?.email
                  }
                </p>

               <button
  type="button"
  onClick={() => {

    setMenuOpen(false);

    navigate("/");
  }}
>
  Home
</button>

 <button
  type="button"
  onClick={() => {

    setMenuOpen(false);

    alert(
      "History feature coming soon."
    );
  }}
>
  History
</button>

                <button
                  onClick={
                    logoutUser
                  }
                  className="logout-btn"
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        )}

      </div>

    </header>
  );
}

export default Header;