import axios from "axios";

export const getTokenByVKID = async ({ silentToken, uuid }) => {
  const res = await axios.post("http://127.0.0.1:8000/api/v1/users/auth/", {
    token: silentToken,
    uuid,
  });
  return res.data;
};
