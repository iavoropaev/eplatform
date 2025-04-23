import "./SectionMenu.css";

const SectionMenu = ({
  menuStatuses,
  indexActive,
  setActiveSectionIndex,
  addButton,
}) => {
  return (
    <div className="lesson-menu">
      {menuStatuses.map((status, index) => {
        let solveStatus = status;
        if (status === undefined) {
          solveStatus = " ";
        }

        const className =
          (index === indexActive ? "menu-active-el " : "menu-el ") +
          solveStatus;

        return (
          <button
            className={className}
            key={index}
            onClick={() => {
              setActiveSectionIndex(index);
            }}
          >
            {index + 1}
          </button>
        );
      })}
      {addButton && (
        <div className={"menu-el plus"} key={"new"} onClick={addButton}>
          +
        </div>
      )}
    </div>
  );
};

export default SectionMenu;
