import TaskTags from "./components/TaskTags";
import Answer from "../Utils/Answer/Answer";
import { CustomSelect } from "../Utils/CustomSelect";
import TinyMCE from "../Utils/TinyMCE";
import { CheckBoxes } from "../Utils/CheckBoxes";
import "./CreateTask.css";

const CreateTask = ({ taskData, handleSaveButton, loadStatus }) => {
  const handleAnswerTypeSelect = (e) => {
    const type = e.target.value;
    taskData.setAnswerType(type);

    if (type === "text") {
      taskData.setAnswer("");
    }
    if (type === "table") {
      taskData.setAnswer([["", ""]]);
    }
  };

  if (taskData.taskId && loadStatus === -1) {
    return <h2>Задача не найдена</h2>;
  }
  if (taskData.taskId && loadStatus === 0) {
    return <h2>Загрузка...</h2>;
  }

  return (
    <div className="create-task">
      {taskData?.taskId && (
        <p className="task-id">{`Задача ${taskData.taskId}.`}</p>
      )}

      <div className="tags">
        <TaskTags
          name={"Экзамен"}
          options={taskData.exams}
          selectedOption={taskData.selectedExam}
          setSelectedOption={taskData.setSelectedExam}
        />
        {taskData.subjects.length > 0 && (
          <TaskTags
            name={"Предмет"}
            options={taskData.subjects}
            selectedOption={taskData.selectedSubject}
            setSelectedOption={taskData.setSelectedSubject}
          />
        )}
        {taskData.numbers.length > 0 && (
          <TaskTags
            name={"Номер"}
            options={taskData.numbers}
            selectedOption={taskData.selectedNumber}
            setSelectedOption={taskData.setSelectedNumber}
          />
        )}
      </div>
      <div className="tags">
        {taskData.actualities.length > 0 && (
          <TaskTags
            name={"Актуальность"}
            options={taskData.actualities}
            selectedOption={taskData.selectedActuality}
            setSelectedOption={taskData.setSelectedActuality}
          />
        )}
        {taskData.difficulty_levels.length > 0 && (
          <TaskTags
            name={"Сложность"}
            options={taskData.difficulty_levels}
            selectedOption={taskData.selectedDifLevel}
            setSelectedOption={taskData.setSelectedDifLevel}
          />
        )}
      </div>

      <CheckBoxes
        selectedBanks={taskData.selectedBanks}
        bankAuthors={taskData.bankAuthors}
        setSelectedBanks={taskData.setSelectedBanks}
      />

      <div className="editor-container">
        <p className="editor-label">Условие задачи</p>
        <TinyMCE
          editorContent={taskData.editorContent}
          setEditorContent={(c) => {
            taskData.setEditorContent(c);
          }}
        />
      </div>

      <div className="answer">
        <p className="answer-label">Ответ</p>
        <CustomSelect
          options={[
            ["text", "Текст"],
            ["table", "Таблица"],
          ]}
          selected={taskData.answerType}
          handleSelect={handleAnswerTypeSelect}
        />
        <Answer
          type={taskData.answerType}
          answer={taskData.answer}
          setAnswer={(ans) => {
            taskData.setAnswer(ans);
          }}
        />
      </div>
      <div className="save-button">
        <button onClick={handleSaveButton} className="black-button">
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
