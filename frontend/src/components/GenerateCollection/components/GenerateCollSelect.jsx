export const GenerateCollSelect = ({
  options,
  whatSelected,
  index,
  setSelected,
}) => {
  return (
    whatSelected &&
    options && (
      <td className={whatSelected[index] === "-" ? "" : "active-td"}>
        <select
          value={whatSelected[index]}
          onChange={(e) => {
            const newDls = [...whatSelected];
            newDls[index] = e.target.value;
            setSelected(newDls);
          }}
        >
          <option value={"-"}></option>

          {options.map((dl) => (
            <option value={dl.id} key={dl.id}>
              {dl.name}
            </option>
          ))}
        </select>
      </td>
    )
  );
};
