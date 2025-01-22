import { useEffect, useState } from "react";
import "./SectionMenu.css";

const SectionMenu = ({ menuStatuses, indexActive, setActiveSectionIndex }) => {
  return (
    <div className="lesson-menu">
      {menuStatuses.map((status, index) => {
        let solveStatus = "";
        if (status === 1) {
          solveStatus = "ok";
        }
        if (status === -1) {
          solveStatus = "wa";
        }
        const className =
          (index === indexActive ? "menu-active-el " : "menu-el ") +
          solveStatus;

        return (
          <div
            className={className}
            key={index}
            onClick={() => {
              setActiveSectionIndex(index);
            }}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
};

export default SectionMenu;
