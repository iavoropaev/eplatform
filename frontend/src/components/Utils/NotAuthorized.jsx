import { useState } from "react";
import Auth from "./Auth";
import "./NotAuthorized.css";
export const NotAuthorized = () => {
  const [isAgree, setAgree] = useState(false);

  return (
    <div className="not-auth">
      <h3>Для доступа к этой странице необходимо авторизоваться на сайте.</h3>
      <div className={!isAgree ? "disabled-auth" : ""}>
        <Auth />
      </div>

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
    </div>
  );
};
