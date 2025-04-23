import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourse, getMyCourses } from "../../../../server/course";
import "./Materials.css";
import { showError } from "../../../Utils/Notifications";

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getMyCourses();
      if (res) {
        setCourses(res);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, []);

  const goToLk = () => {
    navigate("./../");
  };

  const handleCourseDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить?")) {
      const res = await deleteCourse({ course_id: id });

      if (res) {
        const newCourses = courses.filter((course) => {
          return course.id !== id;
        });

        setCourses(newCourses);
      } else {
        showError("Ошибка.");
      }
    }
  };

  return (
    <div className="teacher-materials">
      <h2> Мои курсы</h2>
      <button onClick={goToLk} className="return-but">
        В личный кабинет
      </button>
      <div className="col-cont">
        {courses.map((course) => (
          <div
            key={course.id}
            className="collection"
            onClick={() => {
              window.open(`/course/${course.id}/`, "_blank");
            }}
          >
            <p>{course.name}</p>
            <div className="buttons">
              <button
                onClick={() => {
                  window.open(`/course/${course.id}/`, "_blank");
                }}
              >
                Смотреть
              </button>
              <button
                onClick={() => {
                  window.open(`/edit-course/${course.id}/`, "_blank");
                }}
              >
                Редактировать
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCourseDelete(course.id);
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCourses;
