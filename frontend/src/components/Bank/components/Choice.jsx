const Choice = ({ data, setSelect, name, selectedId }) => {
  return (
    <>
      {data.map((item, i) => {
        return (
          <button
            onClick={(e) => {
              setSelect(name, i);
            }}
            className={
              i === selectedId ? "active navigate-button" : "navigate-button"
            }
            key={i}
          >
            {item.name}
          </button>
        );
      })}
    </>
  );
};

export default Choice;
