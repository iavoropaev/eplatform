import axios from "axios";
const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}

export const getTokenByVKID = async ({ silentToken, uuid }) => {
  const res = await axios.post(process.env.REACT_APP_API_URL + "users/auth/", {
    token: silentToken,
    uuid,
  });
  return res.data;
};

export const getTgInvitation = async () => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "users/get-tg-invitation/",
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

export const getTgLinkStatus = async () => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "users/get-tg-link-status/",
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
