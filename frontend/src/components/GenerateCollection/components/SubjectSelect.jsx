import { useNavigate, useParams } from "react-router-dom";

export const SubjectSelect = ({ filterData, subjects }) => {
  const { examSlug, subjectSlug } = useParams();

  const navigate = useNavigate();

  const handleChangeExam = (e) => {
    const slug = e.target.value;
    navigate(`./../../${slug}/-/`);
  };
  const handleChangeSubject = (e) => {
    const slug = e.target.value;
    navigate(`./../${slug}/`);
  };
  return (
    <div>
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
    </div>
  );
};
