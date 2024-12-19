import { useEffect, useState } from "react";
import TaskTags from "./components/TaskTags";
import Answer from "../Utils/Answer/Answer";
import { CustomSelect } from "../Utils/CustomSelect";
import TinyMCE from "../Utils/TinyMCE";
import { CheckBoxes } from "../Utils/CheckBoxes";
import {
  createTaskOnServer,
  getFilterData,
  getTaskById,
} from "../../server/bank";
import { getPreparedFilterData } from "../Utils/FilterUtils";

const CreateTask = ({ taskId, afterSave }) => {
  const [countSave, setCountSave] = useState(0);
  const [loadStatus, setLoadStatus] = useState(0); // 0 - loading; 1 - ok, -1- error.

  const [editorContent, setEditorContent] = useState("Начальный");
  const [answer, setAnswer] = useState("");
  const [answerType, setAnswerType] = useState("text");
  const [selectedExam, setSelectedExam] = useState(-1);
  const [selectedSubject, setSelectedSubject] = useState(-1);
  const [selectedNumber, setSelectedNumber] = useState(-1);
  const [selectedBanks, setSelectedBanks] = useState([]);

  const [filterData, setFilterData] = useState([]);

  const {
    exams,
    subjects,
    numbers,
    activeExam,
    activeSubject,
    activeNumber,
    bankAuthors,
  } = getPreparedFilterData({
    filterData,
    selectedExam,
    selectedSubject,
    selectedNumber,
  });

  const setDefault = () => {
    setEditorContent("Начальный");
    setAnswer("");
    setAnswerType("text");
    setSelectedNumber(-1);
    setSelectedExam(-1);
    setSelectedSubject(-1);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getFilterData();
      setFilterData(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await getTaskById(taskId);
      if (data !== undefined && filterData.length > 0) {
        setEditorContent(data.content);
        setAnswer(data.answer);
        setAnswerType(data.answer_type);
        const numberId = data.number_in_exam.id;
        const subjectId = data.number_in_exam.subject.id;
        const examId = data.number_in_exam.subject.exam.id;
        const bankAuthors = data.bank_authors.map((el) => el.id);
        setSelectedExam(examId);
        setSelectedSubject(subjectId);
        setSelectedNumber(numberId);
        setSelectedBanks(bankAuthors);
        setLoadStatus(1);
      } else {
        if (filterData.length > 0) {
          setLoadStatus(-1);
        } else {
          setLoadStatus(0);
        }
      }
    }

    if (taskId) {
      fetchData();
      console.log("Download task");
    } else {
      setDefault();
    }
  }, [taskId, filterData, countSave]);

  const saveTaskOnServer = async () => {
    const newTask = await createTaskOnServer({
      content: editorContent,
      answer: JSON.stringify(answer),
      answer_type: answerType,
      number_in_exam: activeNumber.id,
      taskId: taskId,
      bank_authors: selectedBanks,
    });
    if (newTask !== undefined) {
      setCountSave(countSave + 1);
      afterSave(newTask.id);
      //navigate(`../edit-task/${newTask.id}/`);
    }
  };

  const handleAnswerTypeSelect = (e) => {
    const type = e.target.value;
    setAnswerType(type);
    if (type === "text") {
      setAnswer("");
    }
    if (type === "table") {
      setAnswer([["", ""]]);
    }
  };

  if (taskId && loadStatus === -1) {
    return <h2>Задача не найдена</h2>;
  }
  if (taskId && loadStatus === 0) {
    return <h2>Загрузка...</h2>;
  }
  return (
    <>
      <div className="tags">
        <TaskTags
          name={"Экзамен"}
          options={exams}
          selectedOption={selectedExam}
          setSelectedOption={setSelectedExam}
        />
        <TaskTags
          name={"Предмет"}
          options={subjects}
          selectedOption={selectedSubject}
          setSelectedOption={setSelectedSubject}
        />

        <TaskTags
          name={"Номер"}
          options={numbers}
          selectedOption={selectedNumber}
          setSelectedOption={setSelectedNumber}
        />
      </div>

      <CheckBoxes
        selectedBanks={selectedBanks}
        bankAuthors={bankAuthors}
        setSelectedBanks={setSelectedBanks}
      />

      <TinyMCE
        editorContent={editorContent}
        setEditorContent={setEditorContent}
      />
      <CustomSelect
        options={["text", "table"]}
        selected={answerType}
        handleSelect={handleAnswerTypeSelect}
      />

      <Answer type={answerType} answer={answer} setAnswer={setAnswer} />
      <button onClick={saveTaskOnServer}>Сохранить</button>
    </>
  );
};

export default CreateTask;
