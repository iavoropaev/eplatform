import { useEffect, useState } from "react";
import { getSolvesStatisticsBySubject } from "../../../server/user";
import { showError } from "../../Utils/Notifications";
import { SubjectSelect } from "../../Utils/SubjectSelect/SubjectSelect";
import { useParams } from "react-router-dom";
import { getSolvesExamStatisticsBySubject } from "../../../server/exam";
import "./StatisticsSection.css";

export const StatisticsSection = () => {
  const { subjectSlug } = useParams();

  const [numberStats, setNumberStats] = useState(undefined);
  const [collectionStats, setCollectionStats] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      if (subjectSlug !== undefined && subjectSlug !== "-") {
        const numberStats = await getSolvesStatisticsBySubject(subjectSlug);
        const collectionStats = await getSolvesExamStatisticsBySubject(
          subjectSlug
        );
        if (numberStats && collectionStats) {
          setNumberStats(numberStats);
          setCollectionStats(collectionStats);
        } else {
          showError("Ошибка загрузки.");
        }
      } else {
        setNumberStats(undefined);
        setCollectionStats(undefined);
      }
    }
    fetchData();
  }, [subjectSlug]);

  return (
    <div className="stats-section">
      <h3>Моя статистика</h3>
      <SubjectSelect />

      <div className="numbers-stats-section">
        {numberStats !== undefined && numberStats.length > 0 && (
          <>
            <h3>Статистика по номерам</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Всего задач решалось</th>
                  <th>Правильно решено*</th>
                  <th>{"%"}</th>
                </tr>
              </thead>
              <tbody>
                {numberStats.map((number) => (
                  <tr key={number.id}>
                    <td>{number.name}</td>
                    <td>{number.total_tried_tasks}</td>
                    <td>{number.solved_tasks}</td>
                    <td>{number.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              * Задача считается правильно решённой только в том случае, когда
              первое отправленное на неё решение верно.
            </p>
          </>
        )}
      </div>

      <div className="exams-stats">
        {collectionStats !== undefined && (
          <>
            <h3>Статистика по вариантам</h3>
            <div className="tables-cont">
              <table className="table">
                <thead>
                  <tr>
                    <th>Тип</th>
                    <th>Балл</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Максимальный балл"}</td>
                    <td>{collectionStats.max_score}</td>
                  </tr>
                  <tr>
                    <td>{"Средний балл"}</td>
                    <td>{collectionStats.avg_score}</td>
                  </tr>
                  <tr>
                    <td>{"Последний результат"}</td>
                    <td>{collectionStats.last_score}</td>
                  </tr>
                </tbody>
              </table>
              {(collectionStats.score_100_count > 0 ||
                collectionStats.score_90_99_count > 0 ||
                collectionStats.score_80_89_count > 0 ||
                collectionStats.score_60_79_count > 0) && (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Набрано</th>
                      <th>Количество раз</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"100 баллов"}</td>
                      <td>{collectionStats.score_100_count}</td>
                    </tr>
                    <tr>
                      <td>{"90-99 баллов"}</td>
                      <td>{collectionStats.score_90_99_count}</td>
                    </tr>
                    <tr>
                      <td>{"80-89 баллов"}</td>
                      <td>{collectionStats.score_80_89_count}</td>
                    </tr>
                    <tr>
                      <td>{"60-79 баллов"}</td>
                      <td>{collectionStats.score_60_79_count}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
