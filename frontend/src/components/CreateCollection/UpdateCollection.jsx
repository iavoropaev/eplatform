import slugify from "slugify";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setDescription,
  setName,
  setSlug,
  setTasks,
} from "../../redux/slices/createCollectionSlice";
import { useEffect, useState } from "react";
import { getTaskById } from "../../server/bank";
import Task from "../Task/Task";
import "./CreateCollection.css";
import {
  getCollectionBySlug,
  updateCollection,
} from "../../server/collections";

const UpdateCollection = () => {
  const { slug } = useParams();
  const [isError, setError] = useState(false);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.createCollection.tasks);
  const colName = useSelector((state) => state.createCollection.name);
  const colDescription = useSelector(
    (state) => state.createCollection.description
  );
  const colSlug = useSelector((state) => state.createCollection.slug);

  const [newTaskId, setNewTaskId] = useState("");

  useEffect(() => {
    async function fetchData() {
      const collection = await getCollectionBySlug(slug);
      if (collection) {
        dispatch(setTasks(collection.tasks));
        dispatch(setName(collection.name));
        dispatch(setDescription(collection.description));
      } else {
        setError(true);
      }
    }
    fetchData();
  }, [slug, dispatch]);

  const handleAddTaskByIdBut = async () => {
    const id = Number(newTaskId);
    const taskIds = tasks.map((task) => task.id);
    if (id && !taskIds.includes(id)) {
      const task = await getTaskById(id);
      if (task !== undefined) {
        dispatch(setTasks([...tasks, task]));
      }
    }
    setNewTaskId("");
  };

  const swap = (i, j) => {
    if (i >= 0 && j >= 0 && i < tasks.length && j < tasks.length) {
      const newTasks = [...tasks];
      const temp = newTasks[i];
      newTasks[i] = newTasks[j];
      newTasks[j] = temp;
      dispatch(setTasks(newTasks));
    }
  };

  const saveCollection = async () => {
    const tasksForServer = tasks.map((task) => {
      return { id: task.id, info: {} };
    });

    const collection = await updateCollection({
      slug,
      name: colName,
      description: colDescription,
      tasks: tasksForServer,
    });

    if (collection) {
      dispatch(setTasks(collection.tasks));
      dispatch(setName(collection.name));
      dispatch(setDescription(collection.description));
    } else {
      setError(true);
    }
  };

  if (isError) {
    return <h2>Подборка не найдена.</h2>;
  }
  return (
    <div className="create-collection">
      <div>{tasks.length}</div>
      <div>
        {"Название коллекции"}
        <input
          value={colName}
          onChange={(e) => {
            dispatch(setName(e.target.value));
          }}
        ></input>
      </div>
      <div>
        {"Описание коллекции"}
        <textarea
          wrap="hard"
          rows="5"
          cols="50"
          value={colDescription}
          onChange={(e) => {
            dispatch(setDescription(e.target.value));
          }}
        ></textarea>
        <pre>{colDescription}</pre>
      </div>

      {tasks.map((task, i) => {
        return (
          <div className="cc-task" key={task.id}>
            <div>
              <span
                onClick={() => {
                  swap(i, i - 1);
                }}
              >
                Up
              </span>
              <span
                onClick={() => {
                  swap(i, i + 1);
                }}
              >
                Down
              </span>
            </div>
            <Task
              key={task.id}
              taskData={task}
              sendAnswerToServer={() => {}}
              status=""
            />
          </div>
        );
      })}
      <div>
        {"Добавить задачу по ID"}
        <input
          value={newTaskId}
          onChange={(e) => {
            setNewTaskId(e.target.value);
          }}
        ></input>
        <button onClick={handleAddTaskByIdBut}>Кнопка</button>
      </div>
      <button onClick={saveCollection}>Сохранить</button>
    </div>
  );
};

export default UpdateCollection;
