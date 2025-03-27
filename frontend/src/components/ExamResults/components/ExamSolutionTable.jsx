import SingleAnswer from "./SingleAnswer";
import "./ExamSolutionTable.css";

const ExamSolutionTable = ({ answers }) => {
  console.log(answers);
  return (
    <table className="results-table">
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
          <tr key={index} className={answer.status}>
            <td>{answer.number_in_exam}</td>
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
