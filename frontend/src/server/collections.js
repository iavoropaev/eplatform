import axios from "axios";
import { logOut, prepareTask } from "../components/Utils/Server/serverUtils";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}
export const getCollectionBySlug = async (slug) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}tasks-collections/${slug}/`,
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
export const updateCollection = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "tasks-collections/update-collection/",
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

export const getCollections = async (subjectSlug) => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "tasks-collections/get_collections/",
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
export const getMyCollections = async () => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "tasks-collections/my-collections/",
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

export const createCollection = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "tasks-collections/create-collection/",
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

export const deleteCollection = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "tasks-collections/delete-collection/",
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

export const generateCollection = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "tasks-collections/generate-collection/",
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
