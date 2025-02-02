import { NavLink } from "react-router-dom";

const TaskHeader = ({ taskData }) => {
  const difLevel = taskData?.difficulty_level?.name;
  const actuality = taskData?.actuality?.name;

  return (
    <div className="task-header">
      <span className="numberEGE">{taskData.number_in_exam.name}</span>
      <span className="tags">
        {difLevel && <span className="header-tag">{difLevel}</span>}
        {actuality && <span className="header-tag">{actuality}</span>}
      </span>
      <span className="stat">
        {/* <span className="header-tag">{"Решило 125 чел."}</span> */}
        {/* <span className="header-tag">{"45%"}</span> */}
        <span className="header-tag">{taskData.id}</span>
        <NavLink
          className="header-tag"
          target="_blank"
          to={`../edit-task/${taskData.id}/`}
        >
          E
        </NavLink>
      </span>
    </div>
  );
};

export default TaskHeader;
