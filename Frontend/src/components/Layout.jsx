import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import NavbarMobile from "./NavbarMobile";
import Footer from "./Footer"; 

// app shell
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden lg:block">
        <Navbar />
      </div>
      <div className="lg:hidden block">
        <NavbarMobile />
      </div>
      
      <main className="flex-grow">
        <Outlet />
      </main>

     
      <Footer />
    </div>
  );
};

export default Layout;
