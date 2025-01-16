import SingleAnswer from "./SingleAnswer";

const ExamSolutionTable = ({ answers }) => {
  return (
    <table border="1">
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
