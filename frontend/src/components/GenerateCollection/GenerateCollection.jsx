import { useParams } from "react-router-dom";
import { getFilterData } from "../../server/bank";
import { useEffect, useState } from "react";
import "./GenerateCollection.css";
import { GenerateCollSelect } from "./components/GenerateCollSelect";
import { SubjectSelect } from "./components/SubjectSelect";
import { generateCollection } from "../../server/collections";
const GenerateCollection = () => {
  const { examSlug, subjectSlug } = useParams();

  const [filterData, setFilterData] = useState(undefined);
  const [countForEachNumber, setCountForEachNumber] = useState(undefined);
  const [dlForEachNumber, setDlForEachNumber] = useState(undefined);
  const [authorsForEachNumber, setAuthorsForEachNumber] = useState(undefined);
  const [actsForEachNumber, setActsForEachNumber] = useState(undefined);

  const [dlForAllNumber, setDlForAllNumber] = useState("-");
  const [authorsForAllNumber, setAuthorsForAllNumber] = useState("-");
  const [actForAllNumber, setActForAllNumber] = useState("-");

  const activeExam = filterData?.exams?.filter(
    (exam) => exam?.slug === examSlug
  )[0];
  const activeSubject = activeExam?.subjects?.filter(
    (subj) => subj?.slug === subjectSlug
  )[0];
  const subjects = activeExam?.subjects;
  //   const sources = activeSubject["sources"];
  const numbers = activeSubject?.numbers;
  const authors = activeSubject?.authors;
  const difficulty_levels = activeExam?.dif_levels;
  const actualities = filterData?.actualities;

  useEffect(() => {
    async function fetchData() {
      const data = await getFilterData();
      setFilterData(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setCountForEachNumber(numbers?.map((_) => 1));
    setDlForEachNumber(numbers?.map((_) => "-"));
    setAuthorsForEachNumber(numbers?.map((_) => "-"));
    setActsForEachNumber(numbers?.map((_) => "-"));
  }, [activeSubject, numbers]);

  const getNewNumber = (old, newCount) => {
    const number = Number(newCount);
    if ((number !== undefined && number >= 0) || newCount === "") {
      return newCount === "" ? newCount : number;
    } else {
      return old;
    }
  };
  const setCount = (newCount, index) => {
    const newdata = [...countForEachNumber];
    const number = Number(newCount);
    if ((number !== undefined && number >= 0) || newCount === "") {
      newdata[index] = newCount === "" ? newCount : number;
      setCountForEachNumber(newdata);
    }
  };

  const handleGenerateBut = async () => {
    const generateParams = [];
    for (let i = 0; i < numbers.length; i++) {
      generateParams.push({
        number: numbers[i],
        count: countForEachNumber[i],
        difficulty: dlForEachNumber[i],
        author: authorsForEachNumber[i],
        actuality: actsForEachNumber[i],
      });
    }
    const res = await generateCollection(generateParams);
    console.log(res);
  };
  console.log("!!!", actualities);

  if (!filterData) {
    return <></>;
  }
  return (
    <div>
      <SubjectSelect filterData={filterData} subjects={subjects} />

      <table className="gen-col-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Количество</th>
            <th>Сложность</th>
            <th>Автор</th>
            <th>Актуальность</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Применить ко всем</td>
            <td>
              <button
                className="count-but"
                onClick={() => {
                  const data = countForEachNumber.map((el, i) =>
                    getNewNumber(el, el - 1)
                  );
                  setCountForEachNumber(data);
                }}
              >
                -
              </button>
              <button
                onClick={() => {
                  const data = countForEachNumber.map((el, i) =>
                    getNewNumber(el, el + 1)
                  );
                  setCountForEachNumber(data);
                }}
                className="count-but"
              >
                +
              </button>
            </td>
            <GenerateCollSelect
              options={difficulty_levels}
              whatSelected={[dlForAllNumber]}
              index={0}
              setSelected={(list) => {
                const newValue = list[0];
                setDlForEachNumber(numbers.map((_) => newValue));
                setDlForAllNumber(newValue);
              }}
            />
            <GenerateCollSelect
              options={authors}
              whatSelected={[authorsForAllNumber]}
              index={0}
              setSelected={(list) => {
                const newValue = list[0];
                setAuthorsForEachNumber(numbers.map((_) => newValue));
                setAuthorsForAllNumber(newValue);
              }}
            />
            <GenerateCollSelect
              options={actualities}
              whatSelected={[actForAllNumber]}
              index={0}
              setSelected={(list) => {
                const newValue = list[0];
                setActsForEachNumber(numbers.map((_) => newValue));
                setActForAllNumber(newValue);
              }}
            />
          </tr>
          {numbers &&
            numbers.map((number, index) => (
              <tr key={number.id}>
                <td>{number.name}</td>
                {countForEachNumber && (
                  <td>
                    <input
                      className="count-input"
                      value={countForEachNumber[index]}
                      onChange={(e) => {
                        setCount(e.target.value, index);
                      }}
                    ></input>
                    <button
                      className="count-but"
                      onClick={() => {
                        setCount(countForEachNumber[index] - 1, index);
                      }}
                    >
                      -
                    </button>
                    <button
                      onClick={() => {
                        setCount(countForEachNumber[index] + 1, index);
                      }}
                      className="count-but"
                    >
                      +
                    </button>
                  </td>
                )}

                <GenerateCollSelect
                  options={difficulty_levels}
                  whatSelected={dlForEachNumber}
                  index={index}
                  setSelected={setDlForEachNumber}
                />
                <GenerateCollSelect
                  options={authors}
                  whatSelected={authorsForEachNumber}
                  index={index}
                  setSelected={setAuthorsForEachNumber}
                />

                <GenerateCollSelect
                  options={actualities}
                  whatSelected={actsForEachNumber}
                  index={index}
                  setSelected={setActsForEachNumber}
                />
              </tr>
            ))}
        </tbody>
      </table>

      <button onClick={handleGenerateBut} className="black-button">
        Сгенерировать
      </button>
    </div>
  );
};
export default GenerateCollection;
