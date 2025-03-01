import { useNavigate, useParams } from "react-router-dom";

export const ClassNavigate = ({}) => {
  const navigate = useNavigate();
  const { classSection } = useParams();
  return (
    <div className="navigate-div">
      <div
        onClick={() => {
          navigate("./../messages/");
        }}
        className={
          "navigate-el " + (classSection === "messages" ? "active" : "")
        }
      >
        Сообщения
      </div>
      <div
        onClick={() => {
          navigate("./../variants/");
        }}
        className={
          "navigate-el " + (classSection === "variants" ? "active" : "")
        }
      >
        Варианты
      </div>
    </div>
  );
};
