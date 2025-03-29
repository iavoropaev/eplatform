import { useEffect, useState } from "react";
import { getMyAchievements } from "../../../server/user";
import { showError } from "../../Utils/Notifications";
import "./Achievements.css";

export const Achievements = () => {
  const [achievements, setAchievements] = useState(undefined);

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
      <h3>Мои достижения</h3>
      <div className="achievements">
        {achievements &&
          achievements.map((ach) => {
            return (
              <div key={ach.id} className="ach-item" title={ach.description}>
                <div>{ach.name}</div>
              </div>
            );
          })}
        {achievements?.length === 0 && <p>Достижений пока не получено.</p>}
        {achievements === undefined && <p>Загрузка...</p>}
      </div>
    </div>
  );
};
