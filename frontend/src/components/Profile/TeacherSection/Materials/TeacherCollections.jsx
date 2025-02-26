import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Task from "../../../Task/Task";
import {
  deleteCollection,
  getMyCollections,
} from "../../../../server/collections";

const TeacherCollections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getMyCollections();
      if (res) {
        setCollections(res);
        console.log(res);
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
          console.log(col.id, id);
          return col.id !== id;
        });

        setCollections(newCol);
      }
    }
  };
  return (
    <div className="">
      <h2> Мои варианты</h2>
      <button onClick={goToLk}>В личный кабинет</button>
      <div>
        {collections.map((col) => (
          <div key={col.id} className="tag">
            <div>{col.name}</div>
            <button
              onClick={() => {
                window.open(`/collections/${col.slug}`, "_blank");
              }}
            >
              Смотреть
            </button>
            <button
              onClick={() => {
                window.open(`/update-collection/${col.slug}`, "_blank");
              }}
            >
              Редактировать
            </button>
            <button
              onClick={() => {
                handleCollectionDelete(col.id);
              }}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCollections;
