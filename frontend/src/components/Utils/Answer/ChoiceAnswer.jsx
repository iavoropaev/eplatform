import { useState } from "react";

const ChoiceAnswer = ({ answerData, answer, setAnswer, disabled }) => {
  const handleChange = (i) => {
    if (answer.includes(i)) {
      const newAns = answer.filter((item) => item !== i);
      setAnswer(newAns);
    } else {
      const newAns = [...answer];
      newAns.push(i);
      newAns.sort((a, b) => a - b);
      setAnswer(newAns);
    }
  };

  return (
    <div className="answer">
      {answerData.map((opt, i) => {
        return (
          <div className="ch-option" key={i}>
            <input
              type="checkbox"
              className="ch-input"
              checked={answer.includes(i)}
              onChange={() => {
                handleChange(i);
              }}
              disabled={disabled}
            ></input>
            <span>{opt}</span>
          </div>
        );
      })}
    </div>
  );
};
export default ChoiceAnswer;
