import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import BackgroundPage from "./pages/BackgroundPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/login",
    element: <LoginPage />,
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
