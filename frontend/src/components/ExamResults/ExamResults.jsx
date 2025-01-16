import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getExamSolution } from "../../server/exam";
import ExamSolutionTable from "./components/ExamSolutionTable";

const ExamResults = () => {
  const { slug, solveType } = useParams();
  console.log(solveType);
  //const [solveType, setSolveType] = useState("last");

  const [colName, setColName] = useState("");
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [duration, setDuration] = useState(0);
  const [solData, setSolData] = useState("");

  useEffect(() => {
    async function fetchData() {
      const realSolveType = solveType ? solveType : "last";
      const solve = await getExamSolution(slug, realSolveType);
      if (solve) {
        setColName(solve.task_collection.name);
        setAnswers(solve.answers);
        setScore(solve.score);
        setDuration(solve.duration);
        setSolData(solve.time_create);
      }
    }
    fetchData();
  }, [slug, solveType]);

  return (
    <>
      <p>Результаты экзамена</p>
      <h2>{colName}</h2>
      <p>Баллы {score}</p>
      <p>Времени потрачено {duration}</p>
      <ExamSolutionTable answers={answers} />
    </>
  );
};

export default ExamResults;
