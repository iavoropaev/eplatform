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

  const saveCollection = async () => {
    const collection = await createCollection({
      slug: colSlug,
      name: colName,
      description: colDescription,
    });
    console.log(collection);
    navigate(`../update-collection/${collection.slug}/`);
  };

  return (
    <div className="create-collection">
      <div>
        {"Название коллекции"}
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
      <div>
        {"Описание коллекции"}
        <textarea
          wrap="hard"
          rows="5"
          cols="50"
          value={colDescription}
          onChange={(e) => {
            setColDescription(e.target.value);
          }}
        ></textarea>
        <pre>{colDescription}</pre>
      </div>
      <div>
        {"Слаг"}
        <input
          value={colSlug}
          onChange={(e) => {
            setColSlug(e.target.value);
          }}
        ></input>
      </div>

      <button onClick={saveCollection}>Сохранить</button>
    </div>
  );
};

export default CreateCollection;
