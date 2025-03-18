import slugify from "slugify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./CreateCollection.css";
import { createCollection } from "../../server/collections";
import { setSlug } from "../../redux/slices/createCollectionSlice";
import { showError } from "../Utils/Notifications";
import { getFilterData } from "../../server/bank";

const CreateCollection = () => {
  const navigate = useNavigate();

  const [filterData, setFilterData] = useState(undefined);

  const [colName, setColName] = useState("");
  const [colDescription, setColDescription] = useState("");
  const [colSlug, setColSlug] = useState("");
  const [isExam, setExam] = useState(false);
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

  const saveCollection = async () => {
    const collection = await createCollection({
      slug: colSlug,
      name: colName,
      description: colDescription,
      is_exam: isExam,
      subject: subjectId,
    });
    if (collection !== undefined) {
      navigate(`../update-collection/${collection.slug}/`);
    } else {
      showError("Не удалось создать подборку.");
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
  console.log(activeExam, subjects);
  return (
    <div className="create-collection">
      <div>
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
        <span>Название подборки </span>
        <input
          value={colName}
          onChange={(e) => {
            setColName(e.target.value);
            setColSlug(
              slugify(e.target.value, {
                lower: true,
                strict: true,
              })
            );
          }}
        ></input>
      </div>
      <div className="discr">
        <span>Описание подборки </span>
        <textarea
          wrap="hard"
          rows="5"
          cols="50"
          value={colDescription}
          onChange={(e) => {
            setColDescription(e.target.value);
          }}
        ></textarea>
      </div>
      <div>
        <span>Слаг </span>
        <input
          value={colSlug}
          onChange={(e) => {
            setColSlug(e.target.value);
          }}
        ></input>
      </div>
      <div>
        <span>Это вариант? </span>
        <input
          checked={isExam}
          onChange={(e) => {
            setExam(e.target.checked);
          }}
          type="checkbox"
        ></input>
      </div>
      <div>
        <button onClick={saveCollection} className="black-button">
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default CreateCollection;
