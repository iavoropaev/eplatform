import "./TableAnswer.css";
const TableAnswer = ({ answer, setAnswer, disabled }) => {
  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedTable = [...answer];
    updatedTable[rowIndex][colIndex] = value;
    setAnswer(updatedTable);
  };

  const addRow = () => {
    const length = answer[answer.length - 1].length;
    const newRow = Array(length).fill("");
    setAnswer([...answer, newRow]);
  };
  const delRow = () => {
    if (answer.length > 1) {
      const newAns = [...answer];
      newAns.pop();
      setAnswer(newAns);
    }
  };

  const paste = (e, i_start, j_start) => {
    e.preventDefault();
    const text = e.clipboardData.getData("Text");
    const numbers = text.split(/\s+/);
    const updatedTable = [...answer];
    let k = 0;
    console.log(numbers, i_start, j_start);
    for (let i = i_start; i < answer.length; i++) {
      for (let j = j_start; j < answer[i].length; j++) {
        if (k < numbers.length) {
          updatedTable[i][j] = numbers[k];
          k = k + 1;
          console.log(1);
        }
      }
    }
    console.log(updatedTable);
    setAnswer([...updatedTable]);
  };

  return (
    <div className="answer-table">
      <table border="1">
        <thead></thead>
        <tbody>
          {answer.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* <td>{rowIndex + 1}</td> */}
              {row.map((cell, colIndex) => (
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
                      handleInputChange(rowIndex, colIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
