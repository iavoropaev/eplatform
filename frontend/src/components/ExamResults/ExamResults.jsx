import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExamSolution } from "../../server/exam";
import ExamSolutionTable from "./components/ExamSolutionTable";
import "./ExamResults.css";
import { showError } from "../Utils/Notifications";

const ExamResults = () => {
  const { slug, solveType } = useParams();
  const navigate = useNavigate();
  console.log(solveType);
  //const [solveType, setSolveType] = useState("last");

  const [colName, setColName] = useState("");
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(undefined);
  const [testScore, setTestScore] = useState(undefined);
  const [duration, setDuration] = useState(0);
  const [solData, setSolData] = useState("");

  useEffect(() => {
    async function fetchData() {
      const realSolveType = solveType ? solveType : "last";
      const solve = await getExamSolution(slug, realSolveType);
      if (solve) {
        console.log(solve);
        setColName(solve.task_collection.name);
        setAnswers(solve.answers);
        setScore(solve.score);
        setTestScore(solve.test_score);
        setDuration(solve.duration);
        setSolData(solve.time_create);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, [slug, solveType]);

  const handleResTypeChange = (event) => {
    if (solveType !== undefined) {
      navigate(`./../${event.target.value}/`);
    } else {
      navigate(`./${event.target.value}/`);
    }
  };

  return (
    <div className="exam-results">
      <h2>{colName}</h2>
      <div>
        <select value={solveType} onChange={handleResTypeChange}>
          <option value="last">Последний результат</option>
          <option value="first">Первый результат</option>
          <option value="best">Лучший результат</option>
        </select>
      </div>
      <p>Баллы {score}</p>
      {testScore && <p>Тестовый балл {testScore}</p>}
      <p>Времени потрачено {duration}</p>
      <div className="results-table-cont">
        <ExamSolutionTable answers={answers} />
      </div>
    </div>
  );
};

export default ExamResults;
