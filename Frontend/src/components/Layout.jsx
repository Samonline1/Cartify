import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import NavbarMobile from "./NavbarMobile";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";
import AiButton from "./ai/AiButton";

// app shell
const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">

      <ScrollTop />

      {/* Desktop */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      {/* Mobile */}
      <div className="block lg:hidden">
        <NavbarMobile />
      </div>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      <AiButton />
    </div>
  );
};

export default Layout;
