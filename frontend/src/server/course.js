import axios from "axios";
import { logOut } from "../components/Utils/Server/serverUtils";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}

export const getCoursesBySubject = async (subjectSlug) => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "courses/get-courses-by-subject/",
      {
        params: { subject_slug: subjectSlug },
        headers: headers,
      }
    );

    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const getMyCourses = async () => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "courses/my-courses/",
      {
        headers: headers,
      }
    );

    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const getCourseFromServerById = async (courseId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}courses/${courseId}/data/`,
      {
        headers: headers,
      }
    );

    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const getLessonFromServerById = async (lessonId) => {
  try {
    const params = { lesson_id: lessonId };
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "courses/get-lesson/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};
export const getLessonNameOnlyByIdFromServer = async (lessonId) => {
  try {
    const params = { lesson_id: lessonId };
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "courses/get-lesson-name/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const getModuleById = async (moduleId) => {
  try {
    const params = { module_id: moduleId };
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "courses/get-module-with-lessons/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};
export const getSectionById = async (sectionId) => {
  try {
    const params = { section_id: sectionId };
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "courses/get-section/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const sendSectionSolution = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "courses/send-solution/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const createCourse = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "edit-course/create-course/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};
export const createModule = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "edit-course/create-module/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};
export const createLesson = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "edit-course/create-lesson/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};
export const createSection = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "edit-course/create-section/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const updateCourse = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "edit-course/update/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const updateLesson = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "edit-course/update-lesson/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const deleteCourse = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "edit-course/delete-course/",
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
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};
