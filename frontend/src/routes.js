import NotFound from "./components/Pages/NotFound";
import Test from "./components/Pages/Test/Test";
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
import CreateCourse from "./components/Course/CreateCourse/CreateCourse";

export const publicRoutes = [
  { path: "bank", Component: BankPage },
  { path: "variants", Component: Variants },

  { path: "collections/:slug/", Component: CollectionPage },
  { path: "collections/", Component: CollectionCatalogPage },

  { path: "variant/:slug/", Component: ExamPage },
  { path: "variant/:slug/results/:solveType/", Component: ExamResultsPage },
  { path: "variant/:slug/results/", Component: ExamResultsPage },

  {
    path: "course/:courseId/",
    Component: CoursePage,
  },
  {
    path: "course/:courseId/:lesson/:lessonId/s/:sectionIndex/",
    Component: CoursePage,
  },

  { path: "test", Component: Test },
  { path: "*", Component: NotFound },
];

export const authRoutes = [
  { path: "lk/teach/my-tasks", Component: TeacherTasks },
  { path: "lk/teach/my-variants", Component: TeacherCollections },
  { path: "lk/teach/my-courses", Component: TeacherCourses },
  { path: "lk/:section/", Component: ProfilePage },
  { path: "lk", Component: ProfilePage },

  { path: "class/activate-invitation/:token/", Component: ActivateInvitation },
  { path: "class/:classId/", Component: ClassForTeacher },

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
];

export const adminRoutes = [];
