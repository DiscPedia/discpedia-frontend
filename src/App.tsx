import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import BackgroundPage from "./pages/BackgroundPage";
import HomePage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import RecommandPage from "./pages/RecommandPage";
import Login from "./components/common/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/login/oauth2/code/kakao",
    element: <Login />,
  },
  {
    path: "/recommand",
    element: <RecommandPage />,
  },
  {
    element: <BackgroundPage />,
    children: [
      { path: "home", element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "collection", element: <CollectionPage /> },
      { path: "myPage", element: <MyPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
