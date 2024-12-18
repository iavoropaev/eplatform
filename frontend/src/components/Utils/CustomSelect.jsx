export const CustomSelect = ({ selected, options, handleSelect }) => {
  return (
    <select value={selected} onChange={handleSelect}>
      {options.map((opt, i) => {
        return (
          <option key={i} value={opt}>
            {opt}
          </option>
        );
      })}
    </select>
  );
};
