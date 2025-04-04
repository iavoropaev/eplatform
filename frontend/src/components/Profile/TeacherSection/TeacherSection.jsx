import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createClass, getMyClasses } from "../../../server/class";
import "./TeacherSection.css";
import { showError } from "../../Utils/Notifications";

const TeacherSection = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const classes = await getMyClasses();
      if (classes) {
        setClasses(classes);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, []);

  return (
    <div className="lk-teach">
      <div>
        <h3>Материалы</h3>

        <p className="grey-text">Мои материалы</p>
        <div className="my-materilas">
          <NavLink to="./my-tasks/" className={"tag"}>
            Мои задачи
          </NavLink>
          <NavLink to="./my-variants/" className={"tag"}>
            Мои варианты
          </NavLink>
          <NavLink to="./my-courses/" className={"tag"}>
            Мои курсы
          </NavLink>
        </div>

        <p className="grey-text">Добавить новые</p>
        <div className="add-new">
          <NavLink to="/create-task/" className={"tag"}>
            Добавить задачу
          </NavLink>
          <NavLink to="/create-collection/" className={"tag"}>
            Создать вариант
          </NavLink>
          <NavLink to="/generate-collection/ege/ege_inf/" className={"tag"}>
            Сгенерировать вариант
          </NavLink>
          <NavLink to="/create-course/" className={"tag"}>
            Создать курс
          </NavLink>
        </div>
      </div>

      <div>
        <h3>Классы</h3>
        <div>
          <p className="grey-text">Мои классы</p>
          <div className="class-cont">
            {classes.map((cur_class, i) => (
              <div
                className="class"
                key={i}
                onClick={() => {
                  navigate(`/class/${cur_class.id}/messages/`);
                }}
              >
                {`${i + 1}. ${cur_class.name}`}
              </div>
            ))}
          </div>
        </div>
        <div className="create-class">
          <p className="grey-text">Создать новый класс</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const newClass = await createClass({ name: newClassName });
              console.log(newClass);
              navigate(`/class/${newClass.id}/messages/`);
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
