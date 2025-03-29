import TaskTags from "./components/TaskTags";
import Answer from "../Utils/Answer/Answer";
import { CustomSelect } from "../Utils/CustomSelect";
import { TinyMCE } from "../Utils/TinyMCE";
import { CheckBoxes } from "../Utils/CheckBoxes";
import "./CreateTask.css";
import { useState } from "react";
import { uploadFile } from "../../server/user";
import { FaRegTrashCan } from "react-icons/fa6";
import { showError } from "../Utils/Notifications";

const CreateTask = ({ taskData, handleSaveButton, loadStatus }) => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  const [file, setFile] = useState(null);

  const handleAnswerTypeSelect = (e) => {
    const type = e.target.value;
    taskData.setAnswerType(type);

    if (type === "text") {
      taskData.setAnswer("");
      taskData.setAnswerData(null);
    }
    if (type === "table") {
      taskData.setAnswer([["", ""]]);
      taskData.setAnswerData(null);
    }
    if (type === "choice") {
      taskData.setAnswer([]);
      taskData.setAnswerData(["Опция 1"]);
    }
    if (type === "comparison") {
      taskData.setAnswer([["Опция 1", "Ответ 1"]]);
      taskData.setAnswerData({ left: ["Опция 1"], right: ["Ответ 1"] });
    }
    if (type === "sorting") {
      taskData.setAnswer(["Опция 1", "Опция 2"]);
      taskData.setAnswerData(["Опция 1", "Опция 2"]);
    }
    if (type === "open_answer") {
      taskData.setAnswer("");
      taskData.setAnswerData(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file.size > 50 * 1024 * 1024) {
      showError("Файл слишком большой. Максимальный размер файла — 50 Мбайт.");
      return;
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      showError("Файл слишком большой. Максимальный размер файла — 50 Мбайт.");
      return;
    }

    const res = await uploadFile(file);
    if (res !== undefined) {
      taskData.setFiles([...taskData.files, res]);
    } else {
      showError("Файл не был сохранён.");
    }
  };
  const handleFileErase = (fileId) => {
    taskData.setFiles(taskData.files.filter((file) => file.id !== fileId));
  };

  if (taskData.taskId && loadStatus === -1) {
    return <h2>Задача не найдена</h2>;
  }
  if (taskData.taskId && loadStatus === 0) {
    return <h2>Загрузка...</h2>;
  }

  console.log("files", taskData.files, file);
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
        {taskData.taskAuthors.length > 0 && (
          <TaskTags
            name={"Автор"}
            options={taskData.taskAuthors}
            selectedOption={taskData.selectedTaskAuthor}
            setSelectedOption={taskData.setSelectedTaskAuthor}
          />
        )}
      </div>

      {isAdmin && (
        <CheckBoxes
          selectedBanks={taskData.selectedBanks}
          bankAuthors={taskData.bankAuthors}
          setSelectedBanks={taskData.setSelectedBanks}
        />
      )}

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
            ["choice", "Тестовый ответ"],
            ["comparison", "Сопоставление"],
            ["sorting", "Сортировка"],
            ["open_answer", "Свободный ответ"],
          ]}
          selected={taskData.answerType}
          handleSelect={handleAnswerTypeSelect}
        />
        <Answer
          type={taskData.answerType}
          answer={taskData.answer}
          answerData={taskData.answerData}
          setAnswer={(ans) => {
            taskData.setAnswer(ans);
          }}
          setAnswerData={(ansdata) => {
            taskData.setAnswerData(ansdata);
          }}
          isCreating={true}
        />
        {taskData.answerType === "text" && (
          <div className="text-answer-explanation">
            <p>
              При проверке ответа регистр учитывается. Если правильный ответ
              "ДОМ", то ответ "дом" будет считаться неправильным.
            </p>
            <p>
              Чтобы добавить несколько правильных ответов – разделите их с
              помощью символа вертикальной черты | (без пробелов). Например,
              12|13|14.
            </p>
          </div>
        )}
      </div>

      <div className="upload-files">
        <p className="title">Загрузка файлов</p>
        <div className="file-control">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
          {file !== null && (
            <button onClick={handleFileUpload}>Загрузить</button>
          )}
        </div>
        <div className="files-list">
          <p className="title">Загруженные файлы</p>
          {taskData.files.map((file) => {
            return (
              <div key={file.id} className="file-item">
                <a
                  href={`${file.location}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.name}
                </a>
                <button
                  onClick={() => {
                    handleFileErase(file.id);
                  }}
                >
                  <FaRegTrashCan />
                </button>
              </div>
            );
          })}
        </div>
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
