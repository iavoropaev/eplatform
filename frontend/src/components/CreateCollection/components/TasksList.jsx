import Task from "../../Task/Task";

const TasksList = ({ tasks, swap, delTaskByIndex }) => {
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
            <Task
              key={task.id}
              taskData={task}
              sendAnswerToServer={() => {}}
              status=""
              hideAnswerBlock={true}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TasksList;
