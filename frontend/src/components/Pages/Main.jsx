import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import queryString from "query-string";
import { getTokenByVKID } from "../../server/auth";
import "./Main.css";

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
            localStorage.setItem("jwt_a", data.access);
            localStorage.setItem("photo", data.photo_50);
            localStorage.setItem("first_name", data.first_name);
            localStorage.setItem("isAuth", true);
            localStorage.setItem("isAdmin", data.is_admin);
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

  return (
    <div className="main-page">
      <h2>Для выпускников</h2>
      <div className="main-section">
        <button
          className="item"
          onClick={() => {
            navigate("/bank/");
          }}
        >
          <b>Банк задач</b> предоставляет Вам возможность потренироваться в
          решении заданий из экзамена.
        </button>
        <button
          className="item"
          onClick={() => {
            navigate("/collections/ege/ege_inf/");
          }}
        >
          С помощью <b>подборок задач</b> Вы можете отточить свои навыки решения
          полноценных вариантов или отработать задания по конкретной теме.
        </button>
        <button
          className="item"
          onClick={() => {
            navigate("/courses/ege/ege_inf/");
          }}
        >
          Проходя <b>курсы</b> Вы можете получить новые знания.
        </button>
      </div>
      <h2>Для учителей</h2>
      <div className="main-section">
        <button
          className="item"
          onClick={() => {
            navigate("/lk/teach/");
          }}
        >
          Вы можете объединить своих учеников в <b>классы</b>, чтобы выдавать им
          домашние задания и следить за успеваемостью своих учеников.
        </button>
        <button
          className="item"
          onClick={() => {
            navigate("/lk/teach/");
          }}
        >
          Вы можете <b>добавлять на сайт</b> свои собственные задачи, подборки
          задач, а также можете создавать свои курсы.
        </button>
      </div>
    </div>
  );
};

export default Main;
