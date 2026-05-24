import "../App.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

import PlanResult from "./PlanResult";
import QuizSetup from "./QuizSetup";
import QuizResult from "./QuizResult";
import Header from "../components/Header";

function Planner() {
  const navigate = useNavigate();

  useEffect(() => {

  const guestId =
    localStorage.getItem(
      "guestId"
    );

  if (!guestId) {

    const newGuestId =
      "guest_" +
      Date.now();

    localStorage.setItem(
      "guestId",
      newGuestId
    );
  }

}, []);

  const [subjectInput, setSubjectInput] =
    useState("");

  const [dateInput, setDateInput] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("");

  const [subjects, setSubjects] =
    useState([]);

  const [focusMode, setFocusMode] =
    useState(false);

  const [editIndex, setEditIndex] =
    useState(null);

  const [generatedPlan, setGeneratedPlan] =
    useState("");

  const [generatedQuiz, setGeneratedQuiz] =
    useState([]);

  const [showPlanPage, setShowPlanPage] =
    useState(false);

  const [showQuizSetup, setShowQuizSetup] =
    useState(false);

  const [showQuizResult, setShowQuizResult] =
    useState(false);

  const [loading, setLoading] =
    useState(false);



  // ADD SUBJECT

  const addSubject = () => {

    if (
      subjectInput.trim() === "" ||
      dateInput === "" ||
      difficulty === ""
    ) {

      alert("Please fill all fields");

      return;
    }

    if (editIndex !== null) {

      const updatedSubjects = [...subjects];

      updatedSubjects[editIndex] = {
        subject: subjectInput,
        examDate: dateInput,
        difficulty: difficulty,
      };

      setSubjects(updatedSubjects);

      setEditIndex(null);

    } else {

      setSubjects([
        ...subjects,
        {
          subject: subjectInput,
          examDate: dateInput,
          difficulty: difficulty,
        },
      ]);
    }

    setSubjectInput("");
    setDateInput("");
    setDifficulty("");
  };

  // EDIT SUBJECT

  const editSubject = (index) => {

    setSubjectInput(subjects[index].subject);

    setDateInput(subjects[index].examDate);

    setDifficulty(subjects[index].difficulty);

    setEditIndex(index);

    setFocusMode(true);
  };

  // GENERATE TIMETABLE

const generateTimetable = async () => {
  const token =
  localStorage.getItem("token");

const guestPlanCount =
  localStorage.getItem(
    "guestPlanCount"
  );

if (
  !token &&
  guestPlanCount >= 1
) {

  alert(
    "Guest limit reached. Please sign in."
  );

  navigate("/signin");

  return;
}

  if (subjects.length === 0) {

    alert("Please add subjects first");

    return;
  }

  try {

    setLoading(true);

    // AI PLAN GENERATION

    const response = await fetch(
      "https://ai-study-planner-52s9.onrender.com/generate-plan",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          subjects: subjects,
        }),
      }
    );

    const data =
      await response.json();

    // SAVE GENERATED PLAN

    setGeneratedPlan(data.plan);

    // SAVE TO MONGODB THROUGH SPRING BOOT

    await fetch(
      "https://ai-study-planner-52s9.onrender.com/api/studyplans",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

body: JSON.stringify({

  studentName:
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    )?.fullName || "Guest",

  className: "Student",

  subject: subjects
    .map((s) => s.subject)
    .join(", "),

  timetable: data.plan,

  userEmail:
  
    JSON.parse(
      
      localStorage.getItem(
        "user"
      )
    )?.email || "guest",
    guestId:
  localStorage.getItem(
    "guestId"
  ),

})
      }
    );

    // OPEN RESULT PAGE
    if (!token) {

  localStorage.setItem(
    "guestPlanCount",
    1
  );
}

    setShowPlanPage(true);

  } catch (error) {

    console.log(error);

    alert(
      "Failed to generate AI timetable"
    );

  } finally {

    setLoading(false);
  }
};

  // OPEN QUIZ PAGE

const generateQuiz = () => {

  const token =
    localStorage.getItem("token");

  const guestQuizCount =
    localStorage.getItem(
      "guestQuizCount"
    );

  if (
    !token &&
    guestQuizCount >= 1
  ) {

    alert(
      "Guest quiz limit reached. Please sign in."
    );

    navigate("/signin");

    return;
  }

  if (subjects.length === 0) {

    alert(
      "Please add subjects first"
    );

    return;
  }

  // SAVE GUEST QUIZ USAGE

  if (!token) {

    localStorage.setItem(
      "guestQuizCount",
      1
    );
  }

  setShowQuizSetup(true);
};

  // PLAN PAGE

  if (showPlanPage) {

    return (

      <PlanResult
        generatedPlan={generatedPlan}
        setShowPlan={setShowPlanPage}
      />

    );
  }

  // QUIZ RESULT PAGE

  if (showQuizResult) {

    return (

      <QuizResult
        generatedQuiz={generatedQuiz}
        setShowQuizResult={
          setShowQuizResult
        }
      />

    );
  }

  // QUIZ SETUP PAGE

  if (showQuizSetup) {

    return (

      <QuizSetup
        plannerData={{
          examTimetable: subjects,
        }}

        setGeneratedQuiz={
          setGeneratedQuiz
        }

        setShowQuizResult={
          setShowQuizResult
        }

        setShowQuizSetup={
          setShowQuizSetup
        }
      />

    );
  }

  // MAIN PAGE

  return (

  <>

    <Header />

    <div
      className={`smart-planner-container ${
        focusMode
          ? "focus-mode"
          : ""
      }`}
    >

      {/* LEFT SIDE */}

      {!focusMode && (

        <div className="smart-left">

          <span className="smart-badge">
            AI Study Planner
          </span>

          <h1>
            Build Your
            <br />
            Smart Study
            <br />
            Routine
          </h1>

          <p>
            Generate AI-powered study
            plans using exam dates and
            subject difficulty levels.
          </p>

        </div>

      )}

      {/* RIGHT SIDE */}

      <div className="smart-right">

        <div className="planner-workspace">

          <h2>
            Create Smart Plan
          </h2>

          {/* INPUTS */}

          <div className="subject-row">

            <input
              type="text"
              placeholder="Enter Subject"
              value={subjectInput}
              onFocus={() =>
                setFocusMode(true)
              }
              onChange={(e) =>
                setSubjectInput(
                  e.target.value
                )
              }
            />

            <input
              type="date"
              value={dateInput}
              onFocus={() =>
                setFocusMode(true)
              }
              onChange={(e) =>
                setDateInput(
                  e.target.value
                )
              }
            />

          </div>

          {/* DIFFICULTY */}

          <select
            className="difficulty-select"
            value={difficulty}
            onChange={(e) =>
              setDifficulty(
                e.target.value
              )
            }
          >

            <option value="">
              Select Difficulty
            </option>

            <option value="Easy">
              Easy
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Hard">
              Hard
            </option>

          </select>

          {/* ADD BUTTON */}

          <button
            className="add-btn"
            onClick={addSubject}
          >

            {editIndex !== null
              ? "Update Subject"
              : "+ Add Subject"}

          </button>

          {/* SUBJECT TABLE */}

          <div className="subject-table">

            <div className="table-head">

              <span>Subject</span>

              <span>Exam Date</span>

              <span>Difficulty</span>

              <span>Action</span>

            </div>

            {subjects.length === 0 ? (

              <div className="table-row">

                <span>No Subjects</span>

                <span>--</span>

                <span>--</span>

                <span>--</span>

              </div>

            ) : (

              subjects.map(
                (item, index) => (

                  <div
                    className="table-row"
                    key={index}
                  >

                    <span>
                      {item.subject}
                    </span>

                    <span>
                      {item.examDate}
                    </span>

                    <span>
                      {item.difficulty}
                    </span>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editSubject(index)
                      }
                    >
                      Edit
                    </button>

                  </div>

                )
              )

            )}

          </div>

          {/* BUTTONS */}

          <div className="bottom-actions">

            <button
              className="generate-btn"
              onClick={
                generateTimetable
              }
            >

              {loading
                ? "Generating..."
                : "Generate Smart Timetable"}

            </button>

            <button
              className="quiz-btn"
              onClick={generateQuiz}
            >

              Generate Quiz

            </button>

          </div>

        </div>

      </div>

        </div>

  </>

  );
}

export default Planner;