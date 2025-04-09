const ComparisonAnswer = ({
  setAnswerData,
  answerData,
  answer,
  setAnswer,
  disabled,
  isCreating,
}) => {
  const ansToAnsData = (ans) => {
    const ansData = { left: [], right: [] };
    ans.forEach((el) => {
      ansData.left.push(el[0]);
      ansData.right.push(el[1]);
    });
    ansData.right.sort((a, b) => a.localeCompare(b));
    return ansData;
  };

  const handleChange = (i, type) => {
    const newAns = [...answer.map((row) => [...row])];
    if (type === "up" && i >= 1) {
      [newAns[i][1], newAns[i - 1][1]] = [newAns[i - 1][1], newAns[i][1]];
    }
    if (type === "down" && i + 1 < newAns.length) {
      [newAns[i][1], newAns[i + 1][1]] = [newAns[i + 1][1], newAns[i][1]];
    }

    setAnswer([...newAns.map((row) => [...row])]);
  };

  const addOption = () => {
    const newAns = [...answer, ["Опция", "Ответ"]];
    setAnswer(newAns);
    setAnswerData(ansToAnsData(newAns));
  };
  const changeOptionName = (data, i, j) => {
    const newAns = [...answer];
    newAns[i][j] = data;
    setAnswer(newAns);
    setAnswerData(ansToAnsData(newAns));
  };
  const delOptionName = (i) => {
    const newAns = [...answer];
    newAns.splice(i, 1);
    setAnswer(newAns);
    setAnswerData(ansToAnsData(newAns));
  };

  return (
    <div className="comparison-answer">
      {!isCreating &&
        Array.isArray(answer) &&
        answer?.map((opt, i) => {
          return (
            <div className="comp-option" key={i}>
              <p className="option-left">{opt[0]}</p>
              <hr></hr>
              <div className="option-right">
                <p>{opt[1]}</p>

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
            </div>
          );
        })}

      {isCreating && (
        <div>
          {answer.map((opt, i) => {
            return (
              <div className="ch-option" key={i}>
                <textarea
                  value={opt[0]}
                  className="ch-input"
                  checked={answer.includes(i)}
                  onChange={(e) => {
                    changeOptionName(e.target.value, i, 0);
                  }}
                  disabled={disabled}
                ></textarea>
                <textarea
                  value={opt[1]}
                  onChange={(e) => {
                    changeOptionName(e.target.value, i, 1);
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
          <button onClick={addOption}>Добавить</button>
        </div>
      )}
    </div>
  );
};
export default ComparisonAnswer;
