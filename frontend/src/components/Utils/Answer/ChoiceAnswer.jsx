const ChoiceAnswer = ({
  setAnswerData,
  answerData,
  answer,
  setAnswer,
  disabled,
  isCreating,
}) => {
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

  const addOption = () => {
    setAnswerData([...answerData, "Опция"]);
  };
  const changeOptionName = (data, i) => {
    const newAnsData = [...answerData];
    newAnsData[i] = data;
    setAnswerData(newAnsData);
  };
  const delOptionName = (i) => {
    const newAnsData = [...answerData];
    newAnsData.splice(i, 1);
    setAnswerData(newAnsData);

    let newAns = answer.filter((item) => item !== i);
    newAns = newAns.map((item) => {
      if (item > i) {
        return item - 1;
      } else {
        return item;
      }
    });

    setAnswer([...newAns]);
  };

  return (
    <div className="answer-choice">
      {!isCreating &&
        answerData.map((opt, i) => {
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
              <p className="option">{opt}</p>
            </div>
          );
        })}

      {isCreating &&
        answerData.map((opt, i) => {
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
              <textarea
                value={opt}
                onChange={(e) => {
                  changeOptionName(e.target.value, i);
                }}
              ></textarea>
              <button
                onClick={() => {
                  delOptionName(i);
                }}
              >
                X
              </button>
            </div>
          );
        })}
      {isCreating && <button onClick={addOption}>Добавить</button>}
    </div>
  );
};
export default ChoiceAnswer;
