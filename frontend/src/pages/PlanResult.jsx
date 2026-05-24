import "./PlanResult.css";

function PlanResult({ generatedPlan, setShowPlan }) {

  return (

    <div className="plan-page">

      <div className="plan-container">

        <div className="plan-header">

          <h1>AI Smart Study Plan</h1>

          <p>
            Personalized AI generated study roadmap
          </p>

        </div>

        <div className="plan-content">

          {generatedPlan
            .split("\n")
            .map((line, index) => {

              const isDate =
                line.includes("DATE");

              const isSection =
                line.includes("Morning") ||
                line.includes("Afternoon") ||
                line.includes("Evening") ||
                line.includes("Night");

              return (

                <p
                  key={index}
                  className={
                    isDate
                      ? "date-line"
                      : isSection
                      ? "section-line"
                      : ""
                  }
                >
                  {line}
                </p>

              );

            })}

        </div>

        <button
          className="close-btn"
          onClick={() => setShowPlan(false)}
        >
          ← Back To Planner
        </button>

      </div>

    </div>

  );
}

export default PlanResult;