import { useNavigate, useParams } from "react-router-dom";

export const NavigateElement = ({ path, name }) => {
  const { section } = useParams();
  const navigate = useNavigate();
  return (
    <div
      className={section === path ? "el active" : "el"}
      onClick={() => {
        navigate(`./../${path}/`);
      }}
    >
      {name}
    </div>
  );
};
