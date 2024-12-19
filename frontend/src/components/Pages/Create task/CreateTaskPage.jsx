import { useNavigate, useParams } from "react-router-dom";
import "./CreateTaskPage.css";
import CreateTask from "../../CreateTask/CreateTask";

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const afterSave = (taskId) => {
    navigate(`../edit-task/${Number(taskId)}/`);
  };

  const goToPrevTask = () => {
    navigate(`../edit-task/${Number(taskId) - 1}/`);
  };
  const goToNextTask = () => {
    navigate(`../edit-task/${Number(taskId) + 1}/`);
  };

  return (
    <>
      <CreateTask taskId={taskId} afterSave={afterSave} />
      <div className="container">
        {taskId && (
          <div>
            <button onClick={goToPrevTask}>Предыдущая</button>
            <button onClick={goToNextTask}>Следующая</button>
          </div>
        )}
      </div>
    </>
  );
};
export default CreateTaskPage;
