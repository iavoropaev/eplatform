import axios from "axios";
import { prepareTask } from "../components/Utils/Server/serverUtils";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}
export const getCollectionBySlug = async (slug) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/tasks-collections/${slug}/`,
      {
        headers: headers,
      }
    );

    if (res.status === 200) {
      //console.log(res.data);
      return res.data;
    }
    return undefined;
  } catch (error) {
    //alert("Не удалось загрузить. Попробуйте позже.");
    console.log(error);
    return undefined;
  }
};
export const updateCollection = async (data) => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/v1/tasks-collections/update_collection/",
      data,
      {
        headers: headers,
      }
    );

    if (res.status === 201) {
      //console.log(res.data);
      return res.data;
    }
    return undefined;
  } catch (error) {
    //alert("Не удалось загрузить. Попробуйте позже.");
    console.log(error);
    return undefined;
  }
};

export const getCollections = async () => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/v1/tasks-collections/get_collections/",
      {
        headers: headers,
      }
    );

    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const createCollection = async (data) => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/v1/tasks-collections/",
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
    console.log(error);
    return undefined;
  }
};