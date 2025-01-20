import { useEffect, useState } from "react";
import "./Lesson.css";
import SectionMenu from "./components/SectionMenu";
import SectionContent from "./components/SectionContent";

const Lesson = ({ lesson }) => {
  console.log(lesson);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  if (lesson === undefined) {
    return <p>Загрузка...</p>;
  }

  const currentSectionData = lesson?.sections?.[activeSectionIndex];
  const taskData = currentSectionData?.task;
  const content = currentSectionData?.content;
  return (
    <div className="lesson">
      <p>{"Урок " + lesson.name}</p>
      <SectionMenu
        length={lesson.sections.length}
        indexActive={activeSectionIndex}
        setActiveSectionIndex={setActiveSectionIndex}
      />
      <p>Урок {currentSectionData?.name}</p>
      <SectionContent content={content} />
    </div>
  );
};

export default Lesson;
