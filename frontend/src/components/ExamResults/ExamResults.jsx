import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExamSolution } from "../../server/exam";
import ExamSolutionTable from "./components/ExamSolutionTable";
import "./ExamResults.css";
import { showError } from "../Utils/Notifications";

const ExamResults = () => {
  const { slug, solveType, attemptId } = useParams();
  const navigate = useNavigate();
  console.log(solveType);
  //const [solveType, setSolveType] = useState("last");

  const [colName, setColName] = useState("");
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(undefined);
  const [testScore, setTestScore] = useState(undefined);
  const [duration, setDuration] = useState(0);
  const [solData, setSolData] = useState("");
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const realSolveType = solveType ? solveType : "last";
      const solve = await getExamSolution(slug, realSolveType, attemptId);
      if (solve) {
        console.log(solve);
        setColName(solve.task_collection.name);
        setAnswers(solve.answers);
        setScore(solve.score);
        setTestScore(solve.test_score);
        setDuration(solve.duration);
        setSolData(solve.time_create);
        setAchievements(solve.achievements);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, [slug, solveType, attemptId]);

  const handleResTypeChange = (event) => {
    if (solveType === "id") {
      navigate(`./../../${event.target.value}/`);
    } else if (solveType !== undefined) {
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
          <option disabled value="id">
            Выбрать результат
          </option>
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
      {achievements.length > 0 && (
        <>
          <h3>Полученные достижения</h3>
          <div className="achievements">
            {achievements.map((ach) => {
              return (
                <div key={ach.id} className="ach-item" title={ach.description}>
                  <div>{ach.name}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamResults;
