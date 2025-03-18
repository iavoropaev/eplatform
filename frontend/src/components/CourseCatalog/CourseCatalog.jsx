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

  useEffect(() => {
    async function fetchData() {
      const coursesFromServer = await getCoursesBySubject(subjectSlug);
      if (coursesFromServer) {
        setCourses(coursesFromServer);
      } else {
        showError("Ошибка загрузки курсов.");
      }
    }
    fetchData();
  }, [subjectSlug]);

  return (
    <div className="coll-cat-container">
      <h1>Каталог курсов</h1>
      <SubjectSelect />
      <div className="col-list">
        {courses.map((course) => {
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
