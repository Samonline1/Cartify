import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";
import { useProfileTotal } from "../hooks/queries/useProfileTotal";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const { data: expensesTotal = 0 } = useProfileTotal(!!user);

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout");

      setUser(null);
      localStorage.removeItem("user");

      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fbff] px-4 py-10 flex items-center justify-center">

        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white border border-blue-100 shadow-xl">

          {/* Top */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 px-8 py-10 text-center">

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-yellow-300/20" />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-black text-blue-500 shadow-lg">
              ?
            </div>

            <h1 className="relative mt-5 text-2xl font-black text-white">
              You're not signed in
            </h1>

            <p className="relative mt-2 text-sm text-blue-50">
              Sign in to access your Cartify profile.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 p-6">

            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-xl bg-blue-500 py-3.5 font-bold text-white shadow-[0_4px_0px_#2563eb] transition hover:-translate-y-0.5 hover:bg-blue-600 active:translate-y-0"
            >
              Go to Login →
            </button>

            {/* <button
              onClick={handleLogout}
              className="w-full rounded-xl border-2 border-slate-100 py-3.5 font-semibold text-slate-600 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
            >
              Logout
            </button> */}

          </div>
        </div>
      </div>
    );
  }

  const name = user?.name || user?.username || "User";
  const email = user?.email || "No email on file";

  // First character for avatar
  const avatarLetter = name.charAt(0).toUpperCase();

  // Cart count
  const cartCount = user?.cart?.length || 0;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff] px-4 py-8 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-6xl">

            {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-500">
            My Account
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Profile
          </h1>
        </div>


            {/* PROFILE HERO */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-xl">

          {/* Decorative shapes */}

          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[55px] border-white/10" />

          <div className="absolute -bottom-36 left-[-80px] h-96 w-96 rounded-full border-[60px] border-white/10" />

          <div className="absolute right-[25%] top-12 h-5 w-5 rotate-12 rounded-md bg-yellow-300" />

          <div className="absolute bottom-16 right-[15%] h-4 w-4 rounded-full bg-yellow-300" />


          <div className="relative z-10 flex flex-col gap-7 p-6 sm:p-8 md:flex-row md:items-center md:justify-between lg:p-10">

            {/* Identity */}

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl font-black text-blue-500 shadow-lg sm:h-24 sm:w-24 sm:text-4xl">
                {avatarLetter}
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-3 py-1 text-xs font-bold text-blue-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Cartify Member
                </div>

                <h2 className="text-2xl font-black text-white sm:text-3xl">
                  {name}
                </h2>

                <p className="mt-1 text-sm text-blue-50">
                  {email}
                </p>
              </div>

            </div>


            {/* Cart CTA */}

            <button
              onClick={() => navigate("/cart")}
              className="flex items-center justify-center gap-3 rounded-xl bg-yellow-300 px-6 py-3.5 font-bold text-blue-800 shadow-[0_4px_0px_#ca8a04] transition hover:-translate-y-0.5 hover:bg-yellow-400 active:translate-y-0 active:shadow-[0_2px_0px_#ca8a04]"
            >
              <span className="text-lg">🛒</span>
              View Cart
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            </button>

          </div>
        </div>


            {/* STATS */}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          {/* Cart */}

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Cart Items
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {cartCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🛒
              </div>

            </div>

            <button
              onClick={() => navigate("/cart")}
              className="mt-4 text-sm font-bold text-blue-500 hover:text-blue-600"
            >
              View cart →
            </button>

          </div>


          {/* Spending */}

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-yellow-700">
                  Total Spent
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  ₹{(expensesTotal * 80).toFixed(0)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-200 text-xl">
                💰
              </div>

            </div>

            <p className="mt-4 text-xs font-medium text-yellow-700">
              Your shopping total
            </p>

          </div>


          {/* Account */}

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Account
                </p>

                <p className="mt-2 text-xl font-black text-slate-900">
                  Active
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                ✓
              </div>

            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
              Your Cartify account is active
            </p>

          </div>

        </div>


            {/* ACCOUNT DETAILS */}
       
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">

          {/* Details */}

          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-7">

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-500">
                Account information
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-900">
                Your details
              </h3>
            </div>

            <div className="divide-y divide-slate-100">

              {/* Name */}

              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Full name
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {name}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-500">
                  NAME
                </div>
              </div>


              {/* Email */}

              <div className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    Email address
                  </p>

                  <p className="mt-1 truncate font-semibold text-slate-800">
                    {email}
                  </p>
                </div>

                <div className="shrink-0 rounded-lg bg-yellow-100 px-3 py-2 text-xs font-bold text-yellow-700">
                  EMAIL
                </div>
              </div>


              {/* Cart */}

              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Shopping cart
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/cart")}
                  className="shrink-0 font-bold text-blue-500 hover:text-blue-600"
                >
                  Open →
                </button>
              </div>

            </div>
          </div>


          {/* Logout card */}

          <div className="flex flex-col justify-between rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
                ↪
              </div>

              <h3 className="mt-5 text-lg font-black text-slate-900">
                Leaving already?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign out of your Cartify account on this device.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 w-full rounded-xl border-2 border-red-100 py-3 font-bold text-red-500 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
