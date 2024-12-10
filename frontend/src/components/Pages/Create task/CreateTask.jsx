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
import Answer from "./components/Answer";
import Buttons from "./components/Buttons";
import {
  createTaskOnServer,
  getFilterData,
  getNumbers,
  getTaskById,
} from "../../../server/bank";
import TaskSlugTags from "./components/TaskSlugTags";
import { getPrepareFilterData } from "../../Utils/FilterUtils";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [countSave, setCountSave] = useState(0);
  const [loadedId, setLoadedId] = useState(-1);
  //console.log(location);
  //const exam = searchParams.get("exam");
  //const subject = searchParams.get("subject");

  const [editorContent, setEditorContent] = useState("Начальный");
  const [answer, setAnswer] = useState("");
  const [selectedExam, setSelectedExam] = useState(-1);
  const [selectedSubject, setSelectedSubject] = useState(-1);
  const [selectedNumber, setSelectedNumber] = useState(-1);

  //const [numbers, setNumbers] = useState([]);
  const [filterData, setFilterData] = useState([]);

  // const searchExamSlug =
  //   searchParams.get("exam") === null ? "" : searchParams.get("exam");
  // const searchSubjectSlug =
  //   searchParams.get("subject") === null ? "" : searchParams.get("subject");

  // const activeSubject = activeExam["subjects"][selectedSubject];
  // const exams = filterData.map((exam) => {
  //   return { id: exam.id, name: exam.name };
  // });
  // const activeExam = filterData[selectedExam];

  // const subjects =
  //   activeExam?.subjects !== undefined
  //     ? activeExam["subjects"].map((exam) => {
  //         return { id: exam.id, name: exam.name };
  //       })
  //     : [];
  // const activeSubject = subjects[selectedSubject];
  // const numbers =
  //   activeSubject?.numbers !== undefined
  //     ? activeExam["numbers"].map((exam) => {
  //         return { id: exam.id, name: exam.name };
  //       })
  //     : [];
  const { exams, subjects, numbers, activeExam, activeSubject, activeNumber } =
    getPrepareFilterData({
      filterData,
      selectedExam,
      selectedSubject,
      selectedNumber,
    });
  // console.log("fd", filterData);
  // console.log(exams, subjects, numbers);
  // console.log("sub", activeSubject);
  console.log("an", activeNumber);
  // const sources = activeSubject["sources"];
  // const numbers = activeSubject["numbers"];
  // const authors = activeSubject["authors"];
  // console.log(subjects, numbers);

  const setDefault = () => {
    setEditorContent("Начальный");
    setAnswer("");
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
      console.log(data);
      setEditorContent(data.content);
      setAnswer(data.answer);
      const numberId = data.number_in_exam.id;
      const subjectId = data.number_in_exam.subject.id;
      const examId = data.number_in_exam.subject.exam.id;

      // const examIndex = exams.findIndex((element) => element.id === examId);
      // const subjectIndex = subjects.findIndex(
      //   (element) => element.id === subjectId
      // );
      // const numberIndex = numbers.findIndex(
      //   (element) => element.id === numberId
      // );
      //console.log(filterData, exams, subjects, numbers);
      setSelectedExam(examId);
      setSelectedSubject(subjectId);
      setSelectedNumber(numberId);
      setLoadedId(taskId);
    }

    if (taskId) {
      fetchData();
      console.log("Download task");
    } else {
      setDefault();
    }
  }, [taskId]);

  const saveTaskOnServer = async () => {
    const newTask = await createTaskOnServer({
      content: editorContent,
      answer: answer,
      number_in_exam: activeNumber.id,
      taskId: taskId,
    });
    if (newTask !== undefined) {
      setCountSave(countSave + 1);
      navigate(`../edit-task/${newTask.id}`);
    }
  };

  const goToPrevTask = () => {
    navigate(`../edit-task/${Number(taskId) - 1}`);
  };
  const goToNextTask = () => {
    navigate(`../edit-task/${Number(taskId) + 1}`);
  };

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

      <TinyMCE
        editorContent={editorContent}
        setEditorContent={setEditorContent}
      />
      <Answer answer={answer} setAnswer={setAnswer} />
      <Buttons
        save={saveTaskOnServer}
        goToPrevTask={goToPrevTask}
        goToNextTask={goToNextTask}
      />
    </div>
  );
};
export default CreateTask;
