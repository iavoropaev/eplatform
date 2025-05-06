import NotFound from "./components/Pages/NotFound";
import Variants from "./components/Pages/Variants";
import CreateTaskPage from "./components/Pages/Create task/CreateTaskPage";
import BankPage from "./components/Pages/Bank/BankPage";
import CreateCollectionPage from "./components/Pages/Create collection/CreateCollectionPage";
import CollectionPage from "./components/Pages/Collection/CollectionPage";
import CollectionCatalogPage from "./components/Pages/Collections catalog/CollectionCatalogPage";
import CreateCollection from "./components/CreateCollection/CreateCollection";
import ExamPage from "./components/Pages/Exam/ExamPage";
import ExamResultsPage from "./components/Pages/Exam results/ExamResultsPage";
import CoursePage from "./components/Pages/Course/CoursePage";
import UpdateCourse from "./components/CreateCourse/UpdateCourse";
import GenerateCollectionPage from "./components/Pages/Generate collection/GenerateCollectionPage";
import ProfilePage from "./components/Pages/Profile/ProfilePage";
import TeacherTasks from "./components/Profile/TeacherSection/Materials/TeacherTasks";
import TeacherCollections from "./components/Profile/TeacherSection/Materials/TeacherCollections";
import TeacherCourses from "./components/Profile/TeacherSection/Materials/TeacherCourses";
import ActivateInvitation from "./components/Class/ActivateInvitation";
import ClassForTeacher from "./components/Class/ClassForTeacher";
import CreateCourse from "./components/CreateCourse/CreateCourse";
import { ExamStatisticsPage } from "./components/ExamStatistics/ExamStatisticsPage";
import { NotAuthorized } from "./components/Utils/NotAuthorized";
import CourseCatalog from "./components/CourseCatalog/CourseCatalog";
import { Privacy } from "./components/Pages/Privacy/Privacy";

export const publicRoutes = [
  { path: "privacy", Component: Privacy },
  { path: "bank", Component: BankPage },
  { path: "variants", Component: Variants },

  { path: "collection/:slug/", Component: CollectionPage },
  {
    path: "collections/:examSlug/:subjectSlug/",
    Component: CollectionCatalogPage,
  },

  {
    path: "courses/:examSlug/:subjectSlug/",
    Component: CourseCatalog,
  },

  // Страница с авторизацией
  { path: "variant/:slug/", Component: NotAuthorized },
  { path: "variant/:slug/results/:solveType/", Component: NotAuthorized },
  { path: "variant/:slug/results/", Component: NotAuthorized },
  {
    path: "variant/:examSlug/all-results/:eSection/",
    Component: NotAuthorized,
  },

  { path: "lk/teach/my-tasks", Component: NotAuthorized },
  { path: "lk/teach/my-variants", Component: NotAuthorized },
  { path: "lk/teach/my-courses", Component: NotAuthorized },
  { path: "lk/:section/", Component: NotAuthorized },
  { path: "lk", Component: NotAuthorized },

  { path: "class/activate-invitation/:token/", Component: NotAuthorized },
  { path: "class/:classId/:classSection/", Component: NotAuthorized },

  { path: "edit-task/:taskId/", Component: NotAuthorized },
  { path: "create-task/:taskId/", Component: NotAuthorized },
  { path: "create-task/", Component: NotAuthorized },

  { path: "update-collection/:slug/", Component: NotAuthorized },
  { path: "create-collection/", Component: NotAuthorized },
  {
    path: "generate-collection/:examSlug/:subjectSlug/",
    Component: NotAuthorized,
  },

  { path: "edit-course/:courseId/", Component: NotAuthorized },
  { path: "create-course/", Component: NotAuthorized },
  {
    path: "course/:courseId/",
    Component: NotAuthorized,
  },
  {
    path: "course/:courseId/:lesson/:lessonId/s/:sectionIndex/",
    Component: NotAuthorized,
  },

  { path: "*", Component: NotFound },
];

export const authRoutes = [
  {
    path: "course/:courseId/",
    Component: CoursePage,
  },
  {
    path: "course/:courseId/:lesson/:lessonId/s/:sectionIndex/",
    Component: CoursePage,
  },

  { path: "lk/teach/my-tasks", Component: TeacherTasks },
  { path: "lk/teach/my-variants", Component: TeacherCollections },
  { path: "lk/teach/my-courses", Component: TeacherCourses },
  { path: "lk/:section/:examSlug/:subjectSlug/", Component: ProfilePage },
  { path: "lk/:section/", Component: ProfilePage },
  { path: "lk", Component: ProfilePage },

  { path: "class/activate-invitation/:token/", Component: ActivateInvitation },
  { path: "class/:classId/:classSection/", Component: ClassForTeacher },

  { path: "edit-task/:taskId/", Component: CreateTaskPage },
  { path: "create-task/:taskId/", Component: CreateTaskPage },
  { path: "create-task/", Component: CreateTaskPage },

  { path: "update-collection/:slug/", Component: CreateCollectionPage },
  { path: "create-collection/", Component: CreateCollection },
  {
    path: "generate-collection/:examSlug/:subjectSlug/",
    Component: GenerateCollectionPage,
  },

  { path: "edit-course/:courseId/", Component: UpdateCourse },
  { path: "create-course/", Component: CreateCourse },

  { path: "variant/:slug/attempt/:attemptId", Component: ExamPage },
  { path: "variant/:slug/", Component: ExamPage },
  {
    path: "variant/:slug/results/:solveType/:attemptId/",
    Component: ExamResultsPage,
  },
  { path: "variant/:slug/results/:solveType/", Component: ExamResultsPage },
  { path: "variant/:slug/results/", Component: ExamResultsPage },
  {
    path: "variant/:examSlug/all-results/:eSection/",
    Component: ExamStatisticsPage,
  },
];

export const adminRoutes = [];
