import { useParams } from "react-router-dom";
import TeacherSection from "./TeacherSection/TeacherSection";
import { NavigateElement } from "./components/NavigateElement";
import HistorySection from "./HistorySection/HistorySection";
import MessagesSection from "./MessagesSection/MessagesSection";
import Settings from "./Settings/Settings";
import { Achievements } from "./Achievements/Achievements";
import { StatisticsSection } from "./StatisticsSection/StatisticsSection";
import "./Profile.css";

const Profile = () => {
  const { section } = useParams();

  return (
    <div className="lk">
      <h2>Личный кабинет</h2>
      <div className="lk-navigate">
        <NavigateElement path="dz" name="Сообщения" />
        <NavigateElement path="history" name="История" />
        <NavigateElement path="stats/ege/ege_inf" name="Статистика" />
        <NavigateElement path="achievements" name="Достижения" />
        <NavigateElement path="teach" name="Для учителей" />
        <NavigateElement path="settings" name="Настройки" />
      </div>

      {section === "teach" && <TeacherSection />}
      {section === "history" && <HistorySection />}
      {section === "dz" && <MessagesSection />}
      {section === "settings" && <Settings />}
      {section === "achievements" && <Achievements />}
      {section === "stats" && <StatisticsSection />}
    </div>
  );
};

export default Profile;
