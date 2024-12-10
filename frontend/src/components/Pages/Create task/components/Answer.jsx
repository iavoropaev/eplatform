import { useState } from "react";

const Answer = ({ answer, setAnswer }) => {
  return (
    <div className="answer">
      <p>Ответ</p>
      <input
        onChange={(e) => {
          setAnswer(e.target.value);
        }}
        value={answer}
      ></input>
    </div>
  );
};
export default Answer;
