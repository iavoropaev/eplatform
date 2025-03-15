import "./BankFilter.css";

import Choice from "./Choice";
import Option from "./Option";

const BankFilter = ({
  getSelectFromFilter,
  filterData,
  countFind,
  selectedFilters,
  handleFindButtonClick,
  isLoading,
}) => {
  const activeExam = filterData["exams"][selectedFilters["exam"]];
  const activeSubject = activeExam["subjects"][selectedFilters["subject"]];
  const activeSource = activeSubject["sources"][selectedFilters["source"]];

  const subjects = activeExam["subjects"];
  const sources = activeSubject["sources"];
  const numbers = activeSubject["numbers"];
  const authors = activeSubject["authors"];
  const difficulty_levels = activeExam["dif_levels"];
  const actualities = filterData["actualities"];

  return (
    <div className="bank-filter">
      <div className="choise-row">
        <div className="exam">
          <Choice
            selectedId={selectedFilters["exam"]}
            data={filterData["exams"]}
            name={"exam"}
            setSelect={getSelectFromFilter}
          />
        </div>
        <div className="subject">
          {subjects.length > 0 && (
            <Choice
              selectedId={selectedFilters["subject"]}
              data={subjects}
              name={"subject"}
              setSelect={getSelectFromFilter}
            />
          )}
        </div>
      </div>

      {sources.length > 0 && (
        <div className="choise-row">
          <div className="source">
            {
              <Choice
                selectedId={selectedFilters["source"]}
                data={sources}
                name={"source"}
                setSelect={getSelectFromFilter}
              />
            }
          </div>
        </div>
      )}

      <div className="filter-row">
        {numbers && numbers.length > 0 && (
          <Option
            optionName={"numbers"}
            nameForUsers={"Номер"}
            options={numbers}
            selected={selectedFilters["numbers"]}
            setSelect={getSelectFromFilter}
          />
        )}
        {authors && authors.length > 0 && (
          <Option
            optionName={"authors"}
            nameForUsers={"Автор"}
            options={authors}
            selected={selectedFilters["authors"]}
            setSelect={getSelectFromFilter}
          />
        )}
        {difficulty_levels && difficulty_levels.length > 0 && (
          <Option
            optionName={"dif_levels"}
            nameForUsers={"Сложность"}
            options={difficulty_levels}
            selected={selectedFilters["dif_levels"]}
            setSelect={getSelectFromFilter}
          />
        )}

        {actualities && actualities.length > 0 && (
          <Option
            optionName={"actualities"}
            nameForUsers={"Актуальность"}
            options={actualities}
            selected={selectedFilters["actualities"]}
            setSelect={getSelectFromFilter}
          />
        )}
      </div>
      <div className="button-row">
        {countFind !== undefined && !isLoading && (
          <p className="count-find">{`Найдено ${countFind} задач.`}</p>
        )}

        <button
          onClick={handleFindButtonClick}
          className="black-button"
          disabled={isLoading}
        >
          {isLoading ? "Поиск..." : "Найти задачи"}
        </button>
      </div>
    </div>
  );
};

export default BankFilter;
