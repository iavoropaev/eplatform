import { useState } from "react";

const Choice = ({ data, setSelect, name, selectedId }) => {
  return (
    <>
      {data.map((item, i) => {
        return (
          <span
            onClick={(e) => {
              setSelect(name, i);
            }}
            className={i === selectedId ? "active" : ""}
            key={i}
          >
            {item.name}
          </span>
        );
      })}
    </>
  );
};

export default Choice;
