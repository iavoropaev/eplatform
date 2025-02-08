import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Pages/Main";
import MainLayout from "./layouts/redux/MainLayout";
import { adminRoutes, authRoutes, publicRoutes } from "./routes";

import "./App.css";

function App() {
  const isAuth = JSON.parse(localStorage.getItem("isAuth"));
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element=<MainLayout />>
            <Route index element=<Main />></Route>
            {isAdmin &&
              adminRoutes.map(({ path, Component }, i) => {
                return (
                  <Route key={i} path={path} element={<Component />}></Route>
                );
              })}

            {isAuth &&
              authRoutes.map(({ path, Component }, i) => {
                return (
                  <Route key={i} path={path} element={<Component />}></Route>
                );
              })}

            {publicRoutes.map(({ path, Component }, i) => {
              return (
                <Route key={i} path={path} element={<Component />}></Route>
              );
            })}
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
