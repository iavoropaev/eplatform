import { useEffect, useState } from "react";
import { getMyStudentExamsSolutions } from "../../../server/exam";
import { Solution } from "../../Profile/HistorySection/components/Solution";
import { showError } from "../../Utils/Notifications";

export const ClassVariants = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState("-");
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (selectedStudent !== "-") {
        const solutions = await getMyStudentExamsSolutions(selectedStudent);
        if (solutions) {
          setSolutions(solutions);
        } else {
          showError("Ошибка.");
        }
      }
    }
    fetchData();
  }, [selectedStudent]);

  return (
    <div>
      <div>
        <select
          value={selectedStudent}
          onChange={(e) => {
            setSelectedStudent(e.target.value);
          }}
        >
          <option value={"-"} disabled>
            Выберите ученика
          </option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.first_name[0] + ". " + student.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="exam-solutions-section">
        <div className="exam-solutions">
          {solutions.map((sol) => {
            return (
              <Solution
                key={sol.id}
                solution={sol}
                handleDelete={() => {}}
                hideDelete={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
