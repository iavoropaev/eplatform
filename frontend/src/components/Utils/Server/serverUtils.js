export const prepareTask = (task) => {
  let answer = "";
  try {
    answer = JSON.parse(task.answer);
  } catch (error) {
    answer = "";
  }

  return { ...task, answer: answer };
};
