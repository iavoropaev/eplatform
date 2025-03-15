import slugify from "slugify";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setDescription,
  setExam,
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
import "./CreateCollection.css";
import TasksList from "./components/TasksList";

const UpdateCollection = () => {
  const { slug } = useParams();
  const [isError, setError] = useState(false);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.createCollection.tasks);
  const colName = useSelector((state) => state.createCollection.name);
  const colDescription = useSelector(
    (state) => state.createCollection.description
  );
  const isExam = useSelector((state) => state.createCollection.isExam);

  const colSlug = useSelector((state) => state.createCollection.slug);

  const [newTaskId, setNewTaskId] = useState("");

  useEffect(() => {
    async function fetchData() {
      const collection = await getCollectionBySlug(slug);
      if (collection) {
        console.log(collection);
        dispatch(setTasks(collection.tasks));
        dispatch(setName(collection.name));
        dispatch(setDescription(collection.description));
        dispatch(setExam(collection.is_exam));
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

  const delTaskByIndex = (i) => {
    if (i >= 0 && i < tasks.length) {
      const newTasks = [...tasks];
      newTasks.splice(i, 1);
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
      is_exam: isExam,
    });

    if (collection) {
      console.log(collection);
      dispatch(setTasks(collection.tasks));
      dispatch(setName(collection.name));
      dispatch(setDescription(collection.description));
      dispatch(setExam(collection.is_exam));
    } else {
      setError(true);
    }
  };

  const addTaskById = (
    <div className="add-by-id">
      <span>Добавить задачу по ID </span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTaskByIdBut();
        }}
      >
        <input
          value={newTaskId}
          onChange={(e) => {
            setNewTaskId(e.target.value);
          }}
        ></input>
        <button type="submit">Добавить</button>
      </form>
    </div>
  );

  if (isError) {
    return <h2>Подборка не найдена.</h2>;
  }
  return (
    <div className="create-collection">
      <div>
        <span>Название коллекции </span>
        <input
          value={colName}
          onChange={(e) => {
            dispatch(setName(e.target.value));
          }}
        ></input>
      </div>
      <div className="discr">
        <span>Описание коллекции </span>
        <textarea
          wrap="hard"
          rows="5"
          cols="50"
          value={colDescription}
          onChange={(e) => {
            dispatch(setDescription(e.target.value));
          }}
        ></textarea>
      </div>
      <div>
        <span>Это вариант? </span>
        <input
          checked={isExam}
          onChange={(e) => {
            dispatch(setExam(e.target.checked));
          }}
          type="checkbox"
        ></input>
      </div>
      {addTaskById}

      <div>{`Всего задач ${tasks.length}.`}</div>
      <button onClick={saveCollection} className="black-button">
        Сохранить
      </button>

      <TasksList tasks={tasks} swap={swap} delTaskByIndex={delTaskByIndex} />

      {tasks.length > 0 && addTaskById}
      {tasks.length > 0 && (
        <button onClick={saveCollection} className="black-button">
          Сохранить
        </button>
      )}
    </div>
  );
};

export default UpdateCollection;
