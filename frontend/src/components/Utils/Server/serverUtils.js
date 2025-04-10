export const prepareTask = (task) => {
  let answer = task.answer;
  try {
    answer = JSON.parse(task.answer);
  } catch (error) {}

  return { ...task, answer: answer };
};

export const logOut = () => {
  localStorage.clear();
  alert("Сессия истекла. Пожалуйста, авторизуйтесь заново.");
  window.location.reload();
};
