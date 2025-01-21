import { useEffect, useState } from "react";
import "./Lesson.css";
import SectionMenu from "./components/SectionMenu";
import SectionContent from "./components/SectionContent";
import SectionTask from "./components/SectionTask";
import { useNavigate } from "react-router-dom";
import { sendSectionSolution } from "../../../server/course";

const Lesson = ({ lesson, sectionIndex }) => {
  const navigate = useNavigate();

  if (lesson === undefined) {
    return <p>Загрузка...</p>;
  }

  const currentSectionData = lesson?.sections?.[sectionIndex];
  const taskData = currentSectionData?.task;
  const content = currentSectionData?.content;
  const solveFromServer = currentSectionData?.solve;

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
    console.log(res);
  };

  return (
    <div className="lesson">
      <p>{"Урок " + lesson.name}</p>
      <SectionMenu
        length={lesson.sections.length}
        indexActive={sectionIndex}
        setActiveSectionIndex={setActiveSectionIndex}
      />
      <p>Урок {currentSectionData?.name}</p>
      <SectionContent content={content} />
      {taskData && (
        <SectionTask
          taskData={taskData}
          sendSolution={sendSolution}
          solveFromServer={solveFromServer}
        />
      )}
    </div>
  );
};

export default Lesson;
