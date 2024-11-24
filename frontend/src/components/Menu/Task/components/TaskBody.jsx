const TaskBody = ({ taskData }) => {
  return (
    <div className="task-body innerhtml">
      <div dangerouslySetInnerHTML={{ __html: taskData.content }}></div>
    </div>
  );
};

export default TaskBody;
