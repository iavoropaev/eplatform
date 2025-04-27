import { useState } from "react";
import { AllSolvesTable } from "./AllSolvesTable";

export const AllExamResults = ({
  solvesData,
  selectedClass,
  allClasses,
  setSelectedClass,
  testColName,
}) => {
  const [whatAttempt, setWhatAttempt] = useState("first");

  const eraseDuplicates = (data) => {
    const map = new Map();
    data.forEach((attempt) => {
      if (!map.has(attempt.user.id)) {
        map.set(attempt.user.id, attempt);
      }
    });
    return Array.from(map.values());
  };

  let sortedAttempts = [...solvesData];

  if (whatAttempt === "first") {
    sortedAttempts = sortedAttempts.sort(
      (a, b) => Date.parse(a.time_create) - Date.parse(b.time_create)
    );
  }

  if (whatAttempt === "last" || whatAttempt === "all") {
    sortedAttempts = sortedAttempts.sort(
      (a, b) => -Date.parse(a.time_create) + Date.parse(b.time_create)
    );
  }

  if (whatAttempt === "best") {
    sortedAttempts = sortedAttempts.sort((a, b) => -a.score + b.score);
  }

  let filteredSolvesData = [...sortedAttempts];
  if (!(whatAttempt === "all")) {
    filteredSolvesData = eraseDuplicates(filteredSolvesData);
  }

  return (
    <div className="all-results-cont">
      <div className="selects">
        <select
          value={whatAttempt}
          onChange={(e) => setWhatAttempt(e.target.value)}
        >
          <option value="all">Все попытки</option>
          <option value="best">Лучшая попытка</option>
          <option value="last">Последняя попытка</option>
          <option value="first">Первая попытка</option>
        </select>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value={"-"}>Выберите класс</option>
          {allClasses &&
            allClasses.map((el) => (
              <option value={el.id} key={el.id}>
                {el.name}
              </option>
            ))}
        </select>
      </div>

      {filteredSolvesData.length > 0 && (
        <div className="res-table-cont">
          {`Результатов: ${filteredSolvesData.length}.`}
          <AllSolvesTable data={filteredSolvesData} testColName={testColName} />
        </div>
      )}
      {filteredSolvesData.length === 0 && <h3>Решения не найдены.</h3>}
    </div>
  );
};
