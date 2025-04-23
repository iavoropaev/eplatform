import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LeftMenu.css";

const LeftMenu = () => {
  const navigate = useNavigate();

  const { courseId, lessonId } = useParams();
  const activeLessonId = lessonId;

  const modules = useSelector((state) => state.course.courseData.modules);
  const courseName = useSelector((state) => state.course.courseData.name);

  const [isHide, setHide] = useState(false);

  if (isHide) {
    return (
      <button
        onClick={() => {
          setHide(false);
        }}
        className="show-menu"
      >
        →
      </button>
    );
  }

  return (
    <div className="left-menu">
      <div className="left-menu-content">
        <div className="course-info">
          <div className="course-name">{courseName}</div>
        </div>
        {modules &&
          modules.map((mod, modInd) => {
            return (
              <div key={mod.id}>
                <p className="module-title">{modInd + 1 + ". " + mod.name}</p>
                {mod.lessons.map((lesson, lesInd) => {
                  return (
                    <div
                      key={lesson.id}
                      className={
                        String(activeLessonId) === String(lesson.id)
                          ? "active-lesson"
                          : "lesson"
                      }
                    >
                      <button
                        className="navigate-button"
                        onClick={() => {
                          navigate(
                            `/course/${courseId}/lesson/${lesson.id}/s/1/`
                          );
                        }}
                      >
                        {modInd + 1 + "." + (lesInd + 1) + ". " + lesson.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>

      <button
        onClick={() => {
          setHide(true);
        }}
        className="hide-menu"
      >
        ←
      </button>
    </div>
  );
};

export default LeftMenu;
