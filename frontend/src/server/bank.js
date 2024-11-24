import axios from "axios";

export const getAllTasksFromServer = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/v1/tasks/", {
      headers: {
        //Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

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
