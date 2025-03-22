import { useEffect, useState } from "react";
import { deleteSolution, getMyExamsSolutions } from "../../../server/exam";
import { Solution } from "./components/Solution";
import "./HistorySection.css";
import { showError } from "../../Utils/Notifications";

const HistorySection = () => {
  const [examSolutions, setExamSolutions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const solutions = await getMyExamsSolutions();
      if (solutions) {
        setExamSolutions(solutions);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Удалить это решение?")) {
      const res = await deleteSolution({ solution_id: id });
      if (res) {
        const newSolutions = examSolutions.filter((sol) => sol.id !== id);
        setExamSolutions(newSolutions);
      } else {
        showError("Ошибка.");
      }
    }
  };

  return (
    <div className="exam-solutions-section">
      <h2>Решённые варианты</h2>
      <div className="exam-solutions">
        {examSolutions.map((sol) => {
          return (
            <Solution
              key={sol.id}
              solution={sol}
              handleDelete={() => {
                handleDelete(sol.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HistorySection;
