const Buttons = ({ save, goToPrevTask, goToNextTask }) => {
  return (
    <div>
      <span>
        <button onClick={goToPrevTask}>Предыдущая</button>
        <button onClick={goToNextTask}>Следующая</button>
      </span>
    </div>
  );
};
export default Buttons;
