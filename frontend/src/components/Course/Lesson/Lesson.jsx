import SectionMenu from "./components/SectionMenu";
import SectionTask from "./components/SectionTask";
import { useNavigate, useParams } from "react-router-dom";
import { sendSectionSolution } from "../../../server/course";
import { useDispatch, useSelector } from "react-redux";
import { updateSolveStatus } from "../../../redux/slices/courseSlice";
import { showError } from "../../Utils/Notifications";
import HighlightedContent from "../../Utils/HighlightedContent";
import "./Lesson.css";

const Lesson = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lessonId, sectionIndex } = useParams();
  const intSectionIndex = Number(sectionIndex) - 1;

  const currentLesson = useSelector((state) => state.course.currentLesson);
  const isAuthor = useSelector((state) => state.course.courseData?.is_author);

  if (currentLesson === undefined) {
    return <p>Загрузка...</p>;
  }

  const currentSectionData = currentLesson?.sections?.[intSectionIndex];
  const taskData = currentSectionData?.task;
  const content = currentSectionData?.content;
  const solveFromServer = currentSectionData?.solve;
  const textForBut =
    solveFromServer === null ? "Отметить выполненным" : "Выполнено";

  const menuStatuses = currentLesson?.sections?.map((section) => {
    return section.solve?.solve_status;
  });

  const setActiveSectionIndex = (sectionId) => {
    navigate(`./../${sectionId + 1}/`);
  };
  const goEditing = () => {
    navigate(`./../../../../edit-lesson/${lessonId}/s/${intSectionIndex + 1}/`);
  };
  const sendSolution = async (data) => {
    dispatch(
      updateSolveStatus({
        id: currentSectionData.id,
        solve: { solve_status: "checking" },
      })
    );

    const answer = {
      type: data.type,
      [data.type]: data.answer,
    };

    const res = await sendSectionSolution({
      section_id: currentSectionData.id,
      user_answer: answer,
    });
    if (res !== undefined) {
      dispatch(updateSolveStatus({ id: res.section, solve: res }));
    } else {
      showError("Решение не отправлено.");
    }
  };

  return (
    <div className="lesson-container">
      <div className="lesson">
        <div className="lesson-name-cont">
          <p className="lesson-name">{currentLesson.name}</p>
          {isAuthor && (
            <button className="edit-but " onClick={goEditing}>
              Редактировать
            </button>
          )}
        </div>

        <SectionMenu
          menuStatuses={menuStatuses}
          indexActive={intSectionIndex}
          setActiveSectionIndex={setActiveSectionIndex}
        />

        {content && (
          <div className="section-content">
            <HighlightedContent content={content} />
          </div>
        )}
        {taskData && (
          <SectionTask
            taskData={taskData}
            sendSolution={sendSolution}
            solveFromServer={solveFromServer}
          />
        )}
        {currentSectionData?.type === "text" && (
          <div className="save-text-section">
            <button
              className="black-button"
              onClick={sendSolution}
              disabled={solveFromServer !== null}
            >
              {textForBut}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lesson;
