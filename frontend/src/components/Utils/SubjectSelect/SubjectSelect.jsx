import { useNavigate, useParams } from "react-router-dom";
import "./SubjectSelect.css";
import { useEffect, useState } from "react";
import { showError } from "../Notifications";
import { getFilterData } from "../../../server/bank";

export const SubjectSelect = () => {
  const navigate = useNavigate();
  const { examSlug, subjectSlug } = useParams();

  const [filterData, setFilterData] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const data = await getFilterData();
      if (data) {
        setFilterData(data);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, []);

  const handleChangeExam = (e) => {
    const slug = e.target.value;
    navigate(`./../../${slug}/-/`);
  };
  const handleChangeSubject = (e) => {
    const slug = e.target.value;
    navigate(`./../${slug}/`);
  };

  const activeExam = filterData?.exams?.filter(
    (exam) => exam?.slug === examSlug
  )[0];

  const subjects = activeExam?.subjects;

  if (filterData === undefined) {
    return <></>;
  }
  return (
    <div className="exam-subject-select">
      <select value={examSlug} onChange={handleChangeExam}>
        <option value="-" disabled>
          Выберите экзамен
        </option>
        {filterData.exams.map((exam) => {
          return (
            <option value={exam.slug} key={exam.slug}>
              {exam.name}
            </option>
          );
        })}
      </select>
      {subjects && (
        <select value={subjectSlug} onChange={handleChangeSubject}>
          <option value="-" disabled>
            Выберите предмет
          </option>
          {subjects &&
            subjects.map((subj) => {
              return (
                <option value={subj.slug} key={subj.slug}>
                  {subj.name}
                </option>
              );
            })}
        </select>
      )}
    </div>
  );
};
