export const getPreparedFilterData = ({
  filterData,
  selectedExam,
  selectedSubject,
  selectedNumber,
}) => {
  let exams = filterData["exams"];
  exams = exams ? exams : [];
  const activeExam = exams.find((item) => item.id === selectedExam);

  let subjects = activeExam?.subjects;
  subjects = subjects ? subjects : [];
  const activeSubject = subjects.find((item) => item.id === selectedSubject);

  let numbers = activeSubject?.numbers;
  numbers = numbers ? numbers : [];
  const activeNumber = numbers.find((item) => item.id === selectedNumber);

  let bankAuthors = activeSubject?.sources;
  bankAuthors = bankAuthors ? bankAuthors : [];

  let difficulty_levels = activeExam?.dif_levels;
  difficulty_levels = difficulty_levels ? difficulty_levels : [];

  let actualities = filterData?.actualities;
  actualities = actualities ? actualities : [];

  return {
    exams,
    subjects,
    numbers,
    activeExam,
    activeSubject,
    activeNumber,
    bankAuthors,
    actualities,
    difficulty_levels,
  };
};
