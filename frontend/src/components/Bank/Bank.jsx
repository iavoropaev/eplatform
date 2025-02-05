import "./Bank.css";

import Task from "../Task/Task";
import { useEffect, useState } from "react";
import {
  createTaskOnServer,
  getAllTasksFromServer,
  getFilterData,
  getSolveStatuses,
  sendSolution,
} from "../../server/bank";

import BankFilter from "./components/BankFilter";

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
      setFilterData(data);
    }
    fetchData();
  }, []);

  const handleFindButtonClick = async () => {
    setFind(true);
    const tasksFromServer = await getAllTasksFromServer({
      numbers,
      authors,
      subject: subject.id,
      bankAuthors: [source?.id],
      dif_levels,
      actualities,
    });

    if (jwt) {
      const taskIds = tasksFromServer["tasks"].map((task) => task.id);
      const idSolvedStatuses = await getSolveStatuses({ taskIds: taskIds });
      setSolvedStatuses(idSolvedStatuses);
    }
    setTasks(tasksFromServer["tasks"]);
  };

  const sendAnswerToServer = async ({ taskId, answer, type }) => {
    const readyAnswer = { type: type, [type]: answer };
    const res = await sendSolution({ taskId, answer: readyAnswer });
    console.log(res);
    setSolvedStatuses({ ...solvedStatuses, [taskId]: res.status });
  };
  return (
    <div className="bank">
      <BankFilter
        selectedFilters={selectedFilters}
        getSelectFromFilter={getSelectFromFilter}
        filterData={filterData}
        countFind={isFind ? tasks.length : undefined}
        handleFindButtonClick={handleFindButtonClick}
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
