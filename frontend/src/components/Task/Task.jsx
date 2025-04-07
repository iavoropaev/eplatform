import TaskBody from "./components/TaskBody";
import TaskFooter from "./components/TaskFooter";
import TaskHeader from "./components/TaskHeader";
import "./Task.css";

const Task = ({
  taskData,
  taskAnswer,
  handleSaveButton,
  status,
  showCancelBut,
  handleCancelButton,
  handleChooseScore,
  hideAnswerBlock,
  showEditIcon,
  hideSolutionSection,
  hideTaskInfo,
  buttonText,
}) => {
  return (
    <div className="task-container">
      <div className={"task " + status}>
        <TaskHeader
          taskData={taskData}
          showEditIcon={showEditIcon}
          hideTaskInfo={hideTaskInfo}
        />
        <TaskBody taskData={taskData} />
        <TaskFooter
          taskData={taskData}
          taskAnswer={taskAnswer}
          handleSaveButton={handleSaveButton}
          showCancelBut={showCancelBut}
          handleCancelButton={handleCancelButton}
          handleChooseScore={handleChooseScore}
          hideAnswerBlock={hideAnswerBlock}
          hideSolutionSection={hideSolutionSection}
          status={status}
          buttonText={buttonText}
        />
      </div>
    </div>
  );
};

export default Task;
