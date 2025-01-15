const TextAnswer = ({ answer, setAnswer, disabled }) => {
  return (
    <div className="answer">
      <p>Ответ</p>
      <input
        disabled={disabled}
        onChange={(e) => {
          setAnswer(e.target.value);
        }}
        value={answer}
      ></input>
    </div>
  );
};
export default TextAnswer;
