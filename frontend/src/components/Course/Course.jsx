import { useEffect, useState } from "react";
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
  const { courseId, lessonId } = useParams();

  const dispatch = useDispatch();
  const courseData = useSelector((state) => state.course.courseData);
  const currentLesson = useSelector((state) => state.course.currentLesson);

  const modules = courseData.modules;
  useEffect(() => {
    async function fetchData() {
      const courseData = await getCourseFromServerById(courseId);
      if (courseData) {
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

  return (
    <div className="course-container">
      <LeftMenu modules={modules} activeLessonId={lessonId} />
      <Lesson lesson={currentLesson} />
    </div>
  );
};

export default Course;
