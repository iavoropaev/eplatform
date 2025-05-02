import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setDescription,
  setExam,
  setName,
  setSubject,
  setTasks,
} from "../../redux/slices/createCollectionSlice";
import { useEffect, useState } from "react";
import { getTaskById } from "../../server/bank";

import {
  getCollectionBySlug,
  updateCollection,
} from "../../server/collections";
import "./CreateCollection.css";
import TasksList from "./components/TasksList";
import { showOK, showError } from "../Utils/Notifications";
import "./CreateCollection.css";

const UpdateCollection = () => {
  const { slug } = useParams();
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.createCollection.tasks);
  const colName = useSelector((state) => state.createCollection.name);
  const colDescription = useSelector(
    (state) => state.createCollection.description
  );
  const isExam = useSelector((state) => state.createCollection.isExam);
  const subjectName = useSelector(
    (state) => state.createCollection?.subject?.name
  );
  const examName = useSelector(
    (state) => state.createCollection?.subject?.exam?.name
  );

  const [newTaskId, setNewTaskId] = useState("");

  useEffect(() => {
    async function fetchData() {
      const collection = await getCollectionBySlug(slug);
      if (collection) {
        dispatch(setTasks(collection.tasks));
        dispatch(setName(collection.name));
        dispatch(setDescription(collection.description));
        dispatch(setExam(collection.is_exam));
        dispatch(setSubject(collection.subject));
      } else {
        setError(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [dispatch, slug]);

  const handleAddTaskByIdBut = async (position, taskId) => {
    let task = undefined;
    const taskIds = tasks.map((task) => task.id);

    if (position === "start" || position === "end") {
      const id = Number(newTaskId);
      if (id && !taskIds.includes(id)) {
        task = await getTaskById(id);
      } else if (taskIds.includes(id)) {
        showError("Эта задача уже есть в подборке.");
        return;
      }
    } else {
      if (taskId && !taskIds.includes(Number(taskId))) {
        task = await getTaskById(taskId);
      } else {
        if (taskIds.includes(Number(taskId))) {
          showError("Эта задача уже есть в подборке.");
          return;
        }
      }
    }
    if (task === undefined) {
      showError("Задача с таким ID не найдена.");
      return;
    }

    if (position === "start") {
      dispatch(setTasks([task, ...tasks]));
    } else if (position === "end") {
      dispatch(setTasks([...tasks, task]));
    } else {
      const newTasks = [...tasks];
      newTasks.splice(position, 1, task);
      dispatch(setTasks(newTasks));
    }
    showOK("Задача добавлена!");

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
      dispatch(setTasks(collection.tasks));
      dispatch(setName(collection.name));
      dispatch(setDescription(collection.description));
      dispatch(setExam(collection.is_exam));
      showOK("Сохранено!");
    } else {
      showError("Подборка не обновлена.");
    }
  };

  if (isLoading) {
    return <></>;
  }

  if (isError) {
    return <h2>Подборка не найдена.</h2>;
  }
  return (
    <div className="create-collection">
      <h2>Обновление подборки задач</h2>
      <div>{`Экзамен: ${examName}.`}</div>
      <div>{`Предмет: ${subjectName}.`}</div>
      <div>
        <span>Название подборки </span>
        <input
          className="collection-name"
          value={colName}
          onChange={(e) => {
            dispatch(setName(e.target.value));
          }}
        ></input>
      </div>
      <div className="discr">
        <span>Описание подборки </span>
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
        <span>Это полноценный вариант? </span>
        <input
          checked={isExam}
          onChange={(e) => {
            dispatch(setExam(e.target.checked));
          }}
          type="checkbox"
        ></input>
      </div>
      <div className="add-by-id">
        <span>Добавить задачу по ID </span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTaskByIdBut("start");
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

      <div>{`Всего задач ${tasks.length}.`}</div>
      <button onClick={saveCollection} className="black-button">
        Сохранить
      </button>

      <TasksList
        tasks={tasks}
        swap={swap}
        delTaskByIndex={delTaskByIndex}
        handleAddTaskByIdBut={handleAddTaskByIdBut}
      />

      {tasks.length > 0 && (
        <div className="add-by-id">
          <span>Добавить задачу по ID </span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTaskByIdBut("end");
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
      )}
      {tasks.length > 0 && (
        <button onClick={saveCollection} className="black-button">
          Сохранить
        </button>
      )}
    </div>
  );
};

export default UpdateCollection;
