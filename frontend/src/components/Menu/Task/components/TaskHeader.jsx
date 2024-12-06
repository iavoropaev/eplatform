const TaskHeader = ({ taskData }) => {
  return (
    <div className="task-header">
      <span className="numberEGE">
        {"№ " + taskData.number_in_exam.name + " ЕГЭ"}
      </span>
      <span className="tags">
        <span className="header-tag">{taskData.difficulty_level.name}</span>
        {/* <span className="header-tag">{taskData.actuallity.name}</span> */}
        <span className="header-tag">{taskData.difficulty_level.name}</span>
        {/* <span className="header-tag">{taskData.actuallity.name}</span> */}
      </span>
      <span className="stat">
        <span className="header-tag">{"Решило 125 чел."}</span>
        <span className="header-tag">{"45%"}</span>
      </span>
    </div>
  );
};

export default TaskHeader;
