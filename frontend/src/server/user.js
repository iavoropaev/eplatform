import axios from "axios";
import { logOut } from "../components/Utils/Server/serverUtils";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}

export const getMyAchievements = async () => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "achievements/get-my-achievements/",
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

export const getSolvesStatisticsBySubject = async (subject_slug) => {
  try {
    const params = { subject_slug };
    const res = await axios.get(
      process.env.REACT_APP_API_URL +
        "tasks-solutions/solves-statistics-by-subject/",
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

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      process.env.REACT_APP_API_URL + "upload-file/",
      formData,
      { headers: { ...headers, "Content-Type": "multipart/form-data" } }
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
