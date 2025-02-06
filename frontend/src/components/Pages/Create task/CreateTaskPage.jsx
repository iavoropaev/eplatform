import { useNavigate, useParams } from "react-router-dom";
import "./CreateTaskPage.css";
import CreateTask from "../../CreateTask/CreateTask";
import { useEffect, useState } from "react";
import {
  createTaskOnServer,
  getFilterData,
  getTaskById,
} from "../../../server/bank";
import { getPreparedFilterData } from "../../Utils/FilterUtils";

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const [countSave, setCountSave] = useState(0);
  const [loadStatus, setLoadStatus] = useState(0); // 0 - loading; 1 - ok, -1- error.
  const [showSaveText, setShowSaveText] = useState(false);

  const [editorContent, setEditorContent] = useState("Начальный");
  const [answer, setAnswer] = useState("");
  const [answerType, setAnswerType] = useState("text");
  const [answerData, setAnswerData] = useState(["Опция 1"]);

  const [selectedExam, setSelectedExam] = useState(-1);
  const [selectedSubject, setSelectedSubject] = useState(-1);
  const [selectedNumber, setSelectedNumber] = useState(-1);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedDifLevel, setSelectedDifLevel] = useState(-1);
  const [selectedActuality, setSelectedActuality] = useState(-1);
  const [filterData, setFilterData] = useState([]);

  const {
    exams,
    subjects,
    numbers,
    activeExam,
    activeSubject,
    activeNumber,
    bankAuthors,
    actualities,
    difficulty_levels,
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
      console.log(data);
      if (data !== undefined && filterData?.exams?.length > 0) {
        setEditorContent(data.content);
        setAnswer(data.answer);
        setAnswerType(data.answer_type);
        setAnswerData(data.answer_data);
        const numberId = data.number_in_exam?.id;
        const subjectId = data.number_in_exam?.subject?.id;
        const examId = data.number_in_exam?.subject?.exam?.id;
        const bankAuthors = data.bank_authors.map((el) => el.id);
        setSelectedExam(examId);
        setSelectedSubject(subjectId);
        setSelectedNumber(numberId);
        setSelectedBanks(bankAuthors);

        if (data.difficulty_level?.id) {
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

  const handleShowText = () => {
    setShowSaveText(true);
    setTimeout(() => {
      setShowSaveText(false);
    }, 1000);
  };
  useEffect(() => {
    let timer;
    if (showSaveText) {
      timer = setTimeout(() => {
        setShowSaveText(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showSaveText]);

  const saveTaskOnServer = async () => {
    const newTask = await createTaskOnServer({
      content: editorContent,
      answer: JSON.stringify(answer),
      answer_data: answerData,
      answer_type: answerType,
      number_in_exam: activeNumber?.id,
      taskId: taskId,
      bank_authors: selectedBanks,
      difficulty_level: selectedDifLevel !== -1 ? selectedDifLevel : null,
      actuality: selectedActuality !== -1 ? selectedActuality : null,
    });
    if (newTask !== undefined) {
      handleShowText();
      setCountSave(countSave + 1);
      navigate(`../edit-task/${newTask.id}/`);
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
    activeSubject,
    activeNumber,
    bankAuthors,
    difficulty_levels,
    actualities,
    setEditorContent,
    setAnswer,
    setAnswerType,
    setAnswerData,
    setSelectedExam,
    setSelectedSubject,
    setSelectedNumber,
    setSelectedBanks,
    setSelectedDifLevel,
    setSelectedActuality,
  };

  return (
    <>
      <div className="container">
        {taskId && loadStatus !== -1 && (
          <div>
            <button onClick={goToPrevTask}>Предыдущая</button>
            <button onClick={goToNewTask}>Новая</button>
            <button onClick={goToNextTask}>Следующая</button>
          </div>
        )}
      </div>
      <CreateTask
        taskId={taskId}
        taskData={taskData}
        afterSave={afterSave}
        handleSaveButton={saveTaskOnServer}
        loadStatus={loadStatus}
      />
      {showSaveText && "Сохранено"}
      <div className="container">
        {taskId && (
          <div>
            <button onClick={goToPrevTask}>Предыдущая</button>
            <button onClick={goToNewTask}>Новая</button>
            <button onClick={goToNextTask}>Следующая</button>
          </div>
        )}
      </div>
    </>
  );
};
export default CreateTaskPage;
