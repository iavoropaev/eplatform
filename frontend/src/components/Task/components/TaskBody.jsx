import HighlightedContent from "../../Utils/HighlightedContent";

const TaskBody = ({ taskData }) => {
  return (
    <div className="task-body innerhtml">
      <HighlightedContent content={taskData.content} />
    </div>
  );
};

export default TaskBody;
