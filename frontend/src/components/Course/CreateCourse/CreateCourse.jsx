import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CreateCourse.css";
import { createCourse } from "../../../server/course";
import { showError } from "../../Utils/Notifications";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const saveCourse = async () => {
    const course = await createCourse({
      name: courseName,
      description: courseDescription,
    });
    if (course) {
      console.log(course);
      navigate(`../edit-course/${course.id}/`);
    } else {
      showError("Произошла ошибка");
    }
  };

  return (
    <div className="create-course">
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
