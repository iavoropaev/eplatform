import { BiDislike, BiLike } from "react-icons/bi";
import Answer from "../../../Utils/Answer/Answer";
import { useState } from "react";
import { SendButton } from "../../../Utils/Answer/SendButton";

const TaskFooter = ({ taskData, sendAnswerToServer }) => {
  let defaultAnswer = "";
  if (taskData.answer_type === "table") {
    defaultAnswer = [["", ""]];
  }

  const [answer, setAnswer] = useState(defaultAnswer);
  const handleSendAnswer = () => {
    sendAnswerToServer({
      taskId: taskData.id,
      answer: answer,
      type: taskData.answer_type,
    });
  };
  return (
    <div className="task-footer">
      <div className="answer">
        <span className="input-with-but">
          <Answer
            type={taskData.answer_type}
            answer={answer}
            setAnswer={setAnswer}
          />
          <SendButton handle={handleSendAnswer} />
        </span>
        <span className="author">{taskData?.author?.name}</span>
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
