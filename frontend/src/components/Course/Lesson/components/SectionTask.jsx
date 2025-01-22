import { useState } from "react";
import { sendSectionSolution } from "../../../../server/course";
import Task from "../../../Task/Task";

const SectionTask = ({ taskData, sendSolution, solveFromServer }) => {
  const [skipServerAnswer, setSkipServerAnswer] = useState(0);
  const answer = skipServerAnswer ? null : solveFromServer?.answer;

  const handleCancelButton = () => {
    setSkipServerAnswer(true);
  };

  return (
    <div className="lesson">
      <p>Задача</p>
      <Task
        taskData={taskData}
        taskAnswer={answer}
        handleSaveButton={sendSolution}
        handleCancelButton={handleCancelButton}
        status={solveFromServer?.solve_status === 1 ? "ok" : ""}
      />
    </div>
  );
};

export default SectionTask;
