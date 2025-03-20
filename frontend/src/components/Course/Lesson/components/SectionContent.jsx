import { useEffect, useState } from "react";
import "./SectionContent.css";

import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-python";
import "prismjs/components/prism-core";

const SectionContent = ({ content }) => {
  useEffect(() => {
    Prism.highlightAll();
    console.log("Подсветка.");
  }, [content]);

  return (
    <div
      className="section-content"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
};

export default SectionContent;
