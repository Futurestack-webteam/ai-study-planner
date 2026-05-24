import { useState } from "react";

import "./QuizResult.css";

function QuizResult({

  generatedQuiz,

  setShowQuizResult,

}) {

  const questions =

    generatedQuiz

      .split("--------------------------------")

      .filter(
        (q) =>
          q.trim() !== ""
      );

  const [currentQuestion,
    setCurrentQuestion] =
    useState(0);

  return (

    <div className="quiz-result-page">

      <div className="quiz-result-container">

        <h1>
          AI Generated Quiz
        </h1>

        <div className="question-count">

          Question{" "}

          {

            questions.length > 0

            ?

            currentQuestion + 1

            :

            0

          }

          {" "}of{" "}

          {questions.length}

        </div>

        <div className="quiz-result-content">

          {

            questions.length > 0

            ?

            (

              <pre>

                {

                  questions[
                    currentQuestion
                  ]

                }

              </pre>

            )

            :

            (

              <h2>
                No Questions Generated
              </h2>

            )

          }

        </div>

        <div className="quiz-navigation">

          <button

            className="nav-btn"

            disabled={
              currentQuestion === 0
            }

            onClick={() =>

              setCurrentQuestion(

                currentQuestion - 1

              )

            }

          >

            ← Previous

          </button>

          <button

            className="nav-btn"

            disabled={

              currentQuestion ===

              questions.length - 1

            }

            onClick={() =>

              setCurrentQuestion(

                currentQuestion + 1

              )

            }

          >

            Next →

          </button>

        </div>

        <button

          className="quiz-back-btn"

          onClick={() =>

            setShowQuizResult(false)

          }

        >

          ← Back

        </button>

      </div>

    </div>

  );

}

export default QuizResult;