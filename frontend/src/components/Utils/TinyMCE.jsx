import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export const TinyMCE = ({ editorContent, setEditorContent }) => {
  const editorRef = useRef(null);

  const handleEditorChange = (newContent) => {
    setEditorContent(newContent);
  };

  return (
    <div className="editor">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        // initialValue="<p>This is the initial content of the editor.</p>"
        value={editorContent}
        onEditorChange={handleEditorChange}
        init={{
          file_picker_types: "file image media",
          relative_urls: false,
          convert_urls: false,
          images_upload_url: process.env.REACT_APP_API_URL + "upload-file/",
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
            "codesample", // !
            "autoresize", // !
          ],
          toolbar:
            "undo redo | blocks | " +
            "code codesample | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help | ",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:15px }",
          codesample_languages: [{ text: "Python", value: "python" }],
          codesample_default_language: "python",
          elementpath: false,
          help_accessibility: false,
          promotion: false,
          autoresize_bottom_margin: 10,
          autoresize_overflow_padding: 10,
          extended_valid_elements:
            "iframe[src|width|height|frameborder|allowfullscreen|sandbox]",
          setup: function (editor) {
            editor.on("GetContent", function (e) {
              e.content = e.content.replace(/ sandbox=""/gi, "");
            });
          },
        }}
      />
    </div>
  );
};
