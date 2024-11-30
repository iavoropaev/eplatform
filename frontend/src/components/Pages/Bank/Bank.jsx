import "./Bank.css";

import Task from "../../Menu/Task/Task";
import { useEffect, useState } from "react";
import { getAllTasksFromServer } from "../../../server/bank";
import { bankTasks } from "../../../server/data";
import BankFilter from "./components/BankFilter";
import { FILTERDATA } from "./components/bankFilterData";

const Bank = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    exam: 0,
    subject: 0,
    source: 0,
    numbers: [],
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
    console.log("DOWNLOAD", selectedFilters);
    async function fetchData() {
      //const tasksFromServer = await getAllTasksFromServer();
      const tasksFromServer = bankTasks;
      setTasks(tasksFromServer);
    }
    fetchData();
  }, [selectedFilters]);

  return (
    <div>
      <BankFilter
        selectedFilters={selectedFilters}
        getSelectFromFilter={getSelectFromFilter}
        filterData={FILTERDATA}
      />
      <div className="tasks">
        {tasks.map((task, i) => {
          return <Task taskData={task} key={task.id} />;
        })}
      </div>
    </div>
  );
};

export default Bank;
