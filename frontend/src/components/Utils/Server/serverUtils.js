export const prepareTask = (task) => {
  return { ...task, answer: JSON.parse(task.answer) };
};
