import axios from "axios";
import { logOut, prepareTask } from "../components/Utils/Server/serverUtils";
import { showError } from "../components/Utils/Notifications";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}

export const sendExamSolutionToServer = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "tasks-collections-solve/send-solution/",
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

export const getExamSolution = async (col_slug, sol_type, sol_id) => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "tasks-collections-solve/get-solution/",
      {
        headers: headers,
        params: {
          col_slug: col_slug,
          sol_type: sol_type,
          sol_id: sol_id,
        },
      }
    );

    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    if (error.status === 404) {
      showError("Такого решения не существует.");
    }
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const getMyExamsSolutions = async () => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL +
        "tasks-collections-solve/get-my-solutions/",
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
export const getMyStudentExamsSolutions = async (student_id) => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL +
        "tasks-collections-solve/get-my-student-solutions/",
      {
        params: {
          student_id: student_id,
        },
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

export const getAllSolutionsForExam = async (col_slug, class_id) => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL +
        "tasks-collections-solve/get-all-solutions-for-exam/",
      {
        params: {
          col_slug: col_slug,
          class_id: class_id,
        },
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
export const getStatsForExam = async (col_slug, class_id) => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL +
        "tasks-collections-solve/get-exam-statistics/",
      {
        params: {
          col_slug: col_slug,
          class_id: class_id,
        },
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

export const getSolvesExamStatisticsBySubject = async (subject_slug) => {
  try {
    const params = { subject_slug };
    const res = await axios.get(
      process.env.REACT_APP_API_URL +
        "tasks-collections-solve/solves-statistics-by-subject/",
      { params, headers: headers }
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

export const deleteSolution = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL +
        "tasks-collections-solve/delete-solution/",
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
