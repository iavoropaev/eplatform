import { useState } from "react";
import TextAnswer from "./TextAnswer";
import TableAnswer from "./TableAnswer";

const Answer = ({ type, answer, setAnswer, disabled }) => {
  if (type === "text") {
    return (
      <TextAnswer answer={answer} setAnswer={setAnswer} disabled={disabled} />
    );
  }

  if (type === "table") {
    return (
      <TableAnswer answer={answer} setAnswer={setAnswer} disabled={disabled} />
    );
  }

  return <></>;
};
export default Answer;
