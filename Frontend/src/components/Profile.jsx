import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // console.log(user?.cart?.length || []);

  // logout
  const handleLogout = async () => {
    try {
      await API.get("/auth/logout");

      // clear global + local storage
      setUser(null);
      localStorage.removeItem("user");

      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-100">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full space-y-4 border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-600">No user found. Please login.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl bg-slate-900 text-black hover:bg-slate-800 font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 text-black">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-white/15 rounded-3xl p-8 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-black/60">Profile</p>
              <h1 className="text-3xl font-bold leading-tight">
                {user?.name || user?.username || "User"}
              </h1>
              <p className="text-black/80">{user?.email || "No email on file"}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => navigate("/cart")}
              className="w-full rounded-2xl bg-slate-900 text-white font-semibold py-4 shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              View Cart
            </button>
            <button
              onClick={handleLogout}
              className="w-full rounded-2xl border border-black/40 text-black font-semibold py-4 hover:bg-red-600 hover:text-white transition"
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
