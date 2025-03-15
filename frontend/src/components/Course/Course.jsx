import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import EditLesson from "./EditLesson/EditLesson";
import { NotAuthorized } from "../Utils/NotAuthorized";

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
        navigate(`/course/${courseId}/`);
      }
    }
    if (String(currentLesson?.id) !== lessonId) {
      fetchData();
    }
  }, [dispatch, navigate, lessonId, courseId, currentLesson]);

  if (!courseData?.id) {
    return <h1>Загрузка</h1>;
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
