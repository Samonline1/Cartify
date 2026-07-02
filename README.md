# Cartify

A full-stack e-commerce shopping platform with cookie-based JWT authentication, a live product catalog, persistent per-user carts, and an admin dashboard.

## Overview

Cartify is a two-part web application: a React single-page frontend and a Node.js/Express REST API backend. Users can sign up, browse and search a real product catalog (sourced from the public [DummyJSON](https://dummyjson.com/) API), add items to a persistent cart, check out, and review their purchase history and spend total from a profile page. A separate admin role can log in to a dedicated dashboard to view store-wide statistics, manage registered users, and browse the product catalog.

Rather than storing its own product inventory, Cartify treats DummyJSON as an external product data source and only persists what is specific to each user — their account, cart contents, and purchase history — in MongoDB. This keeps the project focused on the full-stack concerns it was built to demonstrate: authentication, session handling, API design, and stateful cart/checkout logic.

## Problem It Solves

Most beginner or portfolio e-commerce projects render a static product grid with client-side-only cart state that resets on refresh. Cartify addresses that gap by implementing the parts of a real storefront that are usually skipped:

- Cart and order data that belongs to an authenticated user and survives across sessions and devices.
- A secure, cookie-based authentication flow instead of storing tokens in `localStorage`.
- A checkout process that converts cart items into a permanent purchase record.
- An administrative view for operational visibility (users, orders, revenue, catalog) without giving admins arbitrary database access.

## Features

**Customer-facing**
- Email/password signup, login, and logout using JWT stored in an `httpOnly` cookie
- Product browsing by category, with a curated category navigation bar
- Product search by keyword
- Product detail view
- Add to cart / remove from cart, with quantity accumulation for repeat adds
- Live cart total calculation
- Checkout flow that converts cart items into purchase records and clears the cart
- Purchase history and total amount spent, shown on a profile page
- Toast notifications for user feedback (`react-hot-toast`, `react-toastify`)
- Responsive layout with distinct desktop and mobile navigation bars
- Client-side routing, including dynamic `/search/:name`, `/category/:name`, and `/search/:name/:id` routes

**Admin-facing**
- Separate admin login (`/admin`), gated to accounts with an `admin` role
- Route-level guard (`AdminGuard`) that redirects non-admin users away from the dashboard
- Dashboard overview with aggregate stats: total users, total admins, total products, total categories, total cart items across all users, total orders, and total revenue
- User management: searchable user list, individual user detail view, and user deletion (admin accounts are protected from deletion)
- Product catalog browser with search, category filter, and sorting by title, price, rating, or stock
- Admin seeding script to bootstrap the first admin account from environment variables

## Tech Stack

**Frontend**
- React 19
- Vite 7 (build tool / dev server)
- React Router DOM 7 (client-side routing)
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Axios (HTTP client)
- React Hot Toast / React Toastify (notifications)
- React Icons
- React Slick + Slick Carousel (carousels)
- React Flags Select
- ESLint (linting)

**Backend**
- Node.js
- Express 5
- Axios (server-to-server calls to the DummyJSON API)
- dotenv (environment configuration)
- cookie-parser
- cors

**Database**
- MongoDB
- Mongoose (ODM)

**Authentication**
- JSON Web Tokens (`jsonwebtoken`)
- bcrypt (password hashing)
- Auth state delivered via an `httpOnly` cookie (not `localStorage`), with `secure`/`sameSite` behavior toggled by `NODE_ENV`
- Role-based authorization (`user` / `admin`) enforced by Express middleware

**State Management**
- TanStack React Query (server state — used throughout the admin dashboard for queries and mutations)
- React Context API (`AuthContext.jsx` — client-side auth/session state)
- Component-level `useState` for local UI state

**Cloud / Storage / External Services**
- DummyJSON public API — external source of truth for all product data (search, category, single-product lookups)
- Netlify — configured frontend hosting/build target (`netlify.toml`)
- No file/object storage (e.g. S3) is used in this project

**Other Tools**
- Git / GitHub for version control

## Architecture

Cartify follows a conventional two-tier client/server architecture with a third-party data dependency:

```text
React SPA (Frontend)
      │  Axios (withCredentials: true)
      ▼
Express REST API (Backend)
      │
      ├─► MongoDB — persists users, cart items, purchase history
      │
      └─► DummyJSON API — supplies product catalog, search, and category data
```

- The frontend never talks to MongoDB or DummyJSON directly; every request goes through the Express backend.
- The backend stores only a `product id` and `quantity` per cart/purchase line item. Whenever cart, checkout, or product data needs to be displayed, the backend fetches the corresponding product details from DummyJSON in real time and merges them with the stored quantity/price data.
- Authentication is stateless (JWT-based) but delivered via a secure cookie rather than a bearer token, with `isLoggedIn` and `isAdmin` Express middleware guarding protected routes.
- On the frontend, `React Router` defines a shared `Layout` (navbar + footer) for customer-facing routes, while `/admin` and `/admin/dashboard` sit outside that layout and are protected by a client-side `AdminGuard` component.

## Folder Structure

```text
Cartify/
├── Backend/
│   ├── app.js                  # Express app entrypoint: middleware, CORS, route mounting, server start
│   ├── seedAdmin.js             # One-off script to create the first admin user from env vars
│   ├── models/
│   │   ├── db.js                # Mongoose/MongoDB connection logic
│   │   └── user.js              # User schema: name, email, password, role, cart[], purchased[]
│   ├── middleswares/
│   │   └── middlesware.js       # isLoggedIn (JWT verification) and isAdmin (role check) guards
│   └── router/
│       ├── authRouter.js        # /api/auth — signup, login, logout
│       ├── adminRouter.js       # /api/admin — admin auth, dashboard stats, user & product management
│       └── productsRouter.js    # /api/products — search, category, product detail, cart, checkout
│
├── Frontend/
│   ├── index.html
│   ├── vite.config.js            # Vite config: React + Tailwind plugins, dev server on port 5173
│   ├── eslint.config.js
│   └── src/
│       ├── main.jsx              # App bootstrap: React Query, AuthProvider, Toaster
│       ├── App.jsx               # Route definitions (React Router)
│       ├── api.js                # Axios instance (baseURL from VITE_API_URL, withCredentials)
│       ├── AuthContext.jsx       # React Context for current user/session
│       └── components/
│           ├── Layout.jsx        # Shared shell: Navbar/NavbarMobile + Footer + <Outlet />
│           ├── Navbar.jsx / NavbarMobile.jsx
│           ├── Home.jsx          # Landing/product listing page
│           ├── SearchResults.jsx # Search results view
│           ├── CatergoryResults.jsx # Category-filtered product view
│           ├── ProductDetails.jsx
│           ├── Cart.jsx
│           ├── Checkout.jsx
│           ├── Profile.jsx       # Purchase history and spend total
│           ├── SignUp.jsx        # Signup / login form
│           ├── AdminLogin.jsx
│           ├── AdminDashboard.jsx
│           └── Footer.jsx
│
├── docs/
│   └── screenshots/              # home.png, login.png, products.png, cart.png
├── netlify.toml                  # Netlify build config (base: Frontend, publish: dist)
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A MongoDB instance (local install or a hosted cluster such as MongoDB Atlas)

### Installation

Clone the repository, then install dependencies for each part of the app separately (there is no root-level workspace setup):

```bash
git clone https://github.com/Samonline1/Cartify.git
cd Cartify

# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

### Environment Variables

The repository does not include a committed `.env` file (it is git-ignored). Based on the code, the following variables are required or supported:

**`Backend/.env`**

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string used by `models/db.js` |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs |
| `PORT` | Yes | Port the Express server listens on (`app.js` throws if unset) |
| `NODE_ENV` | No | When set to `production`, cookies are issued with `secure: true` and `sameSite: "none"` |
| `CLIENT_URL` | No | Additional allowed CORS origin, appended to the hardcoded allow-list in `app.js` |
| `ADMIN_EMAIL` | Yes (for seeding) | Email used by `seedAdmin.js` to create the initial admin account |
| `ADMIN_PASSWORD` | Yes (for seeding) | Password used by `seedAdmin.js` to create the initial admin account |
| `ADMIN_NAME` | No | Display name for the seeded admin; defaults to `"Admin"` |
| `PRODUCTS_API_BASE` | No | Overrides the DummyJSON base URL used in `adminRouter.js`; defaults to `https://dummyjson.com/products` |

**`Frontend/.env`**

| Variable | Required | Purpose |
|---|---|---|
| `VITE_API_URL` | No | Base URL for the backend API used by the Axios instance in `src/api.js`; defaults to `http://localhost:5000/api` if unset |

> Note: the default fallback in `api.js` points to port `5000`, while the example backend setup elsewhere in the repo uses port `3000`. Set `PORT` and `VITE_API_URL` consistently to match whichever port you run the backend on.

### Run Locally

Start the backend (from `Backend/`):

```bash
node app.js
```

Optionally, seed the first admin account (from `Backend/`, requires `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`):

```bash
node seedAdmin.js
```

Start the frontend in a separate terminal (from `Frontend/`):

```bash
npm run dev
```

By default the frontend dev server runs at `http://localhost:5173` and expects the backend at the URL configured by `VITE_API_URL`.

## Scripts

**Backend** (`Backend/package.json`)

| Script | Command | Description |
|---|---|---|
| `test` | `echo "Error: no test specified" && exit 1` | Placeholder only — no test suite is currently configured. |

The backend has no `start` or `dev` script; it is run directly with `node app.js` (or `seedAdmin.js` for the seeding utility).

**Frontend** (`Frontend/package.json`)

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Starts the Vite development server with hot module reloading. |
| `build` | `vite build` | Builds an optimized production bundle into `dist/`. |
| `lint` | `eslint .` | Runs ESLint against the project source. |
| `preview` | `vite preview` | Serves the production build locally for verification. |

## Screenshots

Screenshot files exist in the repository at `docs/screenshots/` (`home.png`, `login.png`, `products.png`, `cart.png`). Placeholders below for reference:

### Home
![Home](./docs/screenshots/home.png)

### Login / Sign Up
![Login](./docs/screenshots/login.png)

### Product Listing
![Products](./docs/screenshots/products.png)

### Cart
![Cart](./docs/screenshots/cart.png)

## Future Improvements

- Integrate real payment processing (e.g., Stripe) rather than a simulated checkout
- Store product title/thumbnail/price directly on purchase records to avoid re-fetching from DummyJSON and to preserve historical pricing
- Add order status tracking (pending, shipped, delivered)
- Add wishlist / saved-items support
- Extend admin capabilities to full CRUD product management (currently read-only against DummyJSON)
- Add automated tests (none currently exist in either package)
- Consolidate environment variable defaults (frontend/backend port mismatch noted above)
- Add pagination for large product/category result sets

## Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a pull request, and keep frontend and backend changes in their respective directories.