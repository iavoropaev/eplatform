import { Outlet } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <>
      <div className="main-container">
        <Menu />
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
