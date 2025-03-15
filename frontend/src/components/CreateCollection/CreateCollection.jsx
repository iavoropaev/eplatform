import slugify from "slugify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./CreateCollection.css";
import { createCollection } from "../../server/collections";
import { setSlug } from "../../redux/slices/createCollectionSlice";

const CreateCollection = () => {
  const navigate = useNavigate();

  const [colName, setColName] = useState("");
  const [colDescription, setColDescription] = useState("");
  const [colSlug, setColSlug] = useState("");
  const [isExam, setExam] = useState(false);

  const saveCollection = async () => {
    const collection = await createCollection({
      slug: colSlug,
      name: colName,
      description: colDescription,
      is_exam: isExam,
    });
    console.log(collection);
    navigate(`../update-collection/${collection.slug}/`);
  };
  console.log(isExam);
  return (
    <div className="create-collection">
      <div>
        <span>Название подборки </span>
        <input
          value={colName}
          onChange={(e) => {
            setColName(e.target.value);
            setColSlug(
              slugify(e.target.value, {
                lower: true,
                strict: true,
              })
            );
          }}
        ></input>
      </div>
      <div className="discr">
        <span>Описание подборки </span>
        <textarea
          wrap="hard"
          rows="5"
          cols="50"
          value={colDescription}
          onChange={(e) => {
            setColDescription(e.target.value);
          }}
        ></textarea>
      </div>
      <div>
        <span>Слаг </span>
        <input
          value={colSlug}
          onChange={(e) => {
            setColSlug(e.target.value);
          }}
        ></input>
      </div>
      <div>
        <span>Это вариант? </span>
        <input
          checked={isExam}
          onChange={(e) => {
            setExam(e.target.checked);
          }}
          type="checkbox"
        ></input>
      </div>
      <div>
        <button onClick={saveCollection} className="black-button">
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default CreateCollection;
