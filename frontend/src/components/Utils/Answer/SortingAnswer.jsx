const SortingAnswer = ({
  setAnswerData,
  answerData,
  answer,
  setAnswer,
  disabled,
  isCreating,
}) => {
  const ansToAnsData = (ans) => {
    const ansData = [...ans];
    ansData.sort((a, b) => a.localeCompare(b));
    return ansData;
  };

  const handleChange = (i, type) => {
    const newAns = [...answer];
    if (type === "up" && i >= 1) {
      [newAns[i], newAns[i - 1]] = [newAns[i - 1], newAns[i]];
    }
    if (type === "down" && i + 1 < newAns.length) {
      [newAns[i], newAns[i + 1]] = [newAns[i + 1], newAns[i]];
    }

    setAnswer([...newAns]);
  };

  const addOption = () => {
    const newAns = [...answer, "Опция"];
    setAnswer(newAns);
    setAnswerData(ansToAnsData(newAns));
  };
  const changeOptionName = (data, i) => {
    const newAns = [...answer];
    newAns[i] = data;
    setAnswer(newAns);
    setAnswerData(ansToAnsData(newAns));
  };
  const delOptionName = (i) => {
    if (answer.length > 1) {
      const newAns = [...answer];
      newAns.splice(i, 1);
      setAnswer(newAns);
      setAnswerData(ansToAnsData(newAns));
    }
  };
  console.log("aaa", answer);
  return (
    <div className="sorting-answer">
      {!isCreating && (
        <div className="for-user">
          {Array.isArray(answer) &&
            answer?.map((opt, i) => {
              return (
                <div className="option" key={i}>
                  <p>{opt}</p>
                  {!disabled && (
                    <div>
                      <span
                        className="up-down"
                        onClick={() => {
                          handleChange(i, "up");
                        }}
                      >
                        ↑
                      </span>
                      <span
                        className="up-down"
                        onClick={() => {
                          handleChange(i, "down");
                        }}
                      >
                        ↓
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {isCreating && (
        <div>
          {answer.map((opt, i) => {
            return (
              <div className="ch-option" key={i}>
                <textarea
                  value={opt}
                  className="ch-input"
                  onChange={(e) => {
                    changeOptionName(e.target.value, i, 0);
                  }}
                  disabled={disabled}
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
          <button onClick={addOption}>Добавить</button>
        </div>
      )}
    </div>
  );
};
export default SortingAnswer;
