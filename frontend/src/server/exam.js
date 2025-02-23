import axios from "axios";
import { prepareTask } from "../components/Utils/Server/serverUtils";

const headers = { "Content-Type": "application/json" };
const jwt_a = localStorage.getItem("jwt_a");
if (jwt_a) {
  headers["Authorization"] = `Bearer ${jwt_a}`;
}

export const sendExamSolutionToServer = async (data) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "tasks-collections-solve/send-solution/",
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

export const getExamSolution = async (col_slug, sol_type) => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "tasks-collections-solve/get-solution/",
      {
        headers: headers,
        params: {
          col_slug: col_slug,
          sol_type: sol_type,
        },
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
