import axios from "axios";
import { prepareTask } from "../components/Utils/Server/serverUtils";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}

export const getTaskById = async (id) => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/v1/tasks/" + id + "/",
      {
        headers: headers,
      }
    );

    if (res.status === 200) {
      //console.log(res.data);
      return prepareTask(res.data);
    }
    return undefined;
  } catch (error) {
    //alert("Не удалось загрузить. Попробуйте позже.");
    console.log(error);
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
      "http://127.0.0.1:8000/api/v1/tasks/filtered/",
      data,
      {
        headers,
      }
    );

    if (res.status === 200) {
      console.log(res.data);
      return res.data;
    }
    return [];
  } catch (error) {
    alert("Не удалось загрузить задачи. Попробуйте позже.");
    console.log(error);
    return [];
  }
};

export const getFilterData = async () => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/v1/filter/",

      {
        headers,
      }
    );

    if (res.status === 200) {
      //console.log(res.data);
      return res.data;
    }
    return [];
  } catch (error) {
    alert("Не удалось загрузить. Попробуйте позже.");
    console.log(error);
    return [];
  }
};

export const getNumbers = async (examSlug, subjectSlug) => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/v1/filter/get_numbers/",
      { examSlug: examSlug, subjectSlug: subjectSlug },
      {
        headers,
      }
    );

    if (res.status === 200) {
      return res.data.numbers;
    }
    return [];
  } catch (error) {
    alert("Не удалось загрузить. Попробуйте позже.");
    console.log(error);
    return [];
  }
};

export const sendSolution = async ({ taskId, answer }) => {
  try {
    const res = await axios({
      url: "http://127.0.0.1:8000/api/v1/tasks-solutions/send-solution/",
      method: "post",
      data: { task_id: taskId, answer },
      headers,
    });
    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    alert("Не удалось загрузить. Попробуйте позже.");
    console.log(error);
    return undefined;
  }
};

export const getSolveStatuses = async ({ taskIds }) => {
  try {
    const res = await axios({
      url: "http://127.0.0.1:8000/api/v1/tasks-solutions/get_statuses/",
      method: "post",
      data: { task_ids: taskIds },
      headers,
    });
    console.log(res);
    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    alert("Не удалось загрузить. Попробуйте позже.");
    console.log(error);
    return undefined;
  }
};

export const createTaskOnServer = async (data) => {
  try {
    let url = `http://127.0.0.1:8000/api/v1/tasks/upload_task/`;
    let method = "post";
    if (data.taskId !== undefined) {
      url = `http://127.0.0.1:8000/api/v1/tasks/${data.taskId}/`;
      method = "patch";
    }
    console.log("to server", data);
    const res = await axios({
      url: url,
      method: method,
      data: data,
      headers,
    });
    console.log(res);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    alert("Не удалось загрузить. Попробуйте позже.");
    console.log(error);
    return undefined;
  }
};
