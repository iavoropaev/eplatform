import "./Bank.css";

import Task from "../../Menu/Task/Task";
import { useEffect, useState } from "react";
import { getAllTasksFromServer, getFilterData } from "../../../server/bank";

import BankFilter from "./components/BankFilter";

const Bank = () => {
  const [filterData, setFilterData] = useState([
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
  ]);
  const [tasks, setTasks] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    exam: 0,
    subject: 0,
    source: 0,
    numbers: [],
    authors: [],
  });

  const exam = filterData[selectedFilters["exam"]];
  const subject = exam["subjects"][selectedFilters["subject"]];
  const source = subject["sources"][selectedFilters["source"]];
  const numbers = selectedFilters["numbers"].map((i) => {
    return subject["numbers"][i]["id"];
  });
  const authors = selectedFilters["authors"].map((i) => {
    return subject["authors"][i]["id"];
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

  // useEffect(() => {
  //   console.log("DOWNLOAD", selectedFilters);
  //   async function fetchData() {
  //     const tasksFromServer = await getAllTasksFromServer(numbers);
  //     setTasks(tasksFromServer["tasks"]);
  //   }
  //   fetchData();
  // }, [selectedFilters]);

  useEffect(() => {
    async function fetchData() {
      const data = await getFilterData();
      setFilterData(data);
    }
    fetchData();
  }, []);

  const handleFindButtonClick = async () => {
    const tasksFromServer = await getAllTasksFromServer({
      numbers,
      authors,
      subject: subject.id,
    });
    setTasks(tasksFromServer["tasks"]);
  };

  return (
    <div>
      <BankFilter
        selectedFilters={selectedFilters}
        getSelectFromFilter={getSelectFromFilter}
        filterData={filterData}
        handleFindButtonClick={handleFindButtonClick}
      />
      <div className="tasks">
        {tasks.map((task) => {
          return <Task taskData={task} key={task.id} />;
        })}
      </div>
    </div>
  );
};

export default Bank;
