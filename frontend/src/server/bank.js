import axios from "axios";
import { logOut, prepareTask } from "../components/Utils/Server/serverUtils";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}

export const getTaskById = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}tasks/${id}/`,
      {
        headers: headers,
      }
    );

    if (res.status === 200) {
      return prepareTask(res.data);
    }
    return undefined;
  } catch (error) {
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const getTaskWithAnsById = async (id) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "tasks/task-with-ans-by-id/",
      { task_id: id },
      {
        headers: headers,
      }
    );

    if (res.status === 200) {
      return prepareTask(res.data);
    }
    return undefined;
  } catch (error) {
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const getAllTasksFromServer = async ({
  numbers,
  authors,
  subject,
  bankAuthors,
  dif_levels,
  actualities,
}) => {
  try {
    const data = {
      numbers_in_exam: numbers,
      authors,
      subject,
      bank_authors: bankAuthors,
      dif_levels,
      actualities,
    };

    const res = await axios.post(
      process.env.REACT_APP_API_URL + "tasks/filtered/",
      data,
      {
        headers,
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
export const getMyTasks = async () => {
  try {
    const res = await axios.get(process.env.REACT_APP_API_URL + "tasks/my/", {
      headers,
    });

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

export const getFilterData = async () => {
  try {
    const res = await axios.get(process.env.REACT_APP_API_URL + "filter/", {
      headers,
    });

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

export const getNumbers = async (examSlug, subjectSlug) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "filter/get_numbers/",
      { examSlug: examSlug, subjectSlug: subjectSlug },
      {
        headers,
      }
    );

    if (res.status === 200) {
      return res.data.numbers;
    }
    return undefined;
  } catch (error) {
    if (error.status === 401) {
      logOut();
    }
    return undefined;
  }
};

export const sendSolution = async ({ taskId, answer }) => {
  try {
    const res = await axios({
      url: process.env.REACT_APP_API_URL + "tasks-solutions/send-solution/",
      method: "post",
      data: { task_id: taskId, answer },
      headers,
    });
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

export const getSolveStatuses = async ({ taskIds }) => {
  try {
    const res = await axios({
      url: process.env.REACT_APP_API_URL + "tasks-solutions/get_statuses/",
      method: "post",
      data: { task_ids: taskIds },
      headers,
    });

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

export const createTaskOnServer = async (data) => {
  try {
    let url = process.env.REACT_APP_API_URL + "tasks/upload_task/";
    let method = "post";
    if (data.taskId !== undefined) {
      url = `${process.env.REACT_APP_API_URL}tasks/${data.taskId}/`;
      method = "patch";
    }

    const res = await axios({
      url: url,
      method: method,
      data: data,
      headers,
    });

    if (res.status === 200 || res.status === 201) {
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

export const getTaskSolution = async (taskId) => {
  try {
    const params = { task_id: taskId };
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "tasks-solutions/get-solution/",
      {
        params,
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
