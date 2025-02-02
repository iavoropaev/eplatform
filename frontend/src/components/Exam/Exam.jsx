import { useEffect, useState } from "react";
import Task from "../Task/Task";
import { useNavigate, useParams } from "react-router-dom";
import { getCollectionBySlug } from "../../server/collections";
import { useDispatch, useSelector } from "react-redux";
import {
  addExamAnswer,
  clearExamAnswer,
  setExamName,
  setExamTasks,
} from "../../redux/slices/examSlice";
import { sendExamSolutionToServer } from "../../server/exam";
import "./Exam.css";

const Exam = () => {
  //const jwt = localStorage.getItem("jwt_a");
  const navigate = useNavigate();
  const { slug } = useParams();

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.exam.tasks);
  const answers = useSelector((state) => state.exam.answers);
  const colName = useSelector((state) => state.exam.name);

  const [startTime, setStartTime] = useState(new Date());
  const [isError, setError] = useState(false);

  const countUserAnswers = Object.keys(answers).length;

  useEffect(() => {
    async function fetchData() {
      const collection = await getCollectionBySlug(slug);
      if (collection) {
        dispatch(setExamTasks(collection.tasks));
        dispatch(setExamName(collection.name));
      } else {
        setError(true);
      }
    }
    fetchData();
  }, [dispatch, slug]);

  if (isError) {
    return <h2>Такого варианта не существует.</h2>;
  }

  const handleSaveAnswerButton = (data) => {
    const { taskId, answer, type } = data;
    dispatch(addExamAnswer({ taskId, answer: { [type]: answer, type: type } }));
  };

  const handleCancelButton = (id) => {
    dispatch(clearExamAnswer(id));
  };

  const handleSendExamBut = async () => {
    const now = new Date();
    const duration = now.getSeconds() - startTime.getSeconds();
    const data = {
      col_slug: slug,
      answers,
      duration,
    };

    const res = await sendExamSolutionToServer(data);
    if (res) {
      navigate(`./results/`);
    }
  };

  return (
    <div className="exam-container">
      <h1 className="exam-title">{colName}</h1>
      <p className="count-answers">{`Дано ответов ${countUserAnswers}/${tasks.length}.`}</p>

      {tasks.map((task) => {
        return (
          <Task
            taskData={task}
            taskAnswer={answers[task.id]}
            key={task.id}
            handleSaveButton={handleSaveAnswerButton}
            handleCancelButton={() => {
              handleCancelButton(task.id);
            }}
            status={answers[task.id]?.data}
            showCancelBut
          />
        );
      })}
      <div className="finish-exam">
        <p className="count-answers">{`Дано ответов ${countUserAnswers}/${tasks.length}.`}</p>
        <button onClick={handleSendExamBut} className="black-button">
          Завершить решение
        </button>
      </div>
    </div>
  );
};

export default Exam;
