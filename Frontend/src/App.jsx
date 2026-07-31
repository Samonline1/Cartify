import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import ProductDetails from "./components/ProductDetails";
import CatergoryResults from "./components/CatergoryResults";
import SignUp from "./components/SignUp";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
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
