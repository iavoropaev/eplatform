import { useEffect, useState } from "react";
import { sendSectionSolution } from "../../../../server/course";
import Task from "../../../Task/Task";
import { useDispatch } from "react-redux";
import { clearExamAnswer } from "../../../../redux/slices/examSlice";
import { deleteSolveStatus } from "../../../../redux/slices/courseSlice";

import "./SectionTask.css";

const SectionTask = ({ taskData, sendSolution, solveFromServer }) => {
  const [skipServerAnswer, setSkipServerAnswer] = useState(false);
  const answer = skipServerAnswer ? null : solveFromServer?.answer;
  const dispatch = useDispatch();

  const handleCancelButton = () => {
    if (solveFromServer?.section) {
      dispatch(deleteSolveStatus(solveFromServer.section));
      setSkipServerAnswer(true);
    }
  };

  let tasksStatus = solveFromServer?.solve_status;
  if (solveFromServer?.solve_status === undefined) {
    tasksStatus = " ";
  }

  return (
    <div className="task-in-lesson">
      <Task
        key={taskData.id}
        taskData={taskData}
        taskAnswer={answer}
        handleSaveButton={sendSolution}
        handleCancelButton={handleCancelButton}
        status={tasksStatus}
        hideSolutionSection={true}
      />
    </div>
  );
};

export default SectionTask;
