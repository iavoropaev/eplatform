import { useNavigate, useParams } from "react-router-dom";
import { activateInvitation } from "../../server/class";

const ActivateInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const handleButton = async () => {
    const res = await activateInvitation({ token: token });

    if (res) {
      alert("Приглашение активировано.");
      navigate("/");
    } else {
      alert("Произошла ошибка.");
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
