import React from "react";

// footer
const Footer = () => {
  return (
    <footer className="mt-12 w-full border-t border-blue-100 bg-blue-50 text-slate-700">

  <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* MAIN FOOTER */}
    

    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

      {/* Brand */}

      <div>

        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="text-blue-600 transition hover:scale-[1.02]"
          style={{
            fontFamily: "'Brush Script MT', cursive",
            fontSize: "1.8rem",
            fontWeight: 700,
          }}
        >
          Cartify
        </button>

        <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
          Simple shopping, great products, and a better way to
          discover what you need.
        </p>


        {/* brand badge */}

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm">

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] text-blue-900">
            C
          </span>

          Made for happy shoppers

        </div>

      </div>


      {/* About */}

      <div>

        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
          About
        </h3>

        <ul className="mt-4 space-y-3 text-sm">

          <li>
            <a
              href="/"
              className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
            >
              Our story
            </a>
          </li>

          <li>
            <a
              href="/"
              className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
            >
              Careers
            </a>
          </li>

          <li>
            <a
              href="/"
              className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
            >
              Press
            </a>
          </li>

        </ul>

      </div>


      {/* Support */}

      <div>

        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
          Support
        </h3>

        <ul className="mt-4 space-y-3 text-sm">

          <li>
            <a
              href="/"
              className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
            >
              Help center
            </a>
          </li>

          <li>
            <a
              href="/"
              className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
            >
              Returns
            </a>
          </li>

          <li>
            <a
              href="/"
              className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
            >
              Shipping
            </a>
          </li>

        </ul>

      </div>


      {/* Connect */}

      <div>

        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
          Connect
        </h3>

        <ul className="mt-4 space-y-3 text-sm">

          <li>
            <a
              href="/"
              className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
            >
              Twitter
            </a>
          </li>

          <li>
            <a
              href="/"
              className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
            >
              Instagram
            </a>
          </li>

          <li>
            <a
              href="/"
              className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
            >
              LinkedIn
            </a>
          </li>

        </ul>

      </div>

    </div>


        {/* BOTTOM BAR */}

    <div className="mt-10 flex flex-col gap-4 border-t border-blue-100 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

      <p>
        © {new Date().getFullYear()} Cartify. All rights reserved.
      </p>


      <div className="flex flex-wrap gap-x-5 gap-y-2">

        <a
          href="/"
          className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
        >
          Privacy
        </a>

        <a
          href="/"
          className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
        >
          Terms
        </a>

        <a
          href="/"
          className="transition hover:text-blue-500 text-slate-400 text-slate-400 text-slate-400 text-slate-400 text-slate-400"
        >
          Cookies
        </a>

      </div>

    </div>

  </div>

</footer>
  );
};

export default Footer;
