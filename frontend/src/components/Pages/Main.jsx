import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Auth from "../Utils/Auth";
import { useEffect } from "react";
import queryString from "query-string";
import { getTokenByVKID } from "../../server/auth";

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
            console.log(data.access);
            localStorage.setItem("jwt_a", data.access);
            localStorage.setItem("jwt_r", data.refresh);
            localStorage.setItem("photo", data.photo_50);
            //dispatch(setHasToken(true));
            navigate("./", { relative: "path" });
          } catch (error) {
            navigate("./", { relative: "path" });
          }
        }
      }
    }

    fetchData();
  }, [location, navigate]);
  return (
    <>
      <h1>Главная</h1>
      <Auth />
      <div className="menu">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/bank/">Банк задач</NavLink>
          <NavLink to="/create-task/">Добавить задачу</NavLink>
          {/* <NavLink to="/test/">Тест</NavLink> */}
          <NavLink to="/create-collection/">Создать подборку</NavLink>
          <NavLink to="/update-collection/1/">Обновить подборку</NavLink>
          <NavLink to="/collections/1/">Подборка</NavLink>
          <NavLink end to="/collections/">
            Подборки
          </NavLink>
          <NavLink end to="/variant/1/">
            Вариант
          </NavLink>
          <NavLink end to="/course/1/lesson/1">
            курс
          </NavLink>

          <NavLink></NavLink>
        </div>
      </div>
    </>
  );
};

export default Main;
