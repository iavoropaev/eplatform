import "./BankFilter.css";

import Choice from "./Choice";
import Option from "./Option";

const BankFilter = ({
  getSelectFromFilter,
  filterData,
  selectedFilters,
  handleFindButtonClick,
}) => {
  const activeExam = filterData[selectedFilters["exam"]];
  const activeSubject = activeExam["subjects"][selectedFilters["subject"]];
  const activeSource = activeSubject["sources"][selectedFilters["source"]];

  const subjects = activeExam["subjects"];
  const sources = activeSubject["sources"];
  const numbers = activeSubject["numbers"];
  const authors = activeSubject["authors"];

  return (
    <div className="bank-filter">
      <div className="choise-row">
        <div className="exam">
          <Choice
            selectedId={selectedFilters["exam"]}
            data={filterData}
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
            nameForUsers={"Номер ЕГЭ"}
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
      </div>
      <div className="button-row">
        <button onClick={handleFindButtonClick} className="black-button">
          Найти задачи
        </button>
      </div>
    </div>
  );
};

export default BankFilter;
