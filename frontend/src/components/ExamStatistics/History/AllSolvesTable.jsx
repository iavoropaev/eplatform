import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../Utils/dates";
import "./AllSolvesTable.css";
export const AllSolvesTable = ({ data }) => {
  const { examSlug } = useParams();
  const navigate = useNavigate();

  const allNumbers = data[0]?.answers?.map((ans) => ans.number_in_exam);

  return (
    <div className="all-solves">
      <table className="all-solves-table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Баллы</th>
            <th>Время</th>
            <th>Дата</th>
            {allNumbers.map((number, i) => (
              <th key={i}>{number}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((solution) => (
            <tr key={solution.id}>
              <td
                className="user-name"
                onClick={
                  () =>
                    window.open(
                      `/variant/${examSlug}/results/id/${solution.id}/`,
                      "_blanc"
                    )
                  //navigate(`/variant/${examSlug}/results/id/${solution.id}/`)
                }
              >
                {solution.user.first_name[0]}. {solution.user.last_name}
              </td>
              <td>{solution.score}</td>
              <td>{solution.duration}</td>
              <td>{formatDate(solution.time_create, "short")}</td>
              {solution.answers.map((ans, i) => {
                return <td key={i}>{ans.score}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
