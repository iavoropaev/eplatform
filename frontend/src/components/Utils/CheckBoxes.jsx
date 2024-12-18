export const CheckBoxes = ({
  selectedBanks,
  bankAuthors,
  setSelectedBanks,
}) => {
  return (
    <div>
      {bankAuthors.map((item) => {
        return (
          <label key={item.id}>
            <input
              type="checkbox"
              checked={selectedBanks.includes(item.id)}
              onChange={() => {
                if (!selectedBanks.includes(item.id)) {
                  console.log("!", item.id);
                  setSelectedBanks([...selectedBanks, item.id]);
                } else {
                  setSelectedBanks(
                    selectedBanks.filter((el) => el !== item.id)
                  );
                }
              }}
            />
            {item.name}
          </label>
        );
      })}
    </div>
  );
};
