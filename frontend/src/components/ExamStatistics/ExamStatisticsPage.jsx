import { useNavigate, useParams } from "react-router-dom";
import { AllExamResults } from "./History/AllExamResults";
import { getAllSolutionsForExam } from "../../server/exam";
import { useEffect, useState } from "react";
import "./ExamStatisticsPage.css";
import { getMyClasses } from "../../server/class";

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
      const res = await getAllSolutionsForExam(examSlug, selectedClass);
      if (res) {
        setColData(res.col_info);
        setSolvesData(res.solves);
      } else {
        setSolvesData([]);
      }
    }
    fetchData();
  }, [examSlug, selectedClass]);

  useEffect(() => {
    async function fetchData() {
      const classes = await getMyClasses();

      if (classes) {
        setAllClasses(classes);
      }
    }
    fetchData();
  }, []);

  // if (!solvesData || !colData) {
  //   return <h2>Загрузка...</h2>;
  // }
  console.log(solvesData);
  return (
    <div className="exam-stats-cont">
      {/* <h2>{colData.name}</h2> */}
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
    </div>
  );
};
