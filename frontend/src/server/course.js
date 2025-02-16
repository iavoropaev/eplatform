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
export const getLessonNameOnlyByIdFromServer = async (lessonId) => {
  try {
    const params = { lesson_id: lessonId };
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/courses/get-lesson-name/`,
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

export const sendSectionSolution = async (data) => {
  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/api/v1/courses/send-solution/`,
      data,
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

export const updateCourse = async (data) => {
  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/api/v1/edit-course/update/`,
      data,
      {
        headers: headers,
      }
    );

    if (res.status === 201) {
      return res.data;
    }
    return res.data;
  } catch (error) {
    return undefined;
  }
};

export const createModule = async (data) => {
  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/api/v1/edit-course/create-module/`,
      data,
      {
        headers: headers,
      }
    );

    if (res.status === 201) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};
export const createLesson = async (data) => {
  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/api/v1/edit-course/create-lesson/`,
      data,
      {
        headers: headers,
      }
    );

    if (res.status === 201) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};

export const getModuleById = async (moduleId) => {
  try {
    const params = { module_id: moduleId };
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/courses/get-module-with-lessons/`,
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
