import { useNavigate, useParams } from "react-router-dom";

export const NavigateElement = ({ path, name }) => {
  const { section } = useParams();
  const navigate = useNavigate();
  return (
    <button
      className={path.startsWith(section) ? "el active" : "el"}
      onClick={() => {
        if (path === "stats/-/-") {
          navigate(`/lk/stats/-/-/`);
        } else {
          navigate(`/lk/${path}/`);
        }
      }}
    >
      {name}
    </button>
  );
};
