import { useState } from "react";
import TextAnswer from "./TextAnswer";
import TableAnswer from "./TableAnswer";
import "./Answer.css";
import ChoiceAnswer from "./ChoiceAnswer";
import ComparisonAnswer from "./СomparisonAnswer";
import SortingAnswer from "./SortingAnswer";
import OpenAnswer from "./OpenAnswer";
import ChoiceScore from "./ChoiseScore";

const Answer = ({
  type,
  answerData,
  answer,
  setAnswer,
  setAnswerData,
  handleChooseScore,
  disabled,
  isCreating,
}) => {
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
        />
      </div>
    );
  }

  if (type === "choice") {
    return (
      <div className="task-answer">
        <ChoiceAnswer
          answerData={answerData}
          setAnswerData={setAnswerData}
          answer={answer}
          setAnswer={setAnswer}
          disabled={disabled}
          isCreating={isCreating}
        />
      </div>
    );
  }

  if (type === "comparison") {
    return (
      <div className="task-answer">
        <ComparisonAnswer
          answerData={answerData}
          setAnswerData={setAnswerData}
          answer={answer}
          setAnswer={setAnswer}
          disabled={disabled}
          isCreating={isCreating}
        />
      </div>
    );
  }

  if (type === "sorting") {
    return (
      <div className="task-answer">
        <SortingAnswer
          answerData={answerData}
          setAnswerData={setAnswerData}
          answer={answer}
          setAnswer={setAnswer}
          disabled={disabled}
          isCreating={isCreating}
        />
      </div>
    );
  }

  if (type === "open_answer") {
    return (
      <div className="task-answer">
        <OpenAnswer
          answerData={answerData}
          setAnswerData={setAnswerData}
          answer={answer}
          setAnswer={setAnswer}
          disabled={disabled}
          isCreating={isCreating}
        />
      </div>
    );
  }

  if (type === "no_answer" && handleChooseScore !== undefined) {
    return (
      <div className="task-answer">
        <ChoiceScore
          answerData={answerData}
          setAnswerData={setAnswerData}
          answer={answer}
          setAnswer={handleChooseScore}
          disabled={disabled}
          isCreating={isCreating}
        />
      </div>
    );
  }

  return <></>;
};
export default Answer;
