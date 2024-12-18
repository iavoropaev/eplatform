import { useEffect, useState } from "react";
import TinyMCE from "../../Utils/TinyMCE";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import TaskTags from "./components/TaskTags";
import "./CreateTask.css";
import Buttons from "./components/Buttons";
import {
  createTaskOnServer,
  getFilterData,
  getNumbers,
  getTaskById,
} from "../../../server/bank";

import { getPrepareFilterData } from "../../Utils/FilterUtils";
import { CheckBoxes } from "../../Utils/CheckBoxes";
import Answer from "../../Utils/Answer/Answer";
import { CustomSelect } from "../../Utils/CustomSelect";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId } = useParams();
  //const [searchParams, setSearchParams] = useSearchParams();
  const [countSave, setCountSave] = useState(0);
  const [loadStatus, setLoadStatus] = useState(0); // 0 - loading; 1 - ok, -1- error.
  //console.log(location);
  //const exam = searchParams.get("exam");
  //const subject = searchParams.get("subject");

  const [editorContent, setEditorContent] = useState("Начальный");
  const [answer, setAnswer] = useState("");
  const [answerType, setAnswerType] = useState("text");
  const [selectedExam, setSelectedExam] = useState(-1);
  const [selectedSubject, setSelectedSubject] = useState(-1);
  const [selectedNumber, setSelectedNumber] = useState(-1);
  const [selectedBanks, setSelectedBanks] = useState([]);

  //const [numbers, setNumbers] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const {
    exams,
    subjects,
    numbers,
    activeExam,
    activeSubject,
    activeNumber,
    bankAuthors,
  } = getPrepareFilterData({
    filterData,
    selectedExam,
    selectedSubject,
    selectedNumber,
  });

  console.log("BA", bankAuthors);

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
    console.log("USE EFFECT", location.pathname.includes("create-task"));
    if (location.pathname.includes("create-task")) {
      setDefault();
    }
  }, [location]);

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
      navigate(`../edit-task/${newTask.id}/`);
    }
  };

  const goToPrevTask = () => {
    navigate(`../edit-task/${Number(taskId) - 1}/`);
  };
  const goToNextTask = () => {
    navigate(`../edit-task/${Number(taskId) + 1}/`);
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
    <div className="container">
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

      <Buttons
        save={saveTaskOnServer}
        goToPrevTask={goToPrevTask}
        goToNextTask={goToNextTask}
      />
    </div>
  );
};
export default CreateTask;
