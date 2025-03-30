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
  hideAnswerBlock,
  showEditIcon,
  hideSolutionSection,
}) => {
  return (
    <div className="task-container">
      <div className={"task " + status}>
        <TaskHeader taskData={taskData} showEditIcon={showEditIcon} />
        <TaskBody taskData={taskData} />
        <TaskFooter
          taskData={taskData}
          taskAnswer={taskAnswer}
          handleSaveButton={handleSaveButton}
          showCancelBut={showCancelBut}
          handleCancelButton={handleCancelButton}
          hideAnswerBlock={hideAnswerBlock}
          hideSolutionSection={hideSolutionSection}
          status={status}
        />
      </div>
    </div>
  );
};

export default Task;
