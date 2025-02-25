import { NavLink } from "react-router-dom";

const TaskHeader = ({ taskData, showEditIcon }) => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  const difLevel = taskData?.difficulty_level?.name;
  const actuality = taskData?.actuality?.name;

  return (
    <div className="task-header">
      <span className="numberEGE">{taskData?.number_in_exam?.name}</span>
      <span className="tags">
        {difLevel && difLevel !== "Не указан" && (
          <span className="header-tag">{difLevel}</span>
        )}
        {actuality && actuality !== "Не указан" && (
          <span className="header-tag">{actuality}</span>
        )}
      </span>
      <span className="stat">
        {/* <span className="header-tag">{"Решило 125 чел."}</span> */}
        {/* <span className="header-tag">{"45%"}</span> */}
        <span className="header-tag">{taskData.id}</span>
        {(showEditIcon || isAdmin) && (
          <NavLink
            className="header-tag"
            target="_blank"
            to={`../edit-task/${taskData.id}/`}
          >
            E
          </NavLink>
        )}
      </span>
    </div>
  );
};

export default TaskHeader;
