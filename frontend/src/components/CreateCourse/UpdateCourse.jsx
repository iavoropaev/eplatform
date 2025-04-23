import { useEffect, useState } from "react";
import {
  getCourseFromServerById,
  getLessonNameOnlyByIdFromServer,
  updateCourse,
} from "../../server/course";
import { useParams } from "react-router-dom";
import SwapAndDelete from "../Utils/SwapAndDelete";
import AddNewLesson from "./components/AddNewLesson";
import AddNewModule from "./components/AddNewModule";
import { showError, showOK } from "../Utils/Notifications";
import "./UpdateCourse.css";

const UpdateCourse = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(undefined);
  const [isSaving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const courseData = await getCourseFromServerById(courseId);
      if (courseData) {
        setCourseData(courseData);
      } else {
        showError("Ошибка загрузки курса.");
      }
    }
    fetchData();
  }, [courseId]);

  const handleChangeCourseName = (e) => {
    setCourseData({ ...courseData, name: e.target.value });
  };

  const handleChangeModuleName = (modIndex, name) => {
    const newModules = [...courseData.modules];
    const newModule = newModules[modIndex];
    newModule.name = name;
    setCourseData({ ...courseData, modules: [...newModules] });
  };

  // Module navigation
  const swapModules = (i, j) => {
    const length = courseData.modules.length;
    if (i >= 0 && j >= 0 && i < length && j < length) {
      const newModules = [...courseData.modules];
      [newModules[i], newModules[j]] = [newModules[j], newModules[i]];
      setCourseData({ ...courseData, modules: newModules });
    }
  };
  const eraseModule = (i) => {
    if (i >= 0 && i < courseData.modules.length) {
      let newModules = [...courseData.modules];
      newModules.splice(i, 1);
      setCourseData({ ...courseData, modules: newModules });
    }
  };

  // Lesson navigation
  const swapLessons = (indMod, i, j) => {
    if (indMod >= 0 && indMod < courseData.modules.length) {
      const lessons = courseData.modules[indMod].lessons;
      const length = lessons.length;

      if (i >= 0 && j >= 0 && i < length && j < length) {
        const newLessons = [...lessons];
        [newLessons[i], newLessons[j]] = [newLessons[j], newLessons[i]];
        const newModules = [...courseData.modules];
        newModules[indMod] = {
          ...newModules[indMod],
          lessons: newLessons,
        };
        setCourseData({ ...courseData, modules: newModules });
      }
    }
  };
  const eraseLesson = (indMod, i) => {
    if (indMod >= 0 && indMod < courseData.modules.length) {
      const lessons = courseData.modules[indMod].lessons;
      if (i >= 0 && i < lessons.length) {
        const newLessons = [...lessons];
        newLessons.splice(i, 1);
        const newModules = [...courseData.modules];
        newModules[indMod] = {
          ...newModules[indMod],
          lessons: newLessons,
        };
        setCourseData({ ...courseData, modules: newModules });
      }
    }
  };
  const addLesson = async (indMod, lessonId) => {
    if (indMod >= 0 && indMod < courseData.modules.length) {
      const alreadyExist = courseData.modules.some((module) =>
        module.lessons.some((lesson) => lesson.id === Number(lessonId))
      );
      if (alreadyExist === true) {
        return;
      }

      const lessons = courseData.modules[indMod].lessons;
      const lesson = await getLessonNameOnlyByIdFromServer(lessonId);
      if (lesson) {
        const newLessons = [...lessons, lesson];
        const newModules = [...courseData.modules];
        newModules[indMod] = {
          ...newModules[indMod],
          lessons: newLessons,
        };
        setCourseData({ ...courseData, modules: newModules });
      } else {
        showError("Урок не добавлен.");
      }
    }
  };

  const addModule = async (module) => {
    if (module && !courseData.modules.some((el) => el.id === module.id)) {
      const newModules = [...courseData.modules, module];
      setCourseData({ ...courseData, modules: newModules });
    }
  };

  const handleSaveButton = async () => {
    setSaving(true);
    const updatedCourseData = await updateCourse(courseData);
    if (updatedCourseData) {
      setCourseData(updatedCourseData);
      showOK("Сохранено!");
    } else {
      showError("Не сохранено.");
    }
    setSaving(false);
  };
  if (courseData === undefined) {
    return <></>;
  }

  return (
    <div className="edit-course">
      <h2>Редактирование курса</h2>

      <div className="course-info">
        <div>
          <input
            value={courseData.name}
            onChange={handleChangeCourseName}
          ></input>
        </div>
      </div>

      <div className="modules">
        {courseData.modules.map((module, indMod) => {
          return (
            <div key={module.id} className="module">
              <SwapAndDelete
                swap={swapModules}
                erase={eraseModule}
                index={indMod}
              />

              <div className="module-data">
                <div className="module-name">
                  <span>{indMod + 1}. </span>
                  <input
                    value={module.name}
                    onChange={(e) => {
                      handleChangeModuleName(indMod, e.target.value);
                    }}
                  ></input>
                </div>

                <div className="lessons">
                  {module.lessons.map((lesson, lesInd) => {
                    return (
                      <div key={lesson.id} className="lesson-cont">
                        <div className="lesson">
                          <a
                            className="common-a"
                            href={`/course/${courseId}/lesson/${lesson.id}/s/1/`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >{`${lesInd + 1}. ${lesson.name}`}</a>
                        </div>
                        <SwapAndDelete
                          swap={(i, j) => swapLessons(indMod, i, j)}
                          erase={(i) => {
                            eraseLesson(indMod, i);
                          }}
                          index={lesInd}
                        />
                      </div>
                    );
                  })}
                </div>
                <AddNewLesson addLesson={addLesson} indMod={indMod} />
              </div>
            </div>
          );
        })}
      </div>
      <AddNewModule addModule={addModule} addLesson={addLesson} indMod={1} />
      <div className="save-button-cont">
        <button
          onClick={handleSaveButton}
          className="black-button"
          disabled={isSaving}
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </button>
        <button
          onClick={() => {
            window.open(`/course/${courseId}/`);
          }}
        >
          Просмотр курса
        </button>
      </div>
    </div>
  );
};
export default UpdateCourse;
