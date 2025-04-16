import { useState } from "react";
import Task from "../../Task/Task";

const TasksList = ({ tasks, swap, delTaskByIndex, handleAddTaskByIdBut }) => {
  const [newIds, setNewIds] = useState({});

  const handleInputChange = (i, value) => {
    setNewIds({ ...newIds, [i]: value });
  };

  return (
    <div className="tasks-cont">
      {tasks.map((task, i) => {
        return (
          <div className="cc-task" key={task.id}>
            <div className="navigate">
              <span
                onClick={() => {
                  delTaskByIndex(i);
                }}
                className="delete"
              >
                ⨉
              </span>
              <span
                onClick={() => {
                  swap(i, i - 1);
                }}
                className="arrow"
              >
                ↑
              </span>
              <span
                onClick={() => {
                  swap(i, i + 1);
                }}
                className="arrow"
              >
                ↓
              </span>
            </div>
            <div className="task-swap-cont">
              <Task
                key={task.id}
                taskData={task}
                sendAnswerToServer={() => {}}
                status=""
                hideAnswerBlock={true}
              />
              <div className="swap-cont">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTaskByIdBut(i, newIds[i]);
                    handleInputChange(i, "");
                  }}
                >
                  <input
                    value={newIds[i] || ""}
                    onChange={(e) => {
                      handleInputChange(i, e.target.value);
                    }}
                    placeholder="Заменить задачу по ID"
                  ></input>
                  <button>Заменить</button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TasksList;
