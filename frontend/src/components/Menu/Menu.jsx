import { NavLink } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
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
          <NavLink end to="/collections/">
            Подборки
          </NavLink>

          <NavLink></NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Menu;
