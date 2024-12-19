import { useState } from "react";

const Buttons = ({ save, goToPrevTask, goToNextTask }) => {
  return (
    <div>
      {/* <div>
        <button onClick={save}>Сохранить</button>
      </div> */}

      <span>
        <button onClick={goToPrevTask}>Предыдущая</button>
        <button onClick={goToNextTask}>Следующая</button>
      </span>
    </div>
  );
};
export default Buttons;
