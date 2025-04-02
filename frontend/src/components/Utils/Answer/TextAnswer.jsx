const TextAnswer = ({ answer, setAnswer, disabled }) => {
  console.log("AAAAA", answer);
  return (
    <div className="answer text-answer">
      <input
        disabled={disabled}
        onChange={(e) => {
          setAnswer(e.target.value);
        }}
        value={answer}
        placeholder="Введите ответ..."
      ></input>
    </div>
  );
};
export default TextAnswer;
