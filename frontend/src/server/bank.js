import axios from "axios";

export const getAllTasksFromServer = async ({ numbers, authors, subject }) => {
  try {
    const data = { numbers_in_exam: numbers, authors, subject };
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
