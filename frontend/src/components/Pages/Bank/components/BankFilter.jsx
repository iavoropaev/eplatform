import { useState } from "react";
import "./BankFilter.css";
import { EXAMS, NUMBERSEGE, SOURCES, SUBJECTS } from "./bankFilterData";
import Choice from "./Choice";
import Option from "./Option";

const BankFilter = ({ getSelectFromFilter, filterData, selectedFilters }) => {
  const [selected, setSelected] = useState({ numberEGE: [] });
  const [showOptions, setShowOptions] = useState([]);
  console.log(showOptions);

  const activeExam = filterData[selectedFilters["exam"]];
  const activeSubject = activeExam["subjects"][selectedFilters["subject"]];
  const activeSource = activeSubject["sources"][selectedFilters["source"]];

  console.log("!!!!!!", activeExam, activeSubject, activeSource);

  const subjects = activeExam["subjects"];
  const sources = activeSubject["sources"];
  const numbers = activeSource["numbers"];

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
          {
            <Choice
              selectedId={selectedFilters["subject"]}
              data={subjects}
              name={"subject"}
              setSelect={getSelectFromFilter}
            />
          }
        </div>
      </div>

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

      <div className="filter-row">
        <Option
          optionName={"numbers"}
          nameForUsers={"Номер ЕГЭ"}
          options={numbers}
          selected={selectedFilters["numbers"]}
          setSelect={getSelectFromFilter}
        />
        <span>Тема</span>
        <span>Сложность</span>
        <span>Автор</span>
      </div>
      <div className="button-row">
        <button className="black-button">Найти задачи</button>
      </div>
    </div>
  );
};

export default BankFilter;
