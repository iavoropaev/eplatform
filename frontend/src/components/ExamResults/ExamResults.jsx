import { useParams } from "react-router-dom";

const ExamResults = () => {
  const { slug } = useParams();
  return (
    <>
      <p>Результаты экзамена</p>
      <p>{slug}</p>
    </>
  );
};

export default ExamResults;
