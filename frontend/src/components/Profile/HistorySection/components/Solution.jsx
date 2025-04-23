import { useState } from "react";
import ExamSolutionTable from "../../../ExamResults/components/ExamSolutionTable";
import { formatDate } from "../../../Utils/dates";

export const Solution = ({ solution, handleDelete, hideDelete }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  return (
    <div className="solution" key={solution.id}>
      <div className="solution-header">
        <div className="score-name">
          <a
            className="score"
            href={`/variant/${solution.task_collection.slug}/results/id/${solution.id}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {solution.test_score ? solution.test_score : solution.score}
          </a>
          <a
            href={`/variant/${solution.task_collection.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {solution.task_collection.name}
          </a>
        </div>
        <div className="but-date">
          <button onClick={() => setShowAnswers(!showAnswers)}>
            Подробнее
          </button>
          {!hideDelete && <button onClick={handleDelete}>X</button>}

          <div>{formatDate(solution.time_create, "short")}</div>
        </div>
      </div>

      {showAnswers && (
        <div className="sol-answers">
          <ExamSolutionTable answers={solution.answers} />
        </div>
      )}
    </div>
  );
};
