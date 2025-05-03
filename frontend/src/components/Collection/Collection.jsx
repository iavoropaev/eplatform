import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCollectionBySlug } from "../../server/collections";
import Task from "../Task/Task";
import { getSolveStatuses, sendSolution } from "../../server/bank";
import { showError } from "../Utils/Notifications";
import "./Collection.css";

const Collection = () => {
  const jwt = localStorage.getItem("jwt_a");
  const navigate = useNavigate();

  const { slug } = useParams();
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [colName, setColName] = useState("");

  const [solvedStatuses, setSolvedStatuses] = useState({});
  const countOk = Object.values(solvedStatuses).filter(
    (value) => value === "OK"
  ).length;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const collection = await getCollectionBySlug(slug);
      if (collection) {
        if (jwt) {
          const taskIds = collection["tasks"].map((task) => task.id);
          const idSolvedStatuses = await getSolveStatuses({ taskIds: taskIds });
          if (idSolvedStatuses) {
            setSolvedStatuses(idSolvedStatuses);
          } else {
            showError("Ваши решения не загружены.");
          }
        }
        setTasks(collection.tasks);
        setColName(collection.name);
        setDescription(collection.description);
      } else {
        showError("Подборка не найдена.");
        setError(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug, jwt]);

  const sendAnswerToServer = async ({ taskId, answer, type }) => {
    setSolvedStatuses({ ...solvedStatuses, [taskId]: "checking" });
    const readyAnswer = { type: type, [type]: answer };
    const res = await sendSolution({ taskId, answer: readyAnswer });
    if (res !== undefined) {
      setSolvedStatuses({ ...solvedStatuses, [taskId]: res.status });
    } else {
      showError("Решение не отправлено.");
    }
  };

  if (isError) {
    return <h2>Такой подборки не существует.</h2>;
  }
  if (isLoading) {
    return <p className="loading">Загрузка...</p>;
  }

  const goToExam = (
    <div className="play-container">
      <button
        onClick={() => {
          navigate(`./../../variant/${slug}/`);
          window.scrollTo(0, 0);
        }}
        className="play black-button"
      >
        Решать в формате варианта
      </button>
    </div>
  );

  return (
    <div className="collection-container">
      <h2>{colName}</h2>

      <p className="count-answers">
        Решено {countOk}/{tasks.length}.
      </p>
      {goToExam}
      {description && description.length > 10 && (
        <div className="description">{description}</div>
      )}

      {tasks.map((task) => {
        return (
          <Task
            taskData={task}
            key={task.id}
            handleSaveButton={sendAnswerToServer}
            status={solvedStatuses[task.id]}
          />
        );
      })}
      {goToExam}
    </div>
  );
};

export default Collection;
