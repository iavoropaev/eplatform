import { useNavigate, useParams } from "react-router-dom";
import { AllExamResults } from "./History/AllExamResults";
import { getAllSolutionsForExam, getStatsForExam } from "../../server/exam";
import { useEffect, useState } from "react";
import "./ExamStatisticsPage.css";
import { getMyClasses } from "../../server/class";
import { ExamStatistics } from "./Stats/ExamStatistics";
import { showError } from "../Utils/Notifications";

export const ExamStatisticsPage = () => {
  const navigate = useNavigate();
  const { examSlug, eSection } = useParams();

  const [colData, setColData] = useState(undefined);
  const [solvesData, setSolvesData] = useState([]);

  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("-");

  const [statsData, setStatsData] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const solves = await getAllSolutionsForExam(examSlug, selectedClass);
      const stats = await getStatsForExam(examSlug, selectedClass);
      if (solves && stats) {
        setColData(solves.col_info);
        setSolvesData(solves.solves);
        setStatsData(stats);
      } else {
        setSolvesData([]);
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, [examSlug, selectedClass]);

  useEffect(() => {
    async function fetchData() {
      const classes = await getMyClasses();

      if (classes) {
        setAllClasses(classes);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, []);

  return (
    <div className="exam-stats-cont">
      <div className="es-navigate">
        <div
          className={"element" + (eSection === "history" ? " active" : "")}
          onClick={() => navigate(`/variant/${examSlug}/all-results/history/`)}
        >
          Все результаты
        </div>
        <div
          className={"element" + (eSection === "stats" ? " active" : "")}
          onClick={() => navigate(`/variant/${examSlug}/all-results/stats/`)}
        >
          Статистика
        </div>
      </div>
      {eSection === "history" && (
        <AllExamResults
          solvesData={solvesData}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          allClasses={allClasses}
        />
      )}
      {eSection === "stats" && <ExamStatistics statsData={statsData} />}
    </div>
  );
};
