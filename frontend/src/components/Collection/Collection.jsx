import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCollectionBySlug } from "../../server/collections";
import Task from "../Task/Task";
import { getSolveStatuses, sendSolution } from "../../server/bank";

const Collection = () => {
  const jwt = localStorage.getItem("jwt_a");

  const { slug } = useParams();
  const [isError, setError] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [colName, setColName] = useState("");

  const [solvedStatuses, setSolvedStatuses] = useState({});
  const countOk = Object.values(solvedStatuses).filter(
    (value) => value === "ok"
  ).length;

  useEffect(() => {
    async function fetchData() {
      const collection = await getCollectionBySlug(slug);
      if (collection) {
        if (jwt) {
          const taskIds = collection["tasks"].map((task) => task.id);
          const idSolvedStatuses = await getSolveStatuses({ taskIds: taskIds });
          setSolvedStatuses(idSolvedStatuses);
        }
        setTasks(collection.tasks);
        setColName(collection.name);
      } else {
        setError(true);
      }
    }
    fetchData();
  }, [slug, jwt]);

  const sendAnswerToServer = async ({ taskId, answer, type }) => {
    const readyAnswer = { type: type, [type]: answer };
    const res = await sendSolution({ taskId, answer: readyAnswer });
    setSolvedStatuses({ ...solvedStatuses, [taskId]: res.status });
  };
  if (isError) {
    return <h2>Такой подборки не существует.</h2>;
  }
  return (
    <>
      <h1>{colName}</h1>
      <p>
        Решено {countOk}/{tasks.length}.
      </p>
      {tasks.map((task) => {
        return (
          <Task
            taskData={task}
            key={task.id}
            sendAnswerToServer={sendAnswerToServer}
            status={solvedStatuses[task.id]}
          />
        );
      })}
    </>
  );
};

export default Collection;