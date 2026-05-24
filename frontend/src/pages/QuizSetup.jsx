import { useState } from "react";

import "./QuizSetup.css";

function QuizSetup({
  plannerData,
  setGeneratedQuiz,
  setShowQuizResult,
  setShowQuizSetup,
}) {

  // COMMON

  const [subject, setSubject] =
    useState("");

  const [educationLevel,
    setEducationLevel] =
    useState("");

  const [studyScheme,
    setStudyScheme] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  // SCHOOL

  const [schoolClass,
    setSchoolClass] =
    useState("");

  const [syllabus,
    setSyllabus] =
    useState("");

  const [textbook,
    setTextbook] =
    useState("");

  // COLLEGE

  const [course,
    setCourse] =
    useState("");

  const [university,
    setUniversity] =
    useState("");

  const [semester,
    setSemester] =
    useState("");

  const [referenceBook,
    setReferenceBook] =
    useState("");

  // PDF

  const [pdfFile,
    setPdfFile] =
    useState(null);

  // SUBJECTS FROM PLANNER

  const subjects =
    plannerData?.examTimetable?.map(
      (item) => item.subject
    ) || [];

  // SCHOOL DATA

  const schoolClasses = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];

  const syllabusList = [
    "Kerala State",
    "CBSE",
    "ICSE",
    "Tamil Nadu State",
  ];

  // COLLEGE DATA

  const courses = [
    "BTech Computer Science",
    "BCA",
    "BSc Computer Science",
    "BCom",
    "MBA",
    "MCA",
  ];

  const universities = [
    "KTU",
    "MG University",
    "Kerala University",
    "Calicut University",
  ];

  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];

  // GENERATE QUIZ

  const handleGenerateQuiz =
    async () => {

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

setTimeout(() => {

  window.location.href =
    "/signin";

}, 500);

  return;
}

      if (!subject) {
        alert(
          "Please select subject"
        );
        return;
      }

      try {

        setLoading(true);

        const formData =
          new FormData();

        // COMMON

        formData.append(
          "subject",
          subject
        );

        formData.append(
          "educationLevel",
          educationLevel
        );

        formData.append(
          "studyScheme",
          studyScheme
        );

        // SCHOOL

        formData.append(
          "schoolClass",
          schoolClass
        );

        formData.append(
          "syllabus",
          syllabus
        );

        formData.append(
          "textbook",
          textbook
        );

        // COLLEGE

        formData.append(
          "course",
          course
        );

        formData.append(
          "university",
          university
        );

        formData.append(
          "semester",
          semester
        );

        formData.append(
          "referenceBook",
          referenceBook
        );

        // PDF

        if (pdfFile) {

          formData.append(
            "pdf",
            pdfFile
          );
        }

        const response =
          await fetch(
            "https://ai-study-planner-52s9.onrender.com/generate-quiz",
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        console.log(data);

        if (
          data.quiz &&
          data.quiz.length > 0
        ) {
          if (!token) {

  localStorage.setItem(
    "guestQuizCount",
    1
  );
}
const user =
  JSON.parse(
    localStorage.getItem("user")
  );

const guestId =
  localStorage.getItem(
    "guestId"
  ) ||
  crypto.randomUUID();

localStorage.setItem(
  "guestId",
  guestId
);

await fetch(
  "https://ai-study-planner-52s9.onrender.com/api/quizzes",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({

      subject,

      educationLevel,

      quizData:
        JSON.stringify(
          data.quiz
        ),

      userEmail:
        user?.email || "",

      guestId:
        token
          ? ""
          : guestId,
    }),
  }
);
          setGeneratedQuiz(
            data.quiz
          );

          setShowQuizResult(
            true
          );

        } else {

          alert(
            "No questions generated"
          );
        }

      } catch (error) {

        console.log(error);

        alert(
          "Server Error"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="quiz-page">

      <div className="quiz-container">

        <h1>
          AI Quiz Generator
        </h1>

        {/* SUBJECT */}

        <select
          value={subject}
          onChange={(e) =>
            setSubject(
              e.target.value
            )
          }
        >

          <option value="">
            Select Subject
          </option>

          {subjects.map(
            (item, index) => (

              <option
                key={index}
                value={item}
              >
                {item}
              </option>

            )
          )}

        </select>

        {/* EDUCATION */}

        <select
          value={
            educationLevel
          }
          onChange={(e) =>
            setEducationLevel(
              e.target.value
            )
          }
        >

          <option value="">
            Select Education
          </option>

          <option value="School">
            School
          </option>

          <option value="College">
            College
          </option>

        </select>

        {/* SCHOOL */}

        {educationLevel ===
          "School" && (

          <>

            <select
              value={
                schoolClass
              }
              onChange={(e) =>
                setSchoolClass(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Class
              </option>

              {schoolClasses.map(
                (
                  item,
                  index
                ) => (

                  <option
                    key={index}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

            <select
              value={
                syllabus
              }
              onChange={(e) =>
                setSyllabus(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Syllabus
              </option>

              {syllabusList.map(
                (
                  item,
                  index
                ) => (

                  <option
                    key={index}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

            <input
              type="text"
              placeholder="Enter Textbook Name"
              value={
                textbook
              }
              onChange={(e) =>
                setTextbook(
                  e.target.value
                )
              }
            />

            <select
              value={
                studyScheme
              }
              onChange={(e) =>
                setStudyScheme(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Study Scheme
              </option>

              <option value="SCERT Kerala">
                SCERT Kerala
              </option>

              <option value="NCERT">
                NCERT
              </option>

              <option value="CBSE">
                CBSE
              </option>

              <option value="ICSE">
                ICSE
              </option>

              <option value="Samagra Kerala">
                Samagra Kerala
              </option>

            </select>

          </>

        )}

        {/* COLLEGE */}

        {educationLevel ===
          "College" && (

          <>

            <select
              value={course}
              onChange={(e) =>
                setCourse(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Course
              </option>

              {courses.map(
                (
                  item,
                  index
                ) => (

                  <option
                    key={index}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

            <select
              value={
                university
              }
              onChange={(e) =>
                setUniversity(
                  e.target.value
                )
              }
            >

              <option value="">
                Select University
              </option>

              {universities.map(
                (
                  item,
                  index
                ) => (

                  <option
                    key={index}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

            <select
              value={
                semester
              }
              onChange={(e) =>
                setSemester(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Semester
              </option>

              {semesters.map(
                (
                  item,
                  index
                ) => (

                  <option
                    key={index}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

            <input
              type="text"
              placeholder="Enter Reference Book"
              value={
                referenceBook
              }
              onChange={(e) =>
                setReferenceBook(
                  e.target.value
                )
              }
            />

          </>

        )}

        {/* PDF */}

        <div>

          <label
            className="upload-label"
          >
            Upload Notes /
            Textbook PDF
          </label>

          <input
            type="file"
            accept=".pdf"
            className="pdf-input"
            onChange={(e) => {

  const file =
    e.target.files[0];

  if (!file) return;

  if (
    file.type !==
    "application/pdf"
  ) {

    alert(
      "Only PDF files allowed"
    );

    return;
  }

  if (
    file.size >
    50 * 1024 * 1024
  ) {

    alert(
      "PDF must be below 50MB"
    );

    return;
  }

  setPdfFile(file);
}}
          />

        </div>

        {/* BUTTON */}

<button
  className="generate-btn"
  onClick={
    handleGenerateQuiz
  }
  disabled={loading}
>

          {loading
            ? "Generating..."
            : "Generate Quiz"}

        </button>

        {/* BACK */}

        <button
          className="back-btn"
          onClick={() =>
            setShowQuizSetup(
              false
            )
          }
        >

          Back To Planner

        </button>

      </div>

    </div>

  );
}

export default QuizSetup;