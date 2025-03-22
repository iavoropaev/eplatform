import { useEffect, useState } from "react";

import {
  getAllTasksFromServer,
  getFilterData,
  getSolveStatuses,
  sendSolution,
} from "../../server/bank";
import BankFilter from "./components/BankFilter";
import Task from "../Task/Task";
import "./Bank.css";
import { showError } from "../Utils/Notifications";

const Bank = () => {
  const jwt = localStorage.getItem("jwt_a");

  const [filterData, setFilterData] = useState({
    exams: [
      {
        name: "Загрузка",
        subjects: [
          {
            name: "Загрузка",
            sources: [
              {
                name: "Загрузка",
                numbers: [],
              },
            ],
          },
        ],
      },
    ],
    actualities: [],
  });
  const [tasks, setTasks] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    exam: 0,
    subject: 0,
    source: 0,
    numbers: [],
    authors: [],
    dif_levels: [],
    actualities: [],
  });
  const [solvedStatuses, setSolvedStatuses] = useState({});
  const [isFind, setFind] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const exam = filterData["exams"][selectedFilters["exam"]];
  const subject = exam["subjects"][selectedFilters["subject"]];
  const source = subject["sources"][selectedFilters["source"]];
  const numbers = selectedFilters["numbers"].map((i) => {
    return subject["numbers"][i]["id"];
  });
  const authors = selectedFilters["authors"].map((i) => {
    return subject["authors"][i]["id"];
  });
  const dif_levels = selectedFilters["dif_levels"].map((i) => {
    return exam["dif_levels"][i]["id"];
  });
  const actualities = selectedFilters["actualities"].map((i) => {
    return filterData["actualities"][i]["id"];
  });

  const getSelectFromFilter = (type, value) => {
    const newData = { ...selectedFilters };
    newData[type] = value;

    if (type === "exam") {
      newData["subject"] = 0;
      newData["source"] = 0;
      newData["numbers"] = [];
    }

    if (type === "subject") {
      newData["source"] = 0;
      newData["numbers"] = [];
    }

    if (type === "source") {
      newData["numbers"] = [];
    }

    setSelectedFilters(newData);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getFilterData();
      if (data) {
        setFilterData(data);
      } else {
        setError(true);
      }
    }
    fetchData();
  }, []);

  const handleFindButtonClick = async () => {
    setLoading(true);
    setTasks([]);
    const tasksFromServer = await getAllTasksFromServer({
      numbers,
      authors,
      subject: subject.id,
      bankAuthors: [source?.id],
      dif_levels,
      actualities,
    });

    if (tasksFromServer !== undefined) {
      if (jwt) {
        const taskIds = tasksFromServer["tasks"].map((task) => task.id);
        const idSolvedStatuses = await getSolveStatuses({ taskIds: taskIds });
        if (idSolvedStatuses) {
          setSolvedStatuses(idSolvedStatuses);
        } else {
          showError("Ваши решения не удалось загрузить.");
        }
      }
      setTasks(tasksFromServer["tasks"]);
      setLoading(false);
      setFind(true);
    } else {
      setLoading(false);
      setFind(false);
      setTasks([]);
      showError("Не удалось найти задачи.");
    }
  };

  const sendAnswerToServer = async ({ taskId, answer, type }) => {
    const readyAnswer = { type: type, [type]: answer };
    const res = await sendSolution({ taskId, answer: readyAnswer });
    if (res !== undefined) {
      setSolvedStatuses({ ...solvedStatuses, [taskId]: res.status });
    } else {
      showError("Не удалось обработать Ваше решение.");
    }
  };

  if (isError) {
    return <h3>Произошла ошибка. Попробуйте позже.</h3>;
  }

  return (
    <div className="bank">
      <BankFilter
        selectedFilters={selectedFilters}
        getSelectFromFilter={getSelectFromFilter}
        filterData={filterData}
        countFind={isFind ? tasks.length : undefined}
        handleFindButtonClick={handleFindButtonClick}
        isLoading={isLoading}
      />

      <div className="tasks">
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
      </div>
    </div>
  );
};

export default Bank;
