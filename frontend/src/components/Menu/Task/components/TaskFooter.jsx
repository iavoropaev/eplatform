import { BiDislike, BiLike } from "react-icons/bi";

const TaskFooter = ({ taskData }) => {
  return (
    <div className="task-footer">
      <div className="answer">
        <span className="input-with-but">
          <input placeholder="Введите ответ.."></input>
          <button>Проверить ответ</button>
        </span>
        <span className="author">{taskData.author.name}</span>
      </div>

      <div className="floor">
        <span className="tags">
          <span className="tag">Комментарии</span>
          <span className="tag">Решения</span>
        </span>
        <span className="tag likes">
          <span className="like">
            <span>120</span>
            <BiLike />
          </span>
          <span className="dislike">
            <BiDislike />
            <span>20</span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default TaskFooter;
