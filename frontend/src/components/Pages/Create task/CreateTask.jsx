import { useState } from "react";
import TinyMCE from "../../Utils/TinyMCE";

const CreateTask = () => {
  const [editorContent, setEditorContent] = useState("Начальный");

  return (
    <>
      <TinyMCE
        editorContent={editorContent}
        setEditorContent={setEditorContent}
      />
    </>
  );
};
export default CreateTask;
