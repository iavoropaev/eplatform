import NotFound from "./components/Pages/NotFound";
import Test from "./components/Pages/Test/Test";
import Variants from "./components/Pages/Variants";
import Bank from "./components/Pages/Bank/Bank";
import CreateTask from "./components/Pages/Create task/CreateTask";

export const publicRoutes = [
  { path: "create-task", Component: CreateTask },
  { path: "bank", Component: Bank },
  { path: "test", Component: Test },
  { path: "*", Component: NotFound },
  { path: "variants", Component: Variants },
];

export const authRoutes = [];

export const adminRoutes = [];
