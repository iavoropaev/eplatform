import { useEffect, useState } from "react";
import Task from "../Task/Task";
import { useNavigate, useParams } from "react-router-dom";
import { getCollectionBySlug } from "../../server/collections";
import { useDispatch, useSelector } from "react-redux";
import {
  addExamAnswer,
  clearExamAnswer,
  clearExamAnswers,
  setExamDescription,
  setExamName,
  setExamSlug,
  setExamTasks,
} from "../../redux/slices/examSlice";
import { sendExamSolutionToServer } from "../../server/exam";
import { showError, showOK } from "../Utils/Notifications";
import "./Exam.css";

const Exam = () => {
  const navigate = useNavigate();
  const { slug, attemptId } = useParams();

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.exam.tasks);
  const answers = useSelector((state) => state.exam.answers);
  const colName = useSelector((state) => state.exam.name);
  const examSlug = useSelector((state) => state.exam.examSlug);
  const examDescription = useSelector((state) => state.exam.description);

  const [startTime, setStartTime] = useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const countUserAnswers = Object.keys(answers).length;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (examSlug !== slug) {
        const collection = await getCollectionBySlug(slug);
        if (collection) {
          if (collection.slug !== examSlug) {
            dispatch(clearExamAnswers());
          }
          dispatch(setExamTasks(collection.tasks));
          dispatch(setExamName(collection.name));
          dispatch(setExamSlug(collection.slug));
          dispatch(setExamDescription(collection.description));
        } else {
          setError(true);
        }
      }
      setLoading(false);
    }

    fetchData();
  }, [dispatch, slug, examSlug]);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

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
    const duration = Math.min(
      1000000,
      Math.floor((now.getTime() - startTime.getTime()) / 1000)
    );
    const data = {
      col_slug: slug,
      answers,
      duration,
    };
    const res = await sendExamSolutionToServer(data);
    if (res) {
      if (res?.solution?.achievements?.length > 0) {
        showOK("Получено достижение!");
      }
      navigate(`./results/id/${res?.solution?.id}/`);
    } else {
      showError("Ошибка.");
    }
  };

  if (isLoading) {
    return <p>Загрузка...</p>;
  }
  const tasksWithSol = tasks.filter(
    (task) => task.answer_type === "no_answer" && task.solution
  );

  return (
    <div className="exam-container">
      <h2 className="exam-title">{colName}</h2>
      {examDescription && examDescription.length > 10 && (
        <div className="description">{examDescription}</div>
      )}
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
            handleChooseScore={handleSaveAnswerButton}
            status={answers[task.id] !== undefined ? "EXIST" : ""}
            showCancelBut
            hideSolutionSection={true}
            hideTaskInfo={true}
            buttonText={["Сохранить ответ", "Ответ сохранён"]}
          />
        );
      })}

      {tasksWithSol && tasksWithSol.length > 0 && (
        <div className="solutions">
          <details>
            <summary>Просмотреть решения задач с развёрнутым ответом</summary>
            {tasksWithSol.map((task) => {
              return (
                <Task
                  taskData={task}
                  taskAnswer={answers[task.id]}
                  key={task.id}
                  handleSaveButton={handleSaveAnswerButton}
                  handleCancelButton={() => {
                    handleCancelButton(task.id);
                  }}
                  handleChooseScore={handleSaveAnswerButton}
                  status={answers[task.id] !== undefined ? "EXIST" : ""}
                  showCancelBut
                  hideSolutionSection={false}
                  hideTaskInfo={true}
                  hideAnswerBlock={true}
                  buttonText={["Сохранить ответ", "Ответ сохранён"]}
                />
              );
            })}
          </details>
        </div>
      )}

      <div className="finish-exam">
        <p className="count-answers">{`Дано ответов ${countUserAnswers}/${tasks.length}.`}</p>
        {attemptId === undefined && (
          <button onClick={handleSendExamBut} className="black-button">
            Завершить решение
          </button>
        )}
        {attemptId !== undefined && (
          <button
            onClick={() => {
              navigate(`/variant/${slug}/results/id/${attemptId}`);
            }}
            className="black-button"
          >
            Просмотр решения
          </button>
        )}
      </div>
    </div>
  );
};

export default Exam;
