const OpenAnswer = ({ answer, setAnswer, disabled, isCreating }) => {
  if (isCreating) {
    return <></>;
  }
  return (
    <div className="answer">
      <details>
        <summary>Ответ</summary>
        <textarea
          disabled={disabled}
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
          value={answer}
          placeholder="Введите ответ..."
        ></textarea>
      </details>
    </div>
  );
};
export default OpenAnswer;
