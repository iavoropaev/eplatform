import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Task from "../../../Task/Task";
import { getMyCollections } from "../../../../server/collections";
import { deleteCourse, getMyCourses } from "../../../../server/course";

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getMyCourses();
      if (res) {
        setCourses(res);
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
      }
    }
  };

  return (
    <div className="">
      <h2> Мои курсы</h2>
      <button onClick={goToLk}>В личный кабинет</button>
      <div>
        {courses.map((course) => (
          <div key={course.id} className="tag">
            <div>{course.name}</div>
            <button
              onClick={() => {
                window.open(`/course/${course.id}/lesson/-1/s/-1/`, "_blank");
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
              onClick={() => {
                handleCourseDelete(course.id);
              }}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCourses;
