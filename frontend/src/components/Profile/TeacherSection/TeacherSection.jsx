import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createClass, getMyClasses } from "../../../server/class";

const TeacherSection = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const classes = await getMyClasses();
      if (classes) {
        setClasses(classes);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="">
      <div>
        <h3>Материалы</h3>
        <div>
          <NavLink to="/bank/">Добавить задачу</NavLink>
          <NavLink to="/bank/">Создать вариант</NavLink>
          <NavLink to="/bank/">Создать курс</NavLink>
        </div>

        <div>
          <NavLink to="./my-tasks/">Мои задачи</NavLink>
          <NavLink to="./my-variants/">Мои варианты</NavLink>
          <NavLink to="./my-courses/">Мои курсы</NavLink>
        </div>
      </div>
      <div>
        <h3>Классы</h3>
        <div>
          {classes.map((cur_class, i) => (
            <div
              key={i}
              onClick={() => {
                navigate(`/class/${cur_class.id}`);
              }}
            >
              {cur_class.name}
            </div>
          ))}
        </div>
        <div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const newClass = await createClass({ name: newClassName });
              console.log(newClass);
              navigate(`/class/${newClass.id}/`);
              setNewClassName("");
            }}
          >
            <input
              value={newClassName}
              placeholder="Новый класс"
              onChange={(e) => {
                setNewClassName(e.target.value);
              }}
            ></input>
            <button type="submit">+</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherSection;
