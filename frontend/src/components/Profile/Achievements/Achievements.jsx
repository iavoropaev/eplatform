import { useEffect, useState } from "react";
import { getMyAchievements } from "../../../server/user";
import { showError } from "../../Utils/Notifications";
import "./Achievements.css";

export const Achievements = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const achievements = await getMyAchievements();
      if (achievements) {
        setAchievements(achievements);
      } else {
        showError("Ошибка загрузки.");
      }
    }
    fetchData();
  }, []);

  return (
    <div className="achievements-section">
      <h2>Мои достижения</h2>
      <div className="achievements">
        {achievements.map((ach) => {
          return (
            <div key={ach.id} className="ach-item" title={ach.description}>
              <div>{ach.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
