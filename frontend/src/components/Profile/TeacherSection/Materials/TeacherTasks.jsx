import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Task from "../../../Task/Task";
import { getMyTasks } from "../../../../server/bank";

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
    <div className="">
      <h2> Мои задачи</h2>
      <button onClick={goToLk}>В личный кабинет</button>
      {countAllTasks && <p>{`Количество ${countAllTasks}`}</p>}
      {tasks.map((task) => (
        <Task
          key={task.id}
          taskData={task}
          hideAnswerBlock={true}
          showEditIcon={true}
        />
      ))}
    </div>
  );
};

export default TeacherTasks;
