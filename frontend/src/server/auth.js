import axios from "axios";

export const getTokenByVKID = async ({ silentToken, uuid }) => {
  const res = await axios.post(process.env.REACT_APP_API_URL + "users/auth/", {
    token: silentToken,
    uuid,
  });
  return res.data;
};
