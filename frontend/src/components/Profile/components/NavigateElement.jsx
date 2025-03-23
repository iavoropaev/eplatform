import { useNavigate, useParams } from "react-router-dom";

export const NavigateElement = ({ path, name }) => {
  const { section } = useParams();
  const navigate = useNavigate();
  return (
    <button
      className={section === path ? "el active" : "el"}
      onClick={() => {
        navigate(`./../${path}/`);
      }}
    >
      {name}
    </button>
  );
};
