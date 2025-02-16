import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LeftMenu from "./LeftMenu/LeftMenu";
import "./Course.css";
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

const Course = () => {
  const { courseId, lesson, lessonId } = useParams();
  const viewType = lesson;

  const dispatch = useDispatch();
  const courseData = useSelector((state) => state.course.courseData);
  const currentLesson = useSelector((state) => state.course.currentLesson);

  useEffect(() => {
    async function fetchData() {
      const courseData = await getCourseFromServerById(courseId);
      if (courseData) {
        console.log(courseData);
        dispatch(setCourseData(courseData));
      }
    }
    fetchData();
  }, [dispatch, courseId]);

  useEffect(() => {
    async function fetchData() {
      const lessonData = await getLessonFromServerById(lessonId);
      if (lessonData) {
        dispatch(setCurrentLesson(lessonData));
      }
    }
    fetchData();
  }, [dispatch, lessonId]);

  if (!courseData?.id || !currentLesson) {
    console.log(courseData, currentLesson);
    return <h1>Загрузка</h1>;
  }

  return (
    <div className="course-container">
      <LeftMenu />
      {viewType === "lesson" && <Lesson />}
      {viewType === "edit-lesson" && <p>Редактировать урок</p>}
    </div>
  );
};

export default Course;
