import NotFound from "./components/Pages/NotFound";
import Test from "./components/Pages/Test/Test";
import Variants from "./components/Pages/Variants";
import Bank from "./components/Pages/Bank/Bank";

export const publicRoutes = [
  { path: "test", Component: Test },
  { path: "bank", Component: Bank },
  { path: "*", Component: NotFound },
  { path: "variants", Component: Variants },
];

export const authRoutes = [];

export const adminRoutes = [];
