import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteCollection,
  getMyCollections,
} from "../../../../server/collections";
import "./Materials.css";
import { showError } from "../../../Utils/Notifications";

const TeacherCollections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getMyCollections();
      if (res) {
        setCollections(res);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, []);

  const goToLk = () => {
    navigate("./../");
  };

  const handleCollectionDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить?")) {
      const res = await deleteCollection({ collection_id: id });

      if (res) {
        const newCol = collections.filter((col) => {
          return col.id !== id;
        });

        setCollections(newCol);
      } else {
        showError("Ошибка.");
      }
    }
  };
  return (
    <div className="teacher-materials">
      <h2> Мои варианты</h2>
      <button onClick={goToLk} className="return-but">
        В личный кабинет
      </button>
      <div className="col-cont">
        {collections.map((col) => (
          <div
            key={col.id}
            className="collection"
            onClick={() => {
              window.open(`/collection/${col.slug}`, "_blank");
            }}
          >
            <div>{col.name}</div>
            <div className="buttons">
              <button
                onClick={() => {
                  window.open(`/collection/${col.slug}/`, "_blank");
                }}
              >
                Смотреть
              </button>
              <button
                onClick={() => {
                  window.open(
                    `/variant/${col.slug}/all-results/history/`,
                    "_blank"
                  );
                }}
              >
                Результаты
              </button>
              <button
                onClick={() => {
                  window.open(`/update-collection/${col.slug}/`, "_blank");
                }}
              >
                Редактировать
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCollectionDelete(col.id);
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCollections;
