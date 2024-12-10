import { useEffect } from "react";

const TaskTags = ({ options, selectedOption, setSelectedOption, name }) => {
  const handleChange = (event) => {
    setSelectedOption(Number(event.target.value));
  };
  console.log(options.length, selectedOption);

  useEffect(() => {
    console.log(options, selectedOption);
    if (!options.some((item) => item.id === selectedOption)) {
      setSelectedOption(-1);
    }
  }, [options, selectedOption, setSelectedOption]);

  return (
    <div>
      <select value={selectedOption} onChange={handleChange}>
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
