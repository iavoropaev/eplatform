import TaskBody from "./components/TaskBody";
import TaskFooter from "./components/TaskFooter";
import TaskHeader from "./components/TaskHeader";
import "./Task.css";

const Task = ({ taskData, sendAnswerToServer, status }) => {
  return (
    <div className="task-container">
      <div className={"task "}>
        <TaskHeader taskData={taskData} />
        <TaskBody taskData={taskData} />
        <TaskFooter
          taskData={taskData}
          sendAnswerToServer={sendAnswerToServer}
        />
        <p>{status}</p>
      </div>
    </div>
  );
};

export default Task;
