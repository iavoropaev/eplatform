const TableAnswer = ({ answer, setAnswer }) => {
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

  const f = (e) => {
    e.preventDefault();
    console.log(e.clipboardData.getData("Text"));
  };

  return (
    <div>
      <table border="1">
        <thead></thead>
        <tbody>
          {answer.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell}
                    onPaste={f}
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
      <button onClick={addRow}>+</button>
      <button onClick={delRow}>-</button>
    </div>
  );
};

export default TableAnswer;
