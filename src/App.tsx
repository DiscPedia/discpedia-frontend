import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import BackgroundPage from "./pages/BackgroundPage";
import HomePage from "./pages/HomePage";
import NewReleasesPage from "./pages/NewReleasesPage";
import SearchPage from "./pages/SearchPage";
import UsedAlbumsPage from "./pages/UsedAlbumsPage";
import CollectionPage from "./pages/CollectionPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import DetailPage from "./pages/DetailPage";
import AddCollectionsPage from "./pages/AddCollectionsPage";
import RecommandPage from "./pages/RecommandPage";
import Login from "./components/common/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";
import MyReviewPage from "./pages/MyReviewPage";
import PortfolioPage from "./pages/PortfolioPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import EditReviewPage from "./pages/EditReviewPage";
import WriteReviewPage from "./pages/WriteReviewPage";

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
    path: "/login/oauth2/code/google",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/recommand",
        element: <RecommandPage />,
      },
      {
        path: "/myReview",
        element: <MyReviewPage />,
      },
      {
        path: "/portfolio",
        element: <PortfolioPage />,
      },
      {
        path: "/review/write/:id",
        element: <WriteReviewPage />,
      },
      {
        path: "/review/edit/:reviewId",
        element: <EditReviewPage />,
      },
      { path: "/collection/add/:id", element: <AddCollectionsPage /> },
      { path: "/detail/:id", element: <DetailPage /> },
      {
        path: "/collection/:collectionItemId",
        element: <CollectionDetailPage />,
      },
      {
        element: <BackgroundPage />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "new-releases", element: <NewReleasesPage /> },
          { path: "used-albums", element: <UsedAlbumsPage /> },
          { path: "search", element: <SearchPage /> },
          { path: "collection", element: <CollectionPage /> },
          { path: "myPage", element: <MyPage /> },
          
          
          
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
