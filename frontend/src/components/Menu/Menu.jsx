import { NavLink, useLocation, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import "./Menu.css";

const Menu = () => {
  const location = useLocation();
  const { section } = useParams();
  const menuRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const menu = menuRef.current;
      if (menu) {
        setIsOverflowing(menu.scrollWidth > menu.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="menu-container">
      <div className="menu">
        {isOverflowing && (
          <button
            className="menu-but"
            onClick={() => {
              if (menuRef.current) {
                menuRef.current.scrollLeft -= 50;
              }
            }}
          >
            <FaLongArrowAltLeft />
          </button>
        )}
        <nav className={"nav-links"} ref={menuRef}>
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/bank/">Банк задач</NavLink>
          <NavLink
            end
            to="/collections/ege/ege_inf/"
            className={
              location.pathname.startsWith("/collections") ? "active" : ""
            }
          >
            Подборки
          </NavLink>
          <NavLink
            end
            to="/courses/ege/ege_inf/"
            className={location.pathname.startsWith("/courses") ? "active" : ""}
          >
            Курсы
          </NavLink>

          <NavLink to="/lk/teach/" className={section ? "active" : ""}>
            ЛК
          </NavLink>
        </nav>

        {isOverflowing && (
          <button
            className="menu-but"
            onClick={() => {
              if (menuRef.current) {
                menuRef.current.scrollLeft += 50;
              }
            }}
          >
            <FaLongArrowAltRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Menu;
