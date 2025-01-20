import axios from "axios";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}

export const getCourseFromServerById = async (courseId) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/courses/${courseId}/data/`,
      {
        headers: headers,
      }
    );

    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};
export const getLessonFromServerById = async (lessonId) => {
  try {
    const params = { lesson_id: lessonId };
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/courses/get-lesson/`,
      {
        params: params,
        headers: headers,
      }
    );

    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};
