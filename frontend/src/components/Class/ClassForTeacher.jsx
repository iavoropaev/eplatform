import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClassbyId } from "../../server/class";
import { ClassMessages } from "./Messages/ClassMessages";
import { ClassStudents } from "./Students/ClassStudents";
import "./ClassForTeacher.css";
import { ClassNavigate } from "./Navigate/ClassNavigate";
import { ClassVariants } from "./Variants/ClassVariants";

const ClassForTeacher = () => {
  const { classId, classSection } = useParams();

  const [classData, setClassData] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const classData = await getClassbyId(classId);
      if (classData) {
        setClassData(classData);
      }
    }
    fetchData();
  }, [classId]);

  if (!classData) {
    return <></>;
  }

  console.log(classData);

  return (
    <div className="teacher-class">
      <h2>{classData.name}</h2>
      <div className="stud-mes-cont">
        <ClassStudents classData={classData} setClassData={setClassData} />
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
