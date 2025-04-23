import { NavLink } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";

const TaskHeader = ({ taskData, showEditIcon, hideTaskInfo }) => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  const difLevel = taskData?.difficulty_level?.name;
  const actuality = taskData?.actuality?.name;

  return (
    <div className="task-header">
      <span className="numberEGE">{taskData?.number_in_exam?.name}</span>
      <span className="tags">
        {hideTaskInfo !== true && difLevel && difLevel !== "Не указан" && (
          <span className="header-tag">{difLevel}</span>
        )}
        {hideTaskInfo !== true && actuality && actuality !== "Не указан" && (
          <span className="header-tag">{actuality}</span>
        )}
      </span>
      <span className="stat">
        {hideTaskInfo !== true && (
          <span className="header-tag">{taskData.id}</span>
        )}

        {(showEditIcon || isAdmin) && (
          <NavLink
            className="header-tag"
            target="_blank"
            to={`../edit-task/${taskData.id}/`}
          >
            <MdModeEdit color="black" />
          </NavLink>
        )}
      </span>
    </div>
  );
};

export default TaskHeader;
