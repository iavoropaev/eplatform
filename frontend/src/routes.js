import NotFound from "./components/Pages/NotFound";
import Test from "./components/Pages/Test/Test";
import Variants from "./components/Pages/Variants";
import Bank from "./components/Pages/Bank/Bank";
import CreateTaskPage from "./components/Pages/Create task/CreateTaskPage";

export const publicRoutes = [
  { path: "edit-task/:taskId/", Component: CreateTaskPage },
  { path: "create-task/:taskId/", Component: CreateTaskPage },
  { path: "create-task/", Component: CreateTaskPage },
  { path: "bank", Component: Bank },
  { path: "test", Component: Test },
  { path: "variants", Component: Variants },
  { path: "*", Component: NotFound },
];

export const authRoutes = [];

export const adminRoutes = [];
