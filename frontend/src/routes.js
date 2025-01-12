import NotFound from "./components/Pages/NotFound";
import Test from "./components/Pages/Test/Test";
import Variants from "./components/Pages/Variants";
import CreateTaskPage from "./components/Pages/Create task/CreateTaskPage";
import BankPage from "./components/Pages/Bank/BankPage";
import CreateCollectionPage from "./components/Pages/Create collection/CreateCollectionPage";
import CollectionPage from "./components/Pages/Collection/CollectionPage";
import CollectionCatalogPage from "./components/Pages/Collections catalog/CollectionCatalogPage";
import CreateCollection from "./components/CreateCollection/CreateCollection";

export const publicRoutes = [
  { path: "edit-task/:taskId/", Component: CreateTaskPage },
  { path: "create-task/:taskId/", Component: CreateTaskPage },
  { path: "create-task/", Component: CreateTaskPage },
  { path: "bank", Component: BankPage },
  { path: "test", Component: Test },
  { path: "variants", Component: Variants },
  { path: "update-collection/:slug/", Component: CreateCollectionPage },
  { path: "create-collection/", Component: CreateCollection },
  { path: "collections/:slug/", Component: CollectionPage },
  { path: "collections/", Component: CollectionCatalogPage },

  { path: "*", Component: NotFound },
];

export const authRoutes = [];

export const adminRoutes = [];
