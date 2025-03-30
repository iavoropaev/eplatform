import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./CreateTaskPage.css";
import CreateTask from "../../CreateTask/CreateTask";
import { useEffect, useState } from "react";
import {
  createTaskOnServer,
  getFilterData,
  getTaskById,
  getTaskWithAnsById,
} from "../../../server/bank";
import { getPreparedFilterData } from "../../Utils/FilterUtils";

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const [countSave, setCountSave] = useState(0);
  const [loadStatus, setLoadStatus] = useState(0); // 0 - loading; 1 - ok, -1- error.
  const [showSaveText, setShowSaveText] = useState(false);

  const [editorContent, setEditorContent] = useState("Начальный");
  const [solution, setSolution] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerType, setAnswerType] = useState("text");
  const [answerData, setAnswerData] = useState(["Опция 1"]);

  const [selectedExam, setSelectedExam] = useState(-1);
  const [selectedSubject, setSelectedSubject] = useState(-1);
  const [selectedNumber, setSelectedNumber] = useState(-1);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedDifLevel, setSelectedDifLevel] = useState(-1);
  const [selectedTaskAuthor, setSelectedTaskAuthor] = useState(-1);
  const [selectedActuality, setSelectedActuality] = useState(-1);
  const [files, setFiles] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const {
    exams,
    subjects,
    numbers,
    activeExam,
    activeSubject,
    activeNumber,
    activeAuthor,
    bankAuthors,
    taskAuthors,
    actualities,
    difficulty_levels,
  } = getPreparedFilterData({
    filterData,
    selectedExam,
    selectedSubject,
    selectedNumber,
    selectedTaskAuthor,
  });

  const setDefault = () => {
    setEditorContent("Начальный");
    setAnswer("");
    setAnswerType("text");
    setAnswerData(["Опция 1"]);
    setSelectedBanks([]);

    setSelectedNumber(-1);
    setSelectedExam(-1);
    setSelectedSubject(-1);
    setSelectedDifLevel(-1);
    setSelectedTaskAuthor(-1);
    setSelectedActuality(-1);
    setFiles([]);
    setSolution("");
  };
  const notify = (text) => toast.success(text);
  const showError = (text) => toast.error(text);

  useEffect(() => {
    async function fetchData() {
      const data = await getFilterData();
      setFilterData(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await getTaskWithAnsById(taskId);

      if (data !== undefined && filterData?.exams?.length > 0) {
        console.log(data);
        setEditorContent(data.content);
        setAnswer(data.answer);
        setAnswerType(data.answer_type);
        setAnswerData(data.answer_data);
        const numberId = data.number_in_exam?.id;
        const subjectId = data.number_in_exam?.subject?.id;
        const examId = data.number_in_exam?.subject?.exam?.id;
        console.log("res", data.bank_authors);
        const bankAuthors = data.bank_authors.map((el) => el.id);
        const taskAuthor = data.author?.id;
        setSelectedTaskAuthor(taskAuthor);
        setSelectedExam(examId);
        setSelectedSubject(subjectId);
        setSelectedNumber(numberId);
        setSelectedBanks(bankAuthors);
        setFiles(data.files);
        setSolution(data.solution);

        if (data.difficulty_level?.id !== undefined) {
          setSelectedDifLevel(data.difficulty_level.id);
        } else {
          setSelectedDifLevel(-1);
        }
        if (data.actuality?.id) {
          setSelectedActuality(data.actuality.id);
        } else {
          setSelectedActuality(-1);
        }

        setLoadStatus(1);
      } else {
        if (filterData?.exams?.length > 0) {
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
      answer_data: answerData,
      answer_type: answerType,
      number_in_exam: activeNumber?.id,
      author: activeAuthor?.id,
      taskId: taskId,
      bank_authors: selectedBanks,
      difficulty_level: selectedDifLevel !== -1 ? selectedDifLevel : null,
      actuality: selectedActuality !== -1 ? selectedActuality : null,
      files: files.map((file) => file.id),
      solution,
    });
    if (newTask !== undefined) {
      notify("Задача сохранена!");
      setCountSave(countSave + 1);
      navigate(`../edit-task/${newTask.id}/`);
    } else {
      showError("Задача не сохранена.");
    }
  };

  const afterSave = (taskId) => {
    navigate(`../edit-task/${Number(taskId)}/`);
  };

  const goToPrevTask = () => {
    navigate(`../edit-task/${Number(taskId) - 1}/`);
  };
  const goToNextTask = () => {
    navigate(`../edit-task/${Number(taskId) + 1}/`);
  };
  const goToNewTask = () => {
    navigate(`../create-task/`);
  };

  const taskData = {
    taskId,
    editorContent,
    answerType,
    answerData,
    answer,
    exams,
    selectedExam,
    subjects,
    numbers,
    activeExam,
    selectedSubject,
    selectedNumber,
    selectedBanks,
    selectedDifLevel,
    selectedActuality,
    selectedTaskAuthor,
    activeSubject,
    activeNumber,
    bankAuthors,
    taskAuthors,
    difficulty_levels,
    actualities,
    files,
    solution,
    setSolution,
    setEditorContent,
    setAnswer,
    setAnswerType,
    setAnswerData,
    setSelectedExam,
    setSelectedSubject,
    setSelectedNumber,
    setSelectedTaskAuthor,
    setSelectedBanks,
    setSelectedDifLevel,
    setSelectedActuality,
    setFiles,
  };
  console.log("SB", selectedBanks);
  return (
    <div className="create-task-cont">
      {taskId && loadStatus !== -1 && (
        <div className="container">
          <div>
            <button onClick={goToPrevTask}>Предыдущая</button>
            <button onClick={goToNewTask}>Новая</button>
            <button onClick={goToNextTask}>Следующая</button>
          </div>
        </div>
      )}

      <CreateTask
        taskId={taskId}
        taskData={taskData}
        afterSave={afterSave}
        handleSaveButton={saveTaskOnServer}
        loadStatus={loadStatus}
      />
      {showSaveText && "Сохранено"}
      {taskId && (
        <div className="container">
          <div>
            <button onClick={goToPrevTask}>Предыдущая</button>
            <button onClick={goToNewTask}>Новая</button>
            <button onClick={goToNextTask}>Следующая</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CreateTaskPage;
