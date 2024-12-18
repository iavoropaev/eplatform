import { useState } from "react";
import TextAnswer from "./TextAnswer";
import TableAnswer from "./TableAnswer";

const Answer = ({ type, answer, setAnswer }) => {
  if (type === "text") {
    return <TextAnswer answer={answer} setAnswer={setAnswer} />;
  }

  if (type === "table") {
    return <TableAnswer answer={answer} setAnswer={setAnswer} />;
  }

  return <></>;
};
export default Answer;
