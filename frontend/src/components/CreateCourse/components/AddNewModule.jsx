import { useState } from "react";
import { createModule, getModuleById } from "../../../server/course";
import { showError } from "../../Utils/Notifications";

const AddNewModule = ({ addModule }) => {
  const [addingModuleName, setAddingModuleName] = useState("");
  const [addingModuleId, setAddingModuleId] = useState("");

  const createNewModule = async () => {
    const newModule = await createModule({ name: addingModuleName });
    addModule(newModule);
    setAddingModuleName("");
  };

  const addModuleById = async (id) => {
    const module = await getModuleById(id);

    if (module) {
      addModule(module);
    } else {
      showError("Ошибка.");
    }
    setAddingModuleId("");
  };
  return (
    <div className="add-module">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createNewModule();
        }}
      >
        <input
          value={addingModuleName}
          onChange={(e) => {
            setAddingModuleName(e.target.value);
          }}
          placeholder="Название нового модуля"
        ></input>
        <button type="submit" disabled={addingModuleName === ""}>
          +
        </button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addModuleById(addingModuleId);
        }}
      >
        <input
          value={addingModuleId}
          onChange={(e) => {
            setAddingModuleId(e.target.value);
          }}
          placeholder="Добавить модуль по ID"
        ></input>
        <button
          type="submit"
          disabled={addingModuleId === "" || isNaN(Number(addingModuleId))}
        >
          +
        </button>
      </form>
    </div>
  );
};
export default AddNewModule;
