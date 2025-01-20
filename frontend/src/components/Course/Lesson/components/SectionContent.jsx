import { useEffect, useState } from "react";
import "./SectionContent.css";

const SectionContent = ({ content }) => {
  return (
    <div className="section-content">
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default SectionContent;
