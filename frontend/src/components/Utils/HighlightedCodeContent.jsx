import { useEffect } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-python";
import "prismjs/components/prism-core";

const HighlightedCodeContent = ({ content }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div
      className="h-content"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
};

export default HighlightedCodeContent;
