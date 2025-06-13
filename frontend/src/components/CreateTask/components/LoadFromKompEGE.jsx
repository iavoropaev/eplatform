import { useState } from "react";
import { getTaskFromKompEGE, saveFileByUrl } from "../../../server/bank";
import "./LoadFromKompEGE.css";
import { showOK } from "../../Utils/Notifications";

const LoadFromKompEGE = ({ taskData }) => {
  const [taskId, setTaskId] = useState("");

  const handleChange = (e) => {
    setTaskId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await getTaskFromKompEGE(taskId);

    if (res !== undefined) {
      taskData.setEditorContent(res.text);
      taskData.setSelectedExam(2);
      taskData.setSelectedSubject(1);
      taskData.setSelectedActuality(1);
      taskData.setSelectedTaskAuthor(4);
      taskData.setSelectedNumber(res.number + 1);
      taskData.setSolution("");
      taskData.setSelectedDifLevel(-1);
      taskData.setSelectedBanks([]);
      taskData.setAnswerData([]);

      // Answer
      if (Object.keys(res.table).length === 0) {
        taskData.setAnswerType("text");
        taskData.setAnswer(res.key);
      } else {
        taskData.setAnswerType("table");

        const formatted = res.key.replace(/\\n/g, "\n");
        const list = formatted
          .trim()
          .split("\n")
          .map((line) => line.split(" "));
        taskData.setAnswer(list);
      }

      // Files
      const newFiles = [];
      for (let file of res.files) {
        const fileRes = await saveFileByUrl("https://kompege.ru/" + file.url);
        newFiles.push(fileRes);
      }
      taskData.setFiles([...newFiles]);
    }
    showOK("Загружено!");
    setTaskId("");
  };

  return (
    <div className="load-from-kompege">
      <form onSubmit={handleSubmit}>
        <input
          value={taskId}
          onChange={handleChange}
          placeholder="Id c КомпЕГЭ"
        />
        <button type="submit">Загрузить</button>
      </form>
    </div>
  );
};

export default LoadFromKompEGE;
