import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Task from "../../../Task/Task";
import { getMyCollections } from "../../../../server/collections";
import { getMyCourses } from "../../../../server/course";

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
                navigate(`/course/${course.slug}/`);
              }}
            >
              Смотреть
            </button>
            <button
              onClick={() => {
                navigate(`/edit-course/${course.id}/`);
              }}
            >
              Редактировать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCourses;
