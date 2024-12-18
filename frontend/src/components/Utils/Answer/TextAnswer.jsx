const TextAnswer = ({ answer, setAnswer }) => {
  return (
    <div className="answer">
      <p>Ответ</p>
      <input
        onChange={(e) => {
          setAnswer(e.target.value);
        }}
        value={answer}
      ></input>
    </div>
  );
};
export default TextAnswer;
