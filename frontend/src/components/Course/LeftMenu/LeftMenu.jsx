import { useEffect, useState } from "react";
import "./LeftMenu.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LeftMenu = ({ modules, activeLessonId }) => {
  const navigate = useNavigate();
  const courseName = useSelector((state) => state.course.courseData.name);
  console.log(courseName);
  return (
    <div className="left-menu">
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
                  <p
                    className={
                      String(activeLessonId) === String(lesson.id)
                        ? "active-lesson"
                        : "lesson"
                    }
                    key={lesson.id}
                    onClick={() => {
                      navigate(`./../../../${lesson.id}/s/1/`);
                    }}
                  >
                    {modInd + 1 + "." + (lesInd + 1) + ". " + lesson.name}
                  </p>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default LeftMenu;
