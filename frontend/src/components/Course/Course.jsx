import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftMenu from "./LeftMenu/LeftMenu";

import {
  getCourseFromServerById,
  getLessonFromServerById,
} from "../../server/course";
import { useDispatch, useSelector } from "react-redux";
import {
  setCourseData,
  setCurrentLesson,
} from "../../redux/slices/courseSlice";
import Lesson from "./Lesson/Lesson";
import EditLesson from "./EditLesson/EditLesson";
import "./Course.css";
import { showError } from "../Utils/Notifications";

const Course = () => {
  const { courseId, lesson, lessonId } = useParams();
  const viewType = lesson;

  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const courseData = useSelector((state) => state.course.courseData);
  const currentLesson = useSelector((state) => state.course.currentLesson);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const courseData = await getCourseFromServerById(courseId);

      if (courseData) {
        dispatch(setCourseData(courseData));
        if (lessonId === undefined) {
          navigate(
            `/course/${courseId}/lesson/${courseData?.modules?.[0]?.lessons?.[0]?.id}/s/1/`
          );
        }
      } else {
        showError("Курс не загружен.");
      }
      setLoading(false);
    }
    if (courseData && String(courseData?.id) !== courseId) {
      fetchData();
    }
  }, [navigate, dispatch, courseId, lessonId, courseData]);

  useEffect(() => {
    async function fetchData() {
      const lessonData = await getLessonFromServerById(lessonId);
      if (lessonData) {
        dispatch(setCurrentLesson(lessonData));
      } else {
        showError("Урок не загружен.");
        navigate(`/course/${courseId}/`);
      }
    }
    if (String(currentLesson?.id) !== lessonId && lessonId !== undefined) {
      console.log(lessonId);
      fetchData();
    }
  }, [dispatch, navigate, lessonId, courseId, currentLesson]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      dispatch(setCurrentLesson(undefined));
      dispatch(setCourseData({}));
    };
  }, []);

  if (isLoading) {
    return (
      <div className="course-container">
        <p className="page-loading">Загрузка...</p>
      </div>
    );
  }
  console.log(courseData);
  return (
    <div className="course-container">
      <LeftMenu />
      {viewType === "lesson" && <Lesson />}
      {viewType === "edit-lesson" && <EditLesson />}
    </div>
  );
};

export default Course;
