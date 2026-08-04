import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

function SignUp() {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const validate = () => {
    const { name, email, password } = formData;

    if (!email || !password || (!isLogin && !name)) {
      toast.error("All fields required");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const url = isLogin ? "/auth/login" : "/auth/signup";

      const payload = isLogin
        ? {
          email: formData.email,
          password: formData.password,
        }
        : formData;

      const res = await API.post(url, payload);

      const { msg, user } = res.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(msg);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen w-full md:grid-cols-2">


        {/* LEFT — AUTH FORM */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdf5] px-6 py-10 sm:px-10 lg:px-16">

          {/* background shapes */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-100/70" />

          <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-yellow-200/60" />

          <div className="pointer-events-none absolute right-[12%] top-[12%] h-5 w-5 rotate-12 rounded-md bg-yellow-400" />

          <div className="pointer-events-none absolute bottom-[18%] left-[10%] h-4 w-4 rounded-full bg-blue-400" />

          <div className="relative z-10 w-full max-w-md">

            {/* Logo */}
            <div className="mb-10">
              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 rotate-[-3deg] items-center justify-center rounded-xl bg-blue-500 shadow-[4px_4px_0px_#facc15]">
                  <span className="text-lg font-black text-white">
                    C
                  </span>
                </div>

                <span className="text-2xl font-black tracking-tight text-blue-600">
                  Cartify
                </span>

              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                {isLogin ? "Welcome back!" : "Join Cartify"}
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {isLogin ? (
                  <>
                    Ready to
                    <span className="text-blue-500"> shop?</span>
                  </>
                ) : (
                  <>
                    Let's get you
                    <span className="text-blue-500"> started.</span>
                  </>
                )}
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Sign in to continue shopping with Cartify."
                  : "Create your Cartify account and start shopping."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border-2 border-blue-100 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-2 border-blue-100 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-2 border-blue-100 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="group w-full rounded-xl bg-blue-500 px-4 py-3.5 text-sm font-bold text-white shadow-[0_4px_0px_#2563eb] transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-[0_6px_0px_#2563eb] active:translate-y-0 active:shadow-[0_2px_0px_#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                {isLogin ? "Sign in" : "Create account"}

                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </form>

            {/* Toggle */}
            <p className="mt-7 text-center text-sm text-slate-500">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => setIsLogin((prev) => !prev)}
                className="ml-1 font-bold text-blue-500 underline decoration-yellow-400 decoration-2 underline-offset-4 transition hover:text-blue-600"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>

            {/* Small shopping accent */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span>Simple shopping. Better experience.</span>
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            </div>

          </div>
        </section>


        {/* RIGHT — CARTIFY BRAND PANEL */}

        <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 md:flex">


          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border-[80px] border-white/10" />

          <div className="absolute -left-40 bottom-[-180px] h-[550px] w-[550px] rounded-full border-[90px] border-white/10" />

          {/* Yellow shapes */}
          <div className="absolute right-20 top-24 h-32 w-20 rotate-12 rounded-full bg-yellow-300/80" />

          <div className="absolute bottom-28 right-32 h-40 w-24 -rotate-[25deg] rounded-full bg-yellow-300/70" />

          <div className="absolute bottom-20 left-20 h-16 w-16 rounded-full bg-yellow-300/80" />

          {/* Main content */}
          <div className="relative z-10 flex min-h-screen w-full flex-col justify-center p-10 lg:p-16">

            {/* Hero */}
            <div className="max-w-lg">

              <div className="mb-6 inline-flex rounded-full bg-yellow-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                Shop smarter
              </div>

              <h2 className="text-5xl font-bold leading-[1.05] tracking-tight text-white lg:text-6xl">
                Everything you need,
                <span className="block text-yellow-300">
                  all in one place.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-blue-50">
                Discover products you love, manage your cart,
                and enjoy a simple shopping experience with Cartify.
              </p>

            </div>

            {/* Bottom */}
            <div className="flex items-center gap-3 text-sm text-blue-50">
              <div className="h-2 w-2 rounded-full bg-yellow-300" />
              Your shopping journey starts here.
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

export default SignUp;