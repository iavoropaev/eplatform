const ChoiceScore = ({
  answerData,
  answer,
  setAnswer,
  disabled,
  isCreating,
}) => {
  const handleChange = (i) => {
    setAnswer(i.target.value);
  };
  const N = answerData?.maxScore ? answerData?.maxScore : 1;
  const options = Array.from({ length: N + 1 }, (_, i) => i);
  return (
    <div className="answer-choice">
      {
        <>
          <span>Выберите балл </span>
          <select value={answer} onChange={handleChange}>
            {options.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </>
      }
    </div>
  );
};
export default ChoiceScore;
