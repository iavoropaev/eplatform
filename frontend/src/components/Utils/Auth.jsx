import { useEffect } from "react";
import * as VKID from "@vkid/sdk";

import "./Auth.css";

const Auth = () => {
  VKID.Config.set({
    app: process.env.REACT_APP_VKID_APPLICATION_ID, // Идентификатор приложения.
    redirectUrl: process.env.REACT_APP_AUTH_REDIRECT_URL, // Адрес для перехода после авторизации.
  });

  useEffect(() => {
    async function fetchData() {}

    // Создание экземпляра кнопки.
    const oneTap = new VKID.OneTap();

    // Получение контейнера из разметки.
    const container = document.getElementById("VkIdSdkOneTap");

    // Проверка наличия кнопки в разметке.
    if (container) {
      // Отрисовка кнопки в контейнере с именем приложения APP_NAME, светлой темой и на русском языке.
      oneTap.render({ container: container });
    }
    fetchData();
  }, []);

  return (
    <div className="vk-auth">
      <div id="VkIdSdkOneTap"></div>
    </div>
  );
};

export default Auth;
