import { useNavigate, useParams } from "react-router-dom";
import { activateInvitation } from "../../server/class";
import { showOK, showError } from "../Utils/Notifications";

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
    <div>
      <h2>Вступление в класс</h2>
      <button onClick={handleButton}>Активировать приглашение</button>
    </div>
  );
};
export default ActivateInvitation;
