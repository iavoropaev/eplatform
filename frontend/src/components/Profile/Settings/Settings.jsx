import { useEffect, useState } from "react";
import { deleteSolution, getMyExamsSolutions } from "../../../server/exam";
import { showError } from "../../Utils/Notifications";
import { useNavigate } from "react-router-dom";
import { getTgInvitation, getTgLinkStatus } from "../../../server/auth";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const [isLinked, setLinked] = useState(undefined);
  const [invitation, setInvitation] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const status = await getTgLinkStatus();
      console.log(invitation);
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
      console.log(invitation);
      if (invitation) {
        setInvitation(
          "https://t.me/Test_python_aiogram_bot?start=" + invitation.inv_token
        );
      } else {
        showError("Ошибка загрузки.");
      }
    }
  };

  const logOut = () => {
    localStorage.clear();
    navigate("/", { relative: "path" });
    window.location.reload();
  };

  return (
    <div className="settings-section">
      <h2>Настройки</h2>

      <div className="tg">
        <h3>Привязка телеграм аккаунта</h3>
        {isLinked === undefined && <p>Загрузка...</p>}
        {isLinked !== undefined && isLinked === false && (
          <details>
            <summary onClick={getLink}>Получить ссылку для привязки.</summary>
            {invitation && (
              <div>
                <a href={invitation} target="_blank" rel="noopener noreferrer">
                  Ссылка для привязки аккаунта (нажмите)
                </a>
              </div>
            )}
            {!invitation && "Загрузка..."}

            <p className="warning">Никому не передавайте данную ссылку!!!</p>
          </details>
        )}
        {isLinked !== undefined && isLinked === true && (
          <div>
            <p>Аккаунт успешно привязан.</p>

            <a
              href={"https://t.me/Test_python_aiogram_bot?start=logout"}
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
