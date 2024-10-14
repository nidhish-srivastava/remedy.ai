import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Doctors from "./pages/Doctors";
import MyProfile from "./pages/MyProfile";
import ChatDetail from "./pages/ChatDetail";
import DietPlan from "./pages/DietPlan";
import ExerciseRoutines from "./pages/ExerciseRoutines";
import MedicalReport from "./pages/MedicalReport";

const routes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/doctors",
    element: <Doctors />,
  },
  {
    path: "/profile",
    element: <MyProfile />,
  },
  {
    path: "/chat/:chatId",
    element: <ChatDetail />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/diet-plan",
    element: <DietPlan />,
  },
  {
    path: "/exercise-routine",
    element: <ExerciseRoutines />,
  },
  {
    path: "/medical-report",
    element: <MedicalReport />,
  },
];

function App() {
  const router = createBrowserRouter(routes);

  return (
    <div>
      <ToastContainer theme="dark" position="top-center" autoClose={1500} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
