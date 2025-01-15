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
}) => {
  return (
    <div className="task-container">
      <div className={"task "}>
        <TaskHeader taskData={taskData} />
        <TaskBody taskData={taskData} />
        <TaskFooter
          taskData={taskData}
          taskAnswer={taskAnswer}
          handleSaveButton={handleSaveButton}
          showCancelBut={showCancelBut}
          handleCancelButton={handleCancelButton}
          hideAnswerBlock={hideAnswerBlock}
        />
        <p>{status}</p>
      </div>
    </div>
  );
};

export default Task;
