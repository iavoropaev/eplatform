import { toast } from "react-toastify";
import "./Notifications.css";

export const showError = (text) => toast.error(text);
export const showOK = (text) => toast.success(text);
export const showCookiesWarning = () => {
  toast.info(
    <div className="cookies-warning">
      <p>
        Наш сайт использует файлы cookie чтобы улучшить работу сайта, повысить
        его эффективность и удобство. Продолжая использовать сайт, Вы
        соглашаетесь на использование файлов cookie.
      </p>
      <p>
        Пользуясь сайтом, Вы соглашаетесь с{" "}
        <a href="/privacy/" target="_blank" rel="noopener noreferrer">
          политикой конфиденциальности
        </a>
        .
      </p>
    </div>,
    {
      position: "bottom-center",
      autoClose: false,
      closeOnClick: true,
      closeButton: true,
    }
  );
};
