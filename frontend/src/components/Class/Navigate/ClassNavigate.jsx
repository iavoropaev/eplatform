import { useNavigate, useParams } from "react-router-dom";

export const ClassNavigate = ({}) => {
  const navigate = useNavigate();
  const { classSection } = useParams();
  return (
    <div className="navigate-div">
      <button
        onClick={() => {
          navigate("./../messages/");
        }}
        className={
          "navigate-el navigate-button " +
          (classSection === "messages" ? "active" : "")
        }
      >
        Сообщения
      </button>
      <button
        onClick={() => {
          navigate("./../variants/");
        }}
        className={
          "navigate-el navigate-button " +
          (classSection === "variants" ? "active" : "")
        }
      >
        Варианты
      </button>
    </div>
  );
};
