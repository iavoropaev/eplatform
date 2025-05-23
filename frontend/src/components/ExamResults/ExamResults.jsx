import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExamSolution } from "../../server/exam";
import ExamSolutionTable from "./components/ExamSolutionTable";
import "./ExamResults.css";
import { showError } from "../Utils/Notifications";
import { formatDate, getStrTime, getWordForm } from "../Utils/dates";

const ExamResults = () => {
  const { slug, solveType, attemptId } = useParams();
  const navigate = useNavigate();

  const [attId, setAttId] = useState("");
  const [colName, setColName] = useState("");
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(undefined);
  const [maxScore, setMaxScore] = useState(undefined);
  const [testScore, setTestScore] = useState(undefined);
  const [duration, setDuration] = useState(0);
  const [solData, setSolData] = useState("");
  const [examName, setExamName] = useState("");
  const [achievements, setAchievements] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const realSolveType = solveType ? solveType : "last";
      const solve = await getExamSolution(slug, realSolveType, attemptId);
      if (solve) {
        setAttId(solve.id);
        setColName(solve.task_collection.name);
        setExamName(solve.exam);
        setAnswers(solve.answers);
        setScore(solve.score);
        setMaxScore(solve.max_score);
        setTestScore(solve.test_score);
        setDuration(solve.duration);
        setSolData(solve.time_create);
        setAchievements(solve.achievements);
      } else {
        showError("Ошибка загрузки.");
      }
      setLoading(false);
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

  const getColorByScore = (score) => {
    if (examName === "ОГЭ") {
      if (score === 2) {
        return "#ff7f7f";
      }
      if (score === 3) {
        return "#ffa500";
      }
      if (score === 4) {
        return "#fffea8";
      }
      if (score === 5) {
        return "#9ced99";
      }

      return "";
    }
    if (score === 100) {
      return "#FFD700";
    }
    const hue = (score / 100) * 120;
    return `hsl(${hue}, 100%, 50%)`;
  };

  if (isLoading) {
    return (
      <div className="exam-results">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="exam-results">
      <h2>{colName}</h2>
      <div className="score-time-cont">
        {testScore !== undefined && testScore !== null && (
          <p
            className={"test-score " + (testScore === 100 ? " score-100" : "")}
            title="Тестовый балл"
            style={{
              backgroundColor: getColorByScore(testScore),
            }}
          >
            {`${testScore} ${getWordForm(testScore, [
              "балл",
              "балла",
              "баллов",
            ])}`}
          </p>
        )}
        <p className="time">{getStrTime(duration)}</p>
      </div>
      <div className="score">
        <p>
          Баллов набрано {score}/{maxScore}.
        </p>
        <p className="grey">{formatDate(solData)}</p>
      </div>

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
      <div className="results-table-cont">
        <ExamSolutionTable answers={answers} />
      </div>

      <div className="buttons">
        <button
          onClick={() => {
            navigate(`/variant/${slug}/attempt/${attId}/`);
          }}
        >
          Вернуться к варианту
        </button>
        <button
          onClick={() => {
            window.open(`/variant/${slug}/all-results/stats/`, "_blank");
          }}
        >
          Статистика варианта
        </button>
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
