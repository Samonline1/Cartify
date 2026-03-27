import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  console.log(user?.content.length);

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
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full space-y-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-slate-600">No user found. Please login.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between">
          <div>
            <p className="text-xs text-slate-500">Profile</p>
            <h1 className="text-3xl font-bold">
              {user?.name || user?.username}
            </h1>
            <p className="text-slate-600">{user?.email || "No email"}</p>

          </div>
          <span className="px-4 py-3 bg-blue-100 text-blue-700 rounded-full text-xs">
            Cartify
          </span>
        </div>

        {/* Info */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Cart */}
          <div className="bg-white p-5 rounded-2xl shadow space-y-2">
            <p className="font-semibold">Cart summary</p>
            <p>Items in cart: {user?.content.length}</p>
            <button
              onClick={() => navigate("/cart")}
              className="px-4 py-2 bg-black text-white rounded-full"
            >
              View cart
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-center">
          <p className="text-sm text-slate-600">Switch account?</p>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 text-white rounded-full"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;