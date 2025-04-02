export const prepareTask = (task) => {
  let answer = task.answer;
  try {
    answer = JSON.parse(task.answer);
  } catch (error) {}

  return { ...task, answer: answer };
};
