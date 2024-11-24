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
          <NavLink to="/test/">Тест</NavLink>
          <NavLink></NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Menu;
