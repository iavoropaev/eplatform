import { useEffect, useState } from "react";
import "./Lesson.css";
import SectionMenu from "./components/SectionMenu";
import SectionContent from "./components/SectionContent";
import SectionTask from "./components/SectionTask";
import { useNavigate } from "react-router-dom";
import { sendSectionSolution } from "../../../server/course";
import { useDispatch } from "react-redux";
import { updateSolveStatus } from "../../../redux/slices/courseSlice";

const Lesson = ({ lesson, sectionIndex }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (lesson === undefined) {
    return <p>Загрузка...</p>;
  }

  const currentSectionData = lesson?.sections?.[sectionIndex];
  const taskData = currentSectionData?.task;
  const content = currentSectionData?.content;
  const solveFromServer = currentSectionData?.solve;
  const textForBut =
    solveFromServer === null ? "Отметить выполененным" : "Выполнено";

  const menuStatuses = lesson?.sections?.map((section) => {
    return section.solve?.solve_status;
  });

  const setActiveSectionIndex = (sectionId) => {
    navigate(`./../${sectionId + 1}/`);
  };

  const sendSolution = async (data) => {
    const answer = {
      type: data.type,
      [data.type]: data.answer,
    };

    const res = await sendSectionSolution({
      section_id: currentSectionData.id,
      user_answer: answer,
    });
    dispatch(updateSolveStatus({ id: res.section, solve: res }));
  };

  return (
    <div className="lesson-container">
      <div className="lesson">
        <p className="lesson-name">{lesson.name}</p>
        <SectionMenu
          menuStatuses={menuStatuses}
          indexActive={sectionIndex}
          setActiveSectionIndex={setActiveSectionIndex}
        />
        {content && <SectionContent content={content} />}

        {taskData && (
          <SectionTask
            taskData={taskData}
            sendSolution={sendSolution}
            solveFromServer={solveFromServer}
          />
        )}

        {!taskData && (
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
