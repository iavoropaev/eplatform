import { Outlet } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <>
      <Menu />

      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
