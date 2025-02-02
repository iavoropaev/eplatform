import { useEffect } from "react";

const TaskTags = ({ options, selectedOption, setSelectedOption, name }) => {
  const handleChange = (event) => {
    setSelectedOption(Number(event.target.value));
  };

  useEffect(() => {
    if (!options.some((item) => item.id === selectedOption)) {
      setSelectedOption(-1);
    }
  }, [options, selectedOption, setSelectedOption]);

  return (
    <div>
      <select
        className={selectedOption === -1 ? "NC" : "OK"}
        value={selectedOption}
        onChange={handleChange}
      >
        <option value={-1} disabled>
          {name}
        </option>
        {options.map((option, i) => {
          return (
            <option value={option.id} key={i}>
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default TaskTags;
