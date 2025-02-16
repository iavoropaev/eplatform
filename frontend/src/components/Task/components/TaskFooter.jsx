// import { BiDislike, BiLike } from "react-icons/bi";
import Answer from "../../Utils/Answer/Answer";
import { useState } from "react";

const TaskFooter = ({
  taskData,
  taskAnswer,
  handleSaveButton,
  handleCancelButton,
  hideAnswerBlock,
}) => {
  let defaultAnswer = "";
  if (taskData.answer_type === "table") {
    defaultAnswer = [["", ""]];
  }
  if (taskData.answer_type === "choice") {
    defaultAnswer = [];
  }
  if (taskData.answer_type === "comparison") {
    defaultAnswer = [];
    taskData.answer_data.left.forEach((el, i) => {
      defaultAnswer.push([
        taskData.answer_data.left[i],
        taskData.answer_data.right[i],
      ]);
    });
  }
  if (taskData.answer_type === "sorting") {
    defaultAnswer = [...taskData.answer_data];
  }

  const [answer, setAnswer] = useState(defaultAnswer);
  const [isAnswerSave, setAnswerSave] = useState(false);

  const handleSendAnswer = () => {
    handleSaveButton({
      taskId: taskData.id,
      answer: answer,
      type: taskData.answer_type,
    });
  };

  const isAnswerSaveReady = (taskAnswer ? true : false) | isAnswerSave;
  const curAnswerData = taskAnswer ? taskAnswer[taskAnswer.type] : answer;

  return (
    <div className="task-footer">
      <div className="answer">
        {!hideAnswerBlock && (
          <span className="input-with-but">
            <Answer
              type={taskData.answer_type}
              answerData={taskData.answer_data}
              answer={curAnswerData}
              setAnswer={setAnswer}
              disabled={isAnswerSaveReady}
            />
            <div className="buttons">
              <button
                disabled={isAnswerSaveReady}
                onClick={() => {
                  handleSendAnswer();
                  setAnswerSave(true);
                }}
              >
                Проверить ответ
              </button>

              <button
                onClick={() => {
                  if (handleCancelButton) {
                    handleCancelButton();
                  }
                  setAnswer(defaultAnswer);
                  setAnswerSave(false);
                }}
              >
                Отчистить
              </button>
            </div>
          </span>
        )}

        {taskData?.author?.link ? (
          <a
            target="_blank"
            href={taskData?.author?.link}
            className="author"
            rel="noopener noreferrer"
          >
            {taskData?.author?.name}
          </a>
        ) : (
          <span className="author">
            {taskData?.author?.name !== "Не указан"
              ? taskData?.author?.name
              : ""}
          </span>
        )}
      </div>

      {/* <div className="floor"> */}
      {/* <span className="tags"> */}
      {/* <span className="tag">Комментарии</span> */}
      {/* <span className="tag show-solution">Решение</span> */}
      {/* </span> */}
      {/* <span className="tag likes">
          <span className="like">
            <span>120</span>
            <BiLike />
          </span>
          <span className="dislike">
            <BiDislike />
            <span>20</span>
          </span>
        </span> */}
      {/* </div> */}
    </div>
  );
};

export default TaskFooter;
