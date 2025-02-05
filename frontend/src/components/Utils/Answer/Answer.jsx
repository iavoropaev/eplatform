import { useState } from "react";
import TextAnswer from "./TextAnswer";
import TableAnswer from "./TableAnswer";
import "./Answer.css";
import ChoiceAnswer from "./ChoiceAnswer";

const Answer = ({ type, answerData, answer, setAnswer, disabled }) => {
  console.log(["AAAA", answer]);
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

  if (type === "choice") {
    return (
      <div className="task-answer">
        <ChoiceAnswer
          answerData={answerData}
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
