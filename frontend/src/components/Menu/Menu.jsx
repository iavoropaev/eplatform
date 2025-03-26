import { NavLink, useLocation, useParams } from "react-router-dom";
import "./Menu.css";
import { useEffect, useRef, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

const Menu = () => {
  const location = useLocation();
  const { section } = useParams();
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const isClose = isOpen ? "" : " closed";

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

  console.log(section);
  return (
    <div className="menu-container">
      <div className="menu">
        {isOverflowing && (
          <button
            className="menu-but"
            onClick={() => {
              // setIsOpen(() => !isOpen);
              if (menuRef.current) {
                menuRef.current.scrollLeft -= 50;
              }
            }}
          >
            {/* <IoMenu /> */}
            <FaLongArrowAltLeft />
          </button>
        )}
        <nav className={isOpen ? "nav-links" : "nav-links"} ref={menuRef}>
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

        {isOverflowing && (
          <button
            className="menu-but"
            onClick={() => {
              // setIsOpen(() => !isOpen);
              if (menuRef.current) {
                menuRef.current.scrollLeft += 50;
              }
            }}
          >
            {/* <IoMenu /> */}
            <FaLongArrowAltRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Menu;
