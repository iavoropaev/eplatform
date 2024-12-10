import axios from "axios";

export const getTaskById = async (id) => {
  try {
    console.log("D server");
    const res = await axios.get(
      "http://127.0.0.1:8000/api/v1/tasks/" + id + "/",
      {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
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
export const getAllTasksFromServer = async ({
  numbers,
  authors,
  subject,
  bankAuthors,
}) => {
  try {
    const data = {
      numbers_in_exam: numbers,
      authors,
      subject,
      bank_authors: bankAuthors,
    };
    console.log(data);
    const res = await axios.post(
      "http://127.0.0.1:8000/api/v1/tasks/filtered/",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
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
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
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
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
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
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
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
