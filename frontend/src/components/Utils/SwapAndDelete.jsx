const SwapAndDelete = ({ erase, swap, index }) => {
  return (
    <div className="navigate">
      <div>
        <p
          className="delete"
          onClick={() => {
            erase(index);
          }}
        >
          ⨉
        </p>
      </div>
      <div className="arrows">
        <p
          className="arrow"
          onClick={() => {
            swap(index, index - 1);
          }}
        >
          ↑
        </p>
        <p
          className="arrow"
          onClick={() => {
            swap(index, index + 1);
          }}
        >
          ↓
        </p>
      </div>
    </div>
  );
};
export default SwapAndDelete;
