import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCE = ({ editorContent, setEditorContent }) => {
  const editorRef = useRef(null);

  const handleEditorChange = (newContent) => {
    setEditorContent(newContent);
  };

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <div className="editor">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        //initialValue="<p>This is the initial content of the editor.</p>"
        value={editorContent}
        onEditorChange={handleEditorChange}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
            "codesample", // !
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          //   menu: {
          //     edit: { title: "Edit", items: "undo, redo, selectall" },
          //   },
        }}
      />
      <button onClick={log}>Log editor content</button>
      <button
        onClick={() => {
          setEditorContent("Тык");
        }}
      >
        Поменять
      </button>
    </div>
  );
};

export default TinyMCE;
