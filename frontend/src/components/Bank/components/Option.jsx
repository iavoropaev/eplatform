import { useState } from "react";

const Option = ({ options, nameForUsers, optionName, selected, setSelect }) => {
  const [show, setShow] = useState(false);

  const changeShow = () => {
    setShow(!show);
  };

  const handleSelect = (i) => {
    if (i === -1) {
      setSelect(optionName, []);
    } else {
      const newSel = [...selected];
      if (newSel.includes(i)) {
        const index = newSel.indexOf(i);
        newSel.splice(index, 1);
      } else {
        newSel.push(i);
      }
      setSelect(optionName, newSel);
    }
  };

  return (
    <div>
      <span
        className="filter-option"
        onClick={() => {
          changeShow();
        }}
      >
        {nameForUsers}
      </span>
      {show && (
        <div className="tag">
          {options.map((item, i) => {
            return (
              <div
                key={i}
                onClick={() => {
                  handleSelect(i);
                }}
                className={"option" + (selected.includes(i) ? " select" : "")}
              >
                {item.name}
              </div>
            );
          })}
          <div onClick={changeShow} className="option">
            Готово
          </div>
          <div
            onClick={() => {
              handleSelect(-1);
            }}
            className="option clear"
          >
            Очистить
          </div>
        </div>
      )}
    </div>
  );
};

export default Option;
