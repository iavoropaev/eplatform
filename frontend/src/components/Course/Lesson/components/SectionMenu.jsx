import { useEffect, useState } from "react";
import "./SectionMenu.css";

const SectionMenu = ({ length, indexActive, setActiveSectionIndex }) => {
  return (
    <div className="lesson-menu">
      {Array.from({ length }, (_, index) => (
        <div
          className={index === indexActive ? "menu-active-el" : "menu-el"}
          key={index}
          onClick={() => {
            setActiveSectionIndex(index);
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default SectionMenu;
