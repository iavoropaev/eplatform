import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Task from "../../../Task/Task";
import { getMyCollections } from "../../../../server/collections";

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
                navigate(`/collections/${col.slug}`);
              }}
            >
              Смотреть
            </button>
            <button
              onClick={() => {
                navigate(`/update-collection/${col.slug}`);
              }}
            >
              Редактировать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCollections;
