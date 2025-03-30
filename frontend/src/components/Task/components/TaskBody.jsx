import HighlightedContent from "../../Utils/HighlightedContent";

const TaskBody = ({ taskData }) => {
  return (
    <div className="task-body innerhtml">
      <HighlightedContent content={taskData.content} />
      {taskData?.files?.length > 0 && (
        <div className="files-cont">
          <p className="f-title">Файлы:</p>
          <div className="files-list">
            {taskData.files.map((file, i) => (
              <span key={i}>
                <a
                  href={`${file.location}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.name}
                </a>
                {i < taskData.files.length - 1 && ", "}
                {i === taskData.files.length - 1 && "."}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBody;
