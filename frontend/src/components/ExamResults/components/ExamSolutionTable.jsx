import SingleAnswer from "./SingleAnswer";
import "./ExamSolutionTable.css";

const ExamSolutionTable = ({ answers }) => {
  return (
    <table className="results-table" border="1">
      <thead>
        <tr>
          <th>№</th>
          <th>Балл</th>
          <th>Ваш ответ</th>
          <th>Правильный ответ</th>
        </tr>
      </thead>
      <tbody>
        {answers.map((answer, index) => (
          <tr key={index}>
            <td style={{ textAlign: "left" }}>{`${index + 1}. (${
              answer.number_in_exam
            })`}</td>
            <td>{answer.score}</td>
            <td>
              <SingleAnswer answer={answer.user_answer} />
            </td>
            <td>
              <SingleAnswer answer={answer.ok_answer} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExamSolutionTable;
