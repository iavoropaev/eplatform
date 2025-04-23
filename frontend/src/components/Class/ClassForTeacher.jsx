import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { excludeUserFromClass, getClassbyId } from "../../server/class";
import { ClassMessages } from "./Messages/ClassMessages";
import { ClassStudents } from "./Students/ClassStudents";
import { ClassNavigate } from "./Navigate/ClassNavigate";
import { ClassVariants } from "./Variants/ClassVariants";
import { showError, showOK } from "../Utils/Notifications";
import "./ClassForTeacher.css";

const ClassForTeacher = () => {
  const { classId, classSection } = useParams();

  const [classData, setClassData] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const classData = await getClassbyId(classId);
      if (classData) {
        setClassData(classData);
      } else {
        showError("Не удалось загрузить.");
      }
    }
    fetchData();
  }, [classId]);

  const handleStudentDelBut = async (studentId) => {
    if (window.confirm("Исключить ученика из класса?")) {
      const res = await excludeUserFromClass({
        excluded_user_id: studentId,
        class_id: classId,
      });
      if (res !== undefined) {
        const classData = await getClassbyId(classId);
        if (classData) {
          setClassData(classData);
        } else {
          showError("Не удалось загрузить.");
        }
        showOK("Ученик исключён.");
      } else {
        showError("Произошла ошибка.");
      }
    }
  };
  if (!classData) {
    return <></>;
  }

  return (
    <div className="teacher-class">
      <h2>{classData.name}</h2>
      <div className="stud-mes-cont">
        <ClassStudents
          classData={classData}
          setClassData={setClassData}
          handleStudentDelBut={handleStudentDelBut}
        />
        <ClassNavigate />
        {classSection === "messages" && (
          <ClassMessages classData={classData} setClassData={setClassData} />
        )}
        {classSection === "variants" && (
          <ClassVariants students={classData.students} />
        )}
      </div>
    </div>
  );
};

export default ClassForTeacher;
