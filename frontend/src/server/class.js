import axios from "axios";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}

export const getClassbyId = async (classId) => {
  try {
    const params = { class_id: classId };
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "class/get-class-data/",
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
    return undefined;
  }
};

export const getMyClasses = async () => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "class/get-my-classes/",
      {
        headers: headers,
      }
    );

    if (res.status === 200) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};

export const createClass = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "class/create-class/",
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
    return undefined;
  }
};

export const deleteInvitation = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "class/delete-invitation/",
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
    return undefined;
  }
};

export const activateInvitation = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "class/activate-invitation/",
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
    return undefined;
  }
};
