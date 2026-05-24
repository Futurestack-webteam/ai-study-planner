import "./App.css";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";

function App() {

  const navigate = useNavigate();

  return (

    <div className="app">

      {/* Navbar */}

      <Header />

      {/* Hero Section */}

      <section className="hero">

        <h1>
          Plan Smarter.
          <br />
          Study Better.
        </h1>

        <p>
          AI-powered study planner that creates smart schedules,
          generates quizzes, tracks progress, and helps students
          study efficiently.
        </p>

        <button
          className="get-btn"
          onClick={() => navigate("/planner")}
        >
          Get Started
        </button>

      </section>

      {/* Features */}

      <section className="features">

        <FeatureCard
          title="AI Timetable"
          desc="Automatically generate smart study schedules."
        />

        <FeatureCard
          title="Quiz Generator"
          desc="Generate instant quizzes from study topics."
        />

        <FeatureCard
          title="Progress Tracking"
          desc="Track daily study performance and consistency."
        />

      </section>

      {/* How It Works */}

      <section className="how-section">

        <h2>How It Works</h2>

        <div className="steps">

          <div className="step-card">

            <h3>1. Create Account</h3>

            <p>
              Sign up and personalize your study preferences.
            </p>

          </div>

          <div className="step-card">

            <h3>2. Add Subjects</h3>

            <p>
              Enter subjects, goals, and available study time.
            </p>

          </div>

          <div className="step-card">

            <h3>3. Generate Plan</h3>

            <p>
              AI creates a smart timetable and quizzes automatically.
            </p>

          </div>

          <div className="step-card">

            <h3>4. Track Progress</h3>

            <p>
              Monitor consistency and improve daily productivity.
            </p>

          </div>

        </div>

      </section>

      {/* Dashboard Preview */}

      <section className="dashboard-preview">

        <div className="dashboard-text">

          <h2>
            Your Smart Study Dashboard
          </h2>

          <p>
            Organize subjects, monitor study progress,
            generate quizzes, and get AI-powered
            recommendations all in one place.
          </p>

          <button className="preview-btn">
            Explore Dashboard
          </button>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-top">

            <div className="circle red"></div>
            <div className="circle yellow"></div>
            <div className="circle green"></div>

          </div>

          <div className="dashboard-content">

            <div className="dashboard-box">

              <h4>Study Hours</h4>

              <p>5.5 hrs today</p>

            </div>

            <div className="dashboard-box">

              <h4>Quiz Accuracy</h4>

              <p>87%</p>

            </div>

            <div className="dashboard-box">

              <h4>Tasks Completed</h4>

              <p>12 / 15</p>

            </div>

          </div>

        </div>

      </section>

    </div>

  );
}

function FeatureCard({ title, desc }) {

  return (

    <div className="feature-card">

      <h3>{title}</h3>

      <p>{desc}</p>

    </div>

  );
}

export default App;