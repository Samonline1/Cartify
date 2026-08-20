import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import ProductDetails from "./pages/ProductDetails";
import CatergoryResults from "./pages/CatergoryResults";
import SignUp from "./pages/SignUp";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./components/NotFound"
import Layout from "./components/Layout";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function AdminGuard({ children }) {
  const { user } = useAuth();
  const storedUser = user || JSON.parse(localStorage.getItem("user") || "null");

  if (!storedUser || storedUser.role !== "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/:username", element: <Home /> },
      { path: "/search/:name", element: <SearchResults /> },
      { path: "/search/:name/:id", element: <ProductDetails /> },
      { path: "/category/:name", element: <CatergoryResults /> },
      { path: "/profile", element: <Profile /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "*", element: <NotFound /> },

    ],
  },

  {
    path: "/login",
    element: <SignUp />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminGuard>
        <AdminDashboard />
      </AdminGuard>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
