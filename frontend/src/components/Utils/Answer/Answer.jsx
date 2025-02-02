import { useState } from "react";
import TextAnswer from "./TextAnswer";
import TableAnswer from "./TableAnswer";
import "./Answer.css";

const Answer = ({ type, answer, setAnswer, disabled }) => {
  if (type === "text") {
    return (
      <div className="task-answer">
        <TextAnswer answer={answer} setAnswer={setAnswer} disabled={disabled} />
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="task-answer">
        <TableAnswer
          answer={answer}
          setAnswer={setAnswer}
          disabled={disabled}
        />{" "}
      </div>
    );
  }

  return <></>;
};
export default Answer;
