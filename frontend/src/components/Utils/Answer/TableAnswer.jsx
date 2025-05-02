import "./TableAnswer.css";
const TableAnswer = ({ answer, setAnswer, disabled }) => {
  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedTable = [...answer];
    updatedTable[rowIndex][colIndex] = value;
    setAnswer(updatedTable);
  };

  const addRow = () => {
    if (answer.length < 15) {
      const length = answer[answer.length - 1].length;
      const newRow = Array(length).fill("");
      setAnswer([...answer, newRow]);
    }
  };
  const delRow = () => {
    if (answer.length > 1) {
      const newAns = [...answer];
      newAns.pop();
      setAnswer(newAns);
    }
  };

  const addColumn = () => {
    if (answer[0].length < 8) {
      const newAns = answer.map((row) => {
        const newRow = [...row, ""];
        return newRow;
      });
      setAnswer(newAns);
    }
  };
  const delColumn = () => {
    if (answer.length >= 1) {
      const newAns = answer.map((row) => {
        if (row.length > 1) {
          const newRow = row.slice(0, -1);
          return newRow;
        } else {
          return row;
        }
      });
      setAnswer(newAns);
    }
  };

  const paste = (e, i_start, j_start) => {
    e.preventDefault();
    const text = e.clipboardData.getData("Text");
    const numbers = text.split(/\s+/);
    const updatedTable = [...answer];
    let k = 0;

    for (let i = i_start; i < answer.length; i++) {
      for (let j = j_start; j < answer[i].length; j++) {
        if (k < numbers.length) {
          updatedTable[i][j] = numbers[k];
          k = k + 1;
        }
      }
    }

    setAnswer([...updatedTable]);
  };

  return (
    <div>
      <div className="answer-table">
        <table>
          <thead></thead>
          <tbody>
            {Array.isArray(answer) &&
              answer?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* <td>{rowIndex + 1}</td> */}
                  {Array.isArray(row) &&
                    row?.map((cell, colIndex) => (
                      <td key={colIndex}>
                        <input
                          className="table-input"
                          disabled={disabled}
                          type="text"
                          value={cell}
                          onPaste={(e) => {
                            paste(e, rowIndex, colIndex);
                          }}
                          onChange={(e) =>
                            handleInputChange(
                              rowIndex,
                              colIndex,
                              e.target.value
                            )
                          }
                        />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
        {!disabled && (
          <div className="right-buttons">
            <button
              className="answer-but"
              onClick={addColumn}
              disabled={disabled}
            >
              +
            </button>
            <button
              className="answer-but"
              onClick={delColumn}
              disabled={disabled}
            >
              -
            </button>
          </div>
        )}
      </div>
      {!disabled && (
        <div className="answer-buttons">
          <button className="answer-but" onClick={addRow} disabled={disabled}>
            +
          </button>
          <button className="answer-but" onClick={delRow} disabled={disabled}>
            -
          </button>
        </div>
      )}
    </div>
  );
};

export default TableAnswer;
