import { NavLink, useParams } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  const { section } = useParams();
  console.log(section);
  return (
    <div className="menu-container">
      <div className="menu">
        <nav>
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/bank/">Банк задач</NavLink>
          {/* <NavLink to="/create-task/">Добавить задачу</NavLink> */}
          {/* <NavLink to="/test/">Тест</NavLink> */}
          {/* <NavLink to="/create-collection/">Создать подборку</NavLink>
          <NavLink to="/update-collection/1/">Обновить подборку</NavLink>
          <NavLink to="/collections/1/">Подборка</NavLink> */}
          <NavLink end to="/collections/ege/ege_inf/">
            Подборки
          </NavLink>
          <NavLink end to="/courses/ege/ege_inf/">
            Курсы
          </NavLink>

          <NavLink to="/lk/teach/" className={section ? "active" : ""}>
            ЛК
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Menu;
