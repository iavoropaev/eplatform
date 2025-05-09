import { useNavigate, useParams } from "react-router-dom";
import { activateInvitation } from "../../server/class";
import { showOK, showError } from "../Utils/Notifications";
import "./ActivateInvitation.css";

const ActivateInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const handleButton = async () => {
    const res = await activateInvitation({ token: token });

    if (res) {
      showOK("Приглашение активироано!");
      navigate("/lk/dz/");
    } else {
      showError("Произошла ошибка.");
    }
  };

  return (
    <div className="active-inv-cont">
      <h2>Вступление в класс</h2>
      <button onClick={handleButton}>Активировать приглашение</button>
      <p>
        После вступления в класс, автор класса сможет просматривать все Ваши
        результаты решения подборок задач.
      </p>
    </div>
  );
};

export default ActivateInvitation;
