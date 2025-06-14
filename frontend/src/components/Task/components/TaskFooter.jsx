import Answer from "../../Utils/Answer/Answer";
import { useState } from "react";
import HighlightedContent from "../../Utils/HighlightedContent";
import { getTaskSolution } from "../../../server/bank";
import { showError } from "../../Utils/Notifications";

const TaskFooter = ({
  taskData,
  taskAnswer,
  handleSaveButton,
  handleCancelButton,
  handleChooseScore,
  hideAnswerBlock,
  status,
  hideSolutionSection,
  buttonText,
}) => {
  const isAuth = localStorage.getItem("isAuth") !== null;

  const [solution, setSolution] = useState(undefined);
  const [hideSolution, setHideSolution] = useState(false);

  let defaultAnswer = "";
  if (taskData.answer_type === "table") {
    if (
      taskData?.number_in_exam?.answer_data?.table?.cols &&
      taskData?.number_in_exam?.answer_data?.table?.rows
    ) {
      const cols = taskData?.number_in_exam?.answer_data?.table?.cols;
      const rows = taskData?.number_in_exam?.answer_data?.table?.rows;
      defaultAnswer = Array.from({ length: rows }, () => Array(cols).fill(""));
    } else {
      defaultAnswer = [["", ""]];
    }
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

  const handleSendAnswer = async () => {
    const res = await handleSaveButton({
      taskId: taskData.id,
      answer: answer,
      type: taskData.answer_type,
    });
    return res;
  };

  const handleChooseScoreInFooter =
    handleChooseScore !== undefined
      ? (score) => {
          handleChooseScore({
            type: "score",
            taskId: taskData.id,
            answer: score,
          });
        }
      : undefined;

  const isAnswerSaveReady = (taskAnswer ? true : false) | isAnswerSave;
  const curAnswerData = taskAnswer ? taskAnswer[taskAnswer.type] : answer;

  let saveButText = buttonText?.[0] ? buttonText?.[0] : "Проверить ответ";
  if (isAnswerSaveReady) {
    saveButText = buttonText?.[1] ? buttonText?.[1] : "Проверить ответ";
  }

  if (status === "checking" && isAnswerSaveReady) {
    saveButText = "Проверка...";
  }
  if (status === "WA" && isAnswerSaveReady) {
    saveButText = "Неправильно";
  }
  if (status === "OK" && isAnswerSaveReady) {
    saveButText = "Верно";
  }
  if (status === "PA" && isAnswerSaveReady) {
    saveButText = "Частично верно";
  }

  const handleSolButton = async () => {
    if (!isAuth) {
      showError("Необходимо авторизоваться на сайте для доступа к решениям.");
      return;
    }
    if (status === undefined && taskData?.answer_type !== "no_answer") {
      await handleSendAnswer();
    }

    if (solution === undefined) {
      const res = await getTaskSolution(taskData.id);
      if (res !== undefined) {
        setSolution(res);
      }
    } else {
      setHideSolution(!hideSolution);
    }
  };

  let allAnswerData = {
    maxScore: taskData?.number_in_exam?.max_score
      ? taskData?.number_in_exam?.max_score
      : 1,
  };
  if (Array.isArray(taskData.answer_data)) {
    allAnswerData["options"] = taskData.answer_data;
  } else {
    allAnswerData = { ...allAnswerData, ...taskData.answer_data };
  }

  return (
    <div className="task-footer">
      <div className="answer">
        {!hideAnswerBlock && (
          <span className="input-with-but">
            <Answer
              type={taskData.answer_type}
              answerData={allAnswerData}
              answer={curAnswerData}
              setAnswer={setAnswer}
              handleChooseScore={handleChooseScoreInFooter}
              disabled={isAnswerSaveReady}
            />
            {taskData.answer_type !== "no_answer" && (
              <div className="buttons">
                <button
                  disabled={isAnswerSaveReady}
                  onClick={async () => {
                    handleSendAnswer();
                    setAnswerSave(true);
                  }}
                >
                  {saveButText}
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
                  Очистить
                </button>
              </div>
            )}
          </span>
        )}
        {/* 
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
        )} */}
      </div>

      {!hideSolutionSection && taskData.solution && (
        <div className="floor">
          {/* <span className="tags"> */}
          {/* <span className="tag">Комментарии</span> */}
          <button className="tag show-solution" onClick={handleSolButton}>
            Решение
          </button>
          {solution !== undefined && !hideSolution && (
            <div className="sol-cont">
              <HighlightedContent content={solution} />
            </div>
          )}
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
        </div>
      )}
    </div>
  );
};

export default TaskFooter;
