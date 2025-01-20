import { useEffect, useState } from "react";
import "./LeftMenu.css";
import { useNavigate } from "react-router-dom";

const LeftMenu = ({ modules, activeLessonId }) => {
  const navigate = useNavigate();
  return (
    <div className="left-menu">
      {modules &&
        modules.map((mod) => {
          return (
            <div key={mod.id}>
              <p className="module-title">{mod.name}</p>
              {mod.lessons.map((lesson) => {
                return (
                  <p
                    className={
                      String(activeLessonId) === String(lesson.id)
                        ? "active-lesson"
                        : "lesson"
                    }
                    key={lesson.id}
                    onClick={() => {
                      navigate(`./../${lesson.id}/`);
                    }}
                  >
                    {lesson.name}
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
