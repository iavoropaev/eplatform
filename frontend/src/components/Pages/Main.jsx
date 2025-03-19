import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Auth from "../Utils/Auth";
import { useEffect } from "react";
import queryString from "query-string";
import { getTokenByVKID } from "../../server/auth";

import { toast } from "react-toastify";
const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem("first_name");
  const isAuth = localStorage.getItem("isAuth");

  useEffect(() => {
    async function fetchData() {
      const parsed = queryString.parse(location.search);
      if (parsed?.payload) {
        const payload = JSON.parse(parsed.payload);
        if (payload) {
          const data = await getTokenByVKID({
            silentToken: payload.token,
            uuid: payload.uuid,
          });
          try {
            console.log(data);
            console.log(data.access);
            localStorage.setItem("jwt_a", data.access);
            localStorage.setItem("jwt_r", data.refresh);
            localStorage.setItem("photo", data.photo_50);
            localStorage.setItem("first_name", data.first_name);
            localStorage.setItem("isAuth", true);
            localStorage.setItem("isAdmin", data.is_admin);
            //dispatch(setHasToken(true));
            navigate("./", { relative: "path" });
            window.location.reload();
          } catch (error) {
            navigate("./", { relative: "path" });
          }
        }
      }
    }

    fetchData();
  }, [location, navigate]);

  const logOut = () => {
    localStorage.clear();
    navigate("./", { relative: "path" });
    window.location.reload();
  };
  const showOK = (text) => toast.success(text);
  return (
    <div>
      <h1>Главная, {userName}</h1>
      {!isAuth && <Auth />}

      <div className="menu">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/bank/">Банк задач</NavLink>
          <NavLink to="/create-task/">Добавить задачу</NavLink>
          <hr></hr>
          <NavLink end to="/collections/ege/ege_inf/">
            Каталог подборок
          </NavLink>
          <NavLink end to="/variant/1/">
            Вариант
          </NavLink>
          <NavLink to="/collections/1/">Подборка</NavLink>
          <NavLink to="/create-collection/">Создать подборку</NavLink>
          <NavLink to="/update-collection/1/">Обновить подборку</NavLink>
          <NavLink end to="/generate-collection/ege/ege_inf/">
            Сгенерировать вариант
          </NavLink>

          <hr></hr>
          <NavLink end to="/courses/ege/ege_inf/">
            Каталог курсов
          </NavLink>
          <NavLink end to="/course/1/lesson/2/s/1/">
            Курс
          </NavLink>
          <NavLink end to="/create-course/">
            Создать курс
          </NavLink>
          <NavLink end to="/edit-course/1/">
            Редактировать курс
          </NavLink>
          <NavLink end to="/course/1/edit-lesson/2/s/1">
            Редактировать урок
          </NavLink>
          <hr></hr>
          <br></br>
        </div>
        <button onClick={logOut}>Выйти</button>
        <button
          onClick={() => {
            showOK("!!!");
          }}
        >
          Увед
        </button>
      </div>
    </div>
  );
};

export default Main;
