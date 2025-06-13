import { useState } from "react";
import { getTaskFromKompEGE, saveFileByUrl } from "../../../server/bank";
import {
  downloadFileAsBlob,
  sendFileToBackend,
} from "../../Utils/Server/serverUtils";

const LoadFromKompEGE = ({ taskData }) => {
  const [taskId, setTaskId] = useState("");

  const handleChange = (e) => {
    setTaskId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await getTaskFromKompEGE(taskId);
    console.log(res);
    if (res !== undefined) {
      taskData.setEditorContent(res.text);

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

      //   Files
      const fileRes = await saveFileByUrl(
        "https://kompege.ru/files/JLuOGrtDc8.txt"
      );
      console.log(fileRes);
    }
    setTaskId("");
  };

  return (
    <div>
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
