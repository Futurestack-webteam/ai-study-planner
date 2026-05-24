import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "../App";

import Planner from "../pages/Planner";

import Signup from "../pages/Signup";

import Signin from "../pages/Signin";

import ForgotPassword
from "../pages/ForgotPassword";

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/planner"
          element={<Planner />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/signin"
          element={<Signin />}
        />

        <Route
  path="/forgot-password"
  element={
    <ForgotPassword />
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;