import { useEffect, useState } from "react";
import { getCollections } from "../../server/collections";
import { useNavigate, useParams } from "react-router-dom";
import "./CollectionCatalog.css";
import { SubjectSelect } from "../Utils/SubjectSelect/SubjectSelect";
import { showError } from "../Utils/Notifications";
import { getFilterData } from "../../server/bank";

const CollectionCatalog = () => {
  const navigate = useNavigate();
  const { examSlug, subjectSlug } = useParams();
  const [collections, setCollections] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const collectionsFromServer = await getCollections(subjectSlug);
      if (collectionsFromServer) {
        setCollections(collectionsFromServer);
      }
      setLoading(false);
    }
    fetchData();
  }, [subjectSlug]);

  return (
    <div className="coll-cat-container">
      <h2>Каталог подборок</h2>
      <SubjectSelect />
      <div className="col-list">
        {isLoading && <p>Загрузка...</p>}
        {!isLoading && subjectSlug === "-" && collections?.length === 0 && (
          <p>Выберите предмет.</p>
        )}
        {!isLoading && subjectSlug !== "-" && collections?.length === 0 && (
          <p>Подборок пока нет.</p>
        )}
        {!isLoading &&
          collections.map((col) => {
            return (
              <div
                className="col-item"
                key={col.slug}
                onClick={() => {
                  navigate(`/collection/${col.slug}/`);
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
