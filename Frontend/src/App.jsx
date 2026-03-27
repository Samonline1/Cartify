import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import ProductDetails from "./components/ProductDetails";
import CatergoryResults from "./components/CatergoryResults";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";




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
]);

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <div>
//         <Navbar />
//         <Home />
//       </div>
//     ),
//   },
//   {
//     path: "/:username",
//     element: (
//       <div>
//         <Navbar />
//         <Home />
//       </div>
//     ),
//   },
//   {
//     path: "/search/:name",
//     element: (
//       <div>
//         <Navbar />
//         <SearchResults />
//       </div>
//     ),
//   },
//     {
//     path: "/search/:name/:id",
//     element: (
//       <div>
//         <Navbar />
//         <ProductDetails />
//       </div>
//     ),
//   },
//    {
//     path: "/category/:name",
//     element: (
//       <div>
//         <Navbar />
//         <CatergoryResults />
//       </div>
//     ),
//   },
//   {
//     path: "/login",
//     element: (
//       <div>
//         <SignUp/>
//       </div>
//     ),
//   },
//    {
//     path: "/profile",
//     element: (
//       <div>
//         <Navbar />
//         <Profile/>
//       </div>
//     ),
//   },
//   {
//     path: "/cart",
//     element: (
//       <div>
//         <Navbar />
//         <Cart/>
//       </div>
//     ),
//   },
//   {
//     path: "/checkout",
//     element: (
//       <div>
//         <Navbar />
//         <Checkout/>
//       </div>
//     ),
//   },
// ]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
