import { useState } from "react";
import { createLesson } from "../../../server/course";

const AddNewLesson = ({ addLesson, indMod }) => {
  const [addingLessonName, setAddingLessonName] = useState("");
  const [addingLessonId, setAddingLessonId] = useState("");

  const handleAddingNewLesson = async () => {
    const createdLesson = await createLesson({ name: addingLessonName });
    if (createdLesson) {
      addLesson(indMod, createdLesson.id);
    }
    setAddingLessonName("");
  };

  return (
    <div className="add-lesson">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleAddingNewLesson();
        }}
      >
        <input
          value={addingLessonName}
          onChange={(e) => {
            setAddingLessonName(e.target.value);
          }}
          placeholder="Название нового урока"
        ></input>
        <button type="submit">+</button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addLesson(indMod, addingLessonId);
        }}
      >
        <input
          value={addingLessonId}
          onChange={(e) => {
            setAddingLessonId(e.target.value);
          }}
          placeholder="Добавить урок по ID"
        ></input>
        <button
          type="submit"
          disabled={addingLessonId === "" || isNaN(Number(addingLessonId))}
        >
          +
        </button>
      </form>
    </div>
  );
};
export default AddNewLesson;
