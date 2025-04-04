const TextAnswer = ({ answer, setAnswer, disabled }) => {
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
