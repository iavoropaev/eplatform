import { useEffect } from "react";
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
  const dispatch = useDispatch();
  const courseData = useSelector((state) => state.course.courseData);
  const currentLesson = useSelector((state) => state.course.currentLesson);

  useEffect(() => {
    async function fetchData() {
      const courseData = await getCourseFromServerById(courseId);
      if (courseData) {
        console.log(courseData);
        dispatch(setCourseData(courseData));
      } else {
        showError("Курс не загружен.");
      }
    }
    fetchData();
  }, [dispatch, courseId]);

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

  if (!courseData?.id) {
    return <h2>Загрузка</h2>;
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
