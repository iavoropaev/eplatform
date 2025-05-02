import { useNavigate, useParams } from "react-router-dom";

import SectionMenu from "./../Lesson/components/SectionMenu";

import {
  createSection,
  getSectionById,
  updateLesson,
} from "../../../server/course";
import { useDispatch, useSelector } from "react-redux";
import {
  addSection,
  changeSectionContent,
  changeSectionTask,
  deleteSection,
  setCurrentLesson,
  swapTwoSections,
} from "../../../redux/slices/courseSlice";
import "./../Lesson/Lesson.css";
import Task from "../../Task/Task";
import { useState } from "react";
import { getTaskById } from "../../../server/bank";
import "./EditLesson.css";
import { showError, showOK } from "../../Utils/Notifications";
import { TinyMCE } from "../../../components/Utils/TinyMCE";

const EditLesson = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lessonId, sectionIndex } = useParams();
  const intSectionIndex = Number(sectionIndex) - 1;

  const [addingTaskId, setAddingTaskId] = useState("");
  const [addingSectionId, setAddingSectionId] = useState("");

  const [isSaving, setSaving] = useState(false);

  const currentLesson = useSelector((state) => state.course.currentLesson);
  const sectionsLength = currentLesson?.sections?.length;

  if (currentLesson === undefined) {
    return <p>Загрузка...</p>;
  }

  const currentSectionData = currentLesson?.sections?.[intSectionIndex];
  const taskData = currentSectionData?.task;
  const content = currentSectionData?.content;

  const menuStatuses = currentLesson?.sections?.map((section) => {
    return "-";
  });
  const addTaskButText = taskData ? "Заменить задачу" : "Добавить задачу";

  const setActiveSectionIndex = (sectionId) => {
    navigate(`./../${sectionId + 1}/`);
  };
  const goOutFromEditing = () => {
    navigate(`./../../../../lesson/${lessonId}/s/${intSectionIndex + 1}/`);
  };

  const handleSectionDelete = () => {
    if (sectionsLength > 1) {
      if (intSectionIndex === sectionsLength - 1) {
        setActiveSectionIndex(intSectionIndex - 1);
      }
      dispatch(deleteSection(intSectionIndex));
    }
  };
  const handleSectionCreate = async () => {
    const createdSection = await createSection();
    if (createdSection) {
      dispatch(addSection(createdSection));
      setActiveSectionIndex(sectionsLength);
    } else {
      showError("Секция не добавлена.");
    }
  };
  const handleSectionsSwap = (type) => {
    let index1 = intSectionIndex;
    let index2 = intSectionIndex;
    if (type === "left") {
      index1 = intSectionIndex - 1;
    } else {
      index2 = intSectionIndex + 1;
    }

    if (index1 >= 0 && index2 < currentLesson.sections.length) {
      dispatch(swapTwoSections({ index1, index2 }));
      if (type === "left") {
        setActiveSectionIndex(index1);
      } else {
        setActiveSectionIndex(index2);
      }
    }
  };
  const handleContentChange = (text) => {
    dispatch(
      changeSectionContent({
        index: intSectionIndex,
        content: text,
      })
    );
  };
  const handleTaskDeleting = async () => {
    dispatch(
      changeSectionTask({
        index: intSectionIndex,
        task: null,
      })
    );
  };
  const handleTaskAdding = async (e) => {
    setAddingTaskId(e.target.value);
  };
  const handleTaskAddingButton = async (e) => {
    e.preventDefault();
    const addingTaskData = await getTaskById(addingTaskId);
    if (addingTaskData) {
      dispatch(
        changeSectionTask({
          index: intSectionIndex,
          task: addingTaskData,
        })
      );
    } else {
      showError("Задача не добавлена.");
    }
    setAddingTaskId("");
  };
  const handleSectionAddingButton = async (e) => {
    e.preventDefault();
    const addingSectionData = await getSectionById(addingSectionId);
    if (
      addingSectionData &&
      !currentLesson?.sections.some((s) => s.id === addingSectionData.id)
    ) {
      dispatch(addSection(addingSectionData));
    } else {
      showError("Секция не добавлена.");
    }
    setAddingSectionId("");
  };

  const handleSave = async () => {
    setSaving(true);
    const preparedLesson = {
      ...currentLesson,
      sections: [
        ...currentLesson.sections.map((sec) => {
          return { ...sec, task: sec.task?.id ? sec.task?.id : null };
        }),
      ],
    };
    const updatedLesson = await updateLesson(preparedLesson);

    if (updatedLesson) {
      dispatch(setCurrentLesson(updatedLesson));
      showOK("Сохранено.");
    } else {
      showError("Не сохранено.");
    }
    setSaving(false);
  };

  return (
    <div className="lesson-container edit-les-cont">
      <div className="lesson">
        <p className="lesson-name">{currentLesson.name}</p>

        <SectionMenu
          menuStatuses={menuStatuses}
          indexActive={intSectionIndex}
          setActiveSectionIndex={setActiveSectionIndex}
          addButton={handleSectionCreate}
        />
        <div className="nav-save-cont">
          <div className="navigate">
            <button
              onClick={() => {
                handleSectionsSwap("left");
              }}
              disabled={intSectionIndex <= 0}
            >
              ←
            </button>
            <button
              onClick={handleSectionDelete}
              disabled={sectionsLength <= 1}
            >
              ⨉
            </button>
            <button
              onClick={() => {
                handleSectionsSwap("right");
              }}
              disabled={intSectionIndex >= sectionsLength - 1}
            >
              →
            </button>
          </div>

          <div className="save-return">
            <button
              onClick={handleSave}
              className="black-button"
              disabled={isSaving}
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
          <button onClick={goOutFromEditing}>Вернуться</button>
        </div>

        <div className="content-cont">
          <p>Теория</p>
          {/* {<textarea value={content} onChange={handleContentChange}></textarea>} */}
          <TinyMCE
            editorContent={content}
            setEditorContent={handleContentChange}
          />
        </div>

        <div className="task-cont">
          <p>Задача</p>
          <div className="add-del">
            <form onSubmit={handleTaskAddingButton}>
              <input
                value={addingTaskId}
                onChange={handleTaskAdding}
                placeholder="ID задачи"
              ></input>
              <button type="submit">{addTaskButText}</button>
            </form>
            {taskData && (
              <button onClick={handleTaskDeleting}>Удалить задачу</button>
            )}
          </div>
        </div>
        {taskData && (
          <div className="task-in-lesson">
            <Task
              key={taskData.id}
              taskData={taskData}
              handleSaveButton={() => {}}
              handleCancelButton={() => {}}
              status={"-"}
              hideAnswerBlock={true}
            />
          </div>
        )}
        <div className="add-section">
          <form onSubmit={handleSectionAddingButton}>
            <input
              value={addingSectionId}
              onChange={(e) => {
                setAddingSectionId(e.target.value);
              }}
              placeholder="Добавить секцию по ID..."
            ></input>
            <button type="submit">+</button>
          </form>
          <p className="grey">{`Id текущей секции: ${currentSectionData?.id}.`}</p>
        </div>
      </div>
    </div>
  );
};

export default EditLesson;
