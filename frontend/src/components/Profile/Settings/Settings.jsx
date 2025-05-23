import { useEffect, useState } from "react";
import { showError } from "../../Utils/Notifications";
import { useNavigate } from "react-router-dom";
import { getTgInvitation, getTgLinkStatus } from "../../../server/auth";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();

  const [isAgree, setAgree] = useState(false);
  const [isLinked, setLinked] = useState(undefined);
  const [invitation, setInvitation] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const status = await getTgLinkStatus();
      if (status !== undefined) {
        setLinked(status);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, []);

  const getLink = async () => {
    if (invitation === undefined) {
      const invitation = await getTgInvitation();
      if (invitation) {
        setInvitation(process.env.REACT_APP_BOT_URL + invitation.inv_token);
      } else {
        showError("Ошибка загрузки.");
      }
    }
  };

  const logOut = () => {
    localStorage.clear();
    localStorage.setItem("showCookiesWarning", "false");
    navigate("/", { relative: "path" });
    window.location.reload();
  };

  return (
    <div className="settings-section">
      <div className="tg">
        <h3>Привязка телеграм аккаунта</h3>
        {isLinked === undefined && <p>Загрузка...</p>}
        {isLinked !== undefined && isLinked === false && (
          <div>
            <div className="approval-cont">
              <span>
                Я соглашаюсь с{" "}
                <a href="/privacy/" target="_blank" rel="noopener noreferrer">
                  политикой конфиденциальности
                </a>{" "}
                и разрешаю обрабатывать мои персональные данные{" "}
                <input
                  type="checkbox"
                  value={isAgree}
                  onChange={(e) => setAgree(e.target.checked)}
                ></input>
              </span>{" "}
            </div>
            <details className={!isAgree ? "disabled-auth" : ""}>
              <summary onClick={getLink}>Получить ссылку для привязки.</summary>
              {invitation && (
                <div>
                  <a
                    href={invitation}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ссылка для привязки аккаунта (нажмите)
                  </a>
                </div>
              )}
              {!invitation && "Загрузка..."}

              <p className="warning">Никому не передавайте данную ссылку!!!</p>
            </details>
          </div>
        )}
        {isLinked !== undefined && isLinked === true && (
          <div>
            <p>Аккаунт успешно привязан.</p>

            <a
              href={process.env.REACT_APP_BOT_URL + "logout"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ссылка для отвязки аккаунта (нажмите)
            </a>
          </div>
        )}
      </div>
      <div className="logout">
        <h3>Выйти из аккаунта на сайте</h3>
        <button onClick={logOut}>Выйти из аккаунта</button>
      </div>
    </div>
  );
};

export default Settings;
