import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Task from "../../../Task/Task";
import { getMyTasks } from "../../../../server/bank";
import "./Materials.css";
const TeacherTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [countAllTasks, setCountAllTasks] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const res = await getMyTasks();
      if (res) {
        setTasks(res.tasks);
        setCountAllTasks(res.count);
      }
    }
    fetchData();
  }, []);
  const goToLk = () => {
    navigate("./../");
  };
  return (
    <div className="teacher-materials">
      <h2> Мои задачи</h2>
      {countAllTasks && <p>{`Количество: ${countAllTasks}.`}</p>}
      <button onClick={goToLk} className="return-but">
        В личный кабинет
      </button>

      <div>
        {tasks.map((task) => (
          <Task
            key={task.id}
            taskData={task}
            hideAnswerBlock={true}
            showEditIcon={true}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherTasks;
