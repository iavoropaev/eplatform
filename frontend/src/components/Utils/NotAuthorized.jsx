import Auth from "./Auth";
import "./NotAuthorized.css";
export const NotAuthorized = () => {
  return (
    <div className="not-auth">
      <h3>Для доступа к этой странице необходимо авторизоваться на сайте.</h3>
      <Auth />
    </div>
  );
};
