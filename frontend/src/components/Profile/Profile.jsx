import { useParams, useNavigate } from "react-router-dom";

import "./Profile.css";
import TeacherSection from "./TeacherSection/TeacherSection";
import { getMyClasses } from "../../server/class";
import { useEffect } from "react";
import { NavigateElement } from "./components/NavigateElement";

const Profile = () => {
  const { section } = useParams();

  return (
    <div className="lk">
      <h2>Личный кабинет</h2>
      <div className="lk-navigate">
        <NavigateElement path="dz" name="Домашние задания" />
        <NavigateElement path="history" name="История" />
        <NavigateElement path="stat" name="Статистика" />
        <NavigateElement path="teach" name=" Для учителей" />
      </div>

      {section === "teach" && <TeacherSection />}
    </div>
  );
};

export default Profile;
