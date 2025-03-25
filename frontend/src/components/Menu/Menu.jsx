import { NavLink, useLocation, useParams } from "react-router-dom";
import "./Menu.css";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

const Menu = () => {
  const location = useLocation();
  const { section } = useParams();
  const [isOpen, setIsOpen] = useState(true);
  const isClose = isOpen ? "" : " closed";

  console.log(section);
  return (
    <div className="menu-container">
      <div className="menu">
        <button className="menu-but" onClick={() => setIsOpen(() => !isOpen)}>
          <IoMenu />
        </button>

        <nav className={isOpen ? "nav-links" : "nav-links"}>
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/bank/" className={isClose}>
            Банк задач
          </NavLink>
          <NavLink
            end
            to="/collections/ege/ege_inf/"
            className={({}) =>
              (location.pathname.startsWith("/collections") ? "active" : "") +
              isClose
            }
          >
            Подборки
          </NavLink>
          <NavLink
            end
            to="/courses/ege/ege_inf/"
            className={({}) =>
              (location.pathname.startsWith("/courses") ? "active" : "") +
              isClose
            }
          >
            Курсы
          </NavLink>

          <NavLink
            to="/lk/teach/"
            className={(section ? "active" : "") + isClose}
          >
            ЛК
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Menu;
