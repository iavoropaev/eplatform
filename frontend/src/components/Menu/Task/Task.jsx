import TaskBody from "./components/TaskBody";
import TaskFooter from "./components/TaskFooter";
import TaskHeader from "./components/TaskHeader";
import "./Task.css";

const Task = ({ taskData }) => {
  console.log(taskData);
  return (
    <div className="task-container">
      <div className={"task "}>
        <TaskHeader taskData={taskData} />
        <TaskBody taskData={taskData} />
        <TaskFooter taskData={taskData} />
      </div>
    </div>
  );
};

export default Task;
