import { useEffect, useState } from "react";
import { getCollections } from "../../server/collections";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlinePlayCircleFilled } from "react-icons/md";
import "./CollectionCatalog.css";

const CollectionCatalog = () => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const collectionsFromServer = await getCollections();
      setCollections(collectionsFromServer);
    }
    fetchData();
  }, []);

  return (
    <div className="coll-cat-container">
      <h1>Каталог</h1>
      <div className="col-list">
        {collections.map((col) => {
          return (
            <div
              className="col-item"
              key={col.slug}
              onClick={() => {
                navigate(`./${col.slug}/`);
              }}
            >
              <span>{col.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionCatalog;
