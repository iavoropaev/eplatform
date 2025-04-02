import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./CreateCourse.css";
import { showError, showOK } from "../Utils/Notifications";
import { getFilterData } from "../../server/bank";
import { createCourse } from "../../server/course";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [filterData, setFilterData] = useState(undefined);

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [examId, setExamId] = useState("-");
  const [subjectId, setSubjectId] = useState("-");

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

  const saveCourse = async () => {
    const course = await createCourse({
      name: courseName,
      description: courseDescription,
      subject: subjectId,
    });
    if (course !== undefined) {
      showOK(`Курс ${courseName} успешно создан!`);
      navigate(`../edit-course/${course.id}/`);
    } else {
      showError("Не удалось создать курс.");
    }
  };

  const handleChangeExam = (e) => {
    setExamId(Number(e.target.value));
    setSubjectId("-");
  };
  const handleChangeSubject = (e) => {
    setSubjectId(Number(e.target.value));
  };
  console.log(filterData);
  if (filterData === undefined) {
    return <></>;
  }

  const activeExam = filterData?.exams?.filter(
    (exam) => exam?.id === examId
  )[0];
  const subjects = activeExam?.subjects;

  return (
    <div className="create-course">
      <h2>Создание курса</h2>
      <div className="subject-select">
        <select value={examId} onChange={handleChangeExam}>
          <option value="-" disabled>
            Выберите экзамен
          </option>
          {filterData.exams.map((exam) => {
            return (
              <option value={exam.id} key={exam.id}>
                {exam.name}
              </option>
            );
          })}
        </select>
        <select value={subjectId} onChange={handleChangeSubject}>
          <option value="-" disabled>
            Выберите предмет
          </option>
          {subjects &&
            subjects.map((subj) => {
              return (
                <option value={subj.id} key={subj.id}>
                  {subj.name}
                </option>
              );
            })}
        </select>
      </div>
      <div>
        <span>Название курса </span>
        <input
          value={courseName}
          onChange={(e) => {
            setCourseName(e.target.value);
          }}
        ></input>
      </div>
      <div className="discr">
        <span>Описание курса </span>
        <textarea
          wrap="hard"
          rows="5"
          cols="50"
          value={courseDescription}
          onChange={(e) => {
            setCourseDescription(e.target.value);
          }}
        ></textarea>
      </div>

      <div>
        <button onClick={saveCourse} className="black-button">
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default CreateCourse;
