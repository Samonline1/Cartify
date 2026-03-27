import React from "react";

// footer
const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 border-t border-slate-700 mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-wrap gap-8 justify-between">
          <div className="space-y-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-black text-white text-xl tracking-tight"
            >
              <span style={{ fontFamily: "'Brush Script MT', cursive", fontSize: "1.4rem", fontWeight: 700 }}>
                Cartify
              </span>
            </button>
            <p className="text-sm text-slate-300 max-w-xs">
              Curated products, clean experience. Built for shoppers who value simplicity.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1 min-w-[260px]">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase text-slate-300">About</p>
              <ul className="space-y-1 text-sm">
                <li><a href="/">Our story</a></li>
                <li><a href="/">Careers</a></li>
                <li><a href="/">Press</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase text-slate-300">Support</p>
              <ul className="space-y-1 text-sm">
                <li><a href="/">Help center</a></li>
                <li><a href="/">Returns</a></li>
                <li><a href="/">Shipping</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase text-slate-300">Connect</p>
              <ul className="space-y-1 text-sm">
                <li><a href="/">Twitter</a></li>
                <li><a href="/">Instagram</a></li>
                <li><a href="/">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-top border-slate-700 text-sm text-slate-300">
          <span>© {new Date().getFullYear()} Cartify. All rights reserved.</span>
          <div className="flex gap-3 text-slate-300">
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
            <a href="/">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
