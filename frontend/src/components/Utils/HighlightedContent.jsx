import { useEffect, useRef } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-python";
import "prismjs/components/prism-core";

import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

const HighlightedContent = ({ content }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    Prism.highlightAllUnder(ref.current);

    renderMathInElement(ref.current, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  }, [content]);

  return (
    <div
      ref={ref}
      className="h-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default HighlightedContent;
