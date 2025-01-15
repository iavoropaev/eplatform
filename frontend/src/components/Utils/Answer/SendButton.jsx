export const SendButton = ({ handle, disabled }) => {
  return (
    <>
      <button disabled={disabled} onClick={handle}>
        Проверить ответ
      </button>
    </>
  );
};
