import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SubjectSelect } from "../Utils/SubjectSelect/SubjectSelect";
import { showError } from "../Utils/Notifications";
import { getCoursesBySubject } from "../../server/course";
import "./CourseCatalog.css";

const CourseCatalog = () => {
  const navigate = useNavigate();
  const { examSlug, subjectSlug } = useParams();
  const [courses, setCourses] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const coursesFromServer = await getCoursesBySubject(subjectSlug);
      if (coursesFromServer) {
        setCourses(coursesFromServer);
      } else {
        showError("Ошибка загрузки курсов.");
      }
      setLoading(false);
    }
    fetchData();
  }, [subjectSlug]);

  return (
    <div className="coll-cat-container">
      <h2>Каталог курсов</h2>
      <SubjectSelect />
      <div className="col-list">
        {isLoading && <p>Загрузка...</p>}
        {!isLoading && subjectSlug === "-" && courses?.length === 0 && (
          <p>Выберите предмет.</p>
        )}
        {!isLoading && subjectSlug !== "-" && courses?.length === 0 && (
          <p>Курсов пока нет.</p>
        )}
        {!isLoading &&
          courses.map((course) => {
            return (
              <div
                className="col-item"
                key={course.id}
                onClick={() => {
                  navigate(`/course/${course.id}/`);
                }}
              >
                <span>{course.name}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CourseCatalog;
