const SingleAnswer = ({ answer }) => {
  return (
    <>
      {answer.type === "text" && answer.text}
      {answer.type === "table" && (
        <table>
          <tbody>
            {answer?.table?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row?.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default SingleAnswer;
