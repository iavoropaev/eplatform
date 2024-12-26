import NotFound from "./components/Pages/NotFound";
import Test from "./components/Pages/Test/Test";
import Variants from "./components/Pages/Variants";
import CreateTaskPage from "./components/Pages/Create task/CreateTaskPage";
import BankPage from "./components/Pages/Bank/BankPage";

export const publicRoutes = [
  { path: "edit-task/:taskId/", Component: CreateTaskPage },
  { path: "create-task/:taskId/", Component: CreateTaskPage },
  { path: "create-task/", Component: CreateTaskPage },
  { path: "bank", Component: BankPage },
  { path: "test", Component: Test },
  { path: "variants", Component: Variants },
  { path: "*", Component: NotFound },
];

export const authRoutes = [];

export const adminRoutes = [];
