import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import API from "../api";
import { useAuth } from "../AuthContext";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (payload) => (await API.post("/admin/login", payload)).data,
    onSuccess: ({ msg, user }) => {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(msg);
      navigate("/admin/dashboard");
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || "Something went wrong");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password required");
      return;
    }

    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Admin Access</p>
            <h1 className="mt-2 text-2xl font-bold">Sign in to Admin</h1>
            <p className="mt-2 text-sm text-gray-600">Use your admin account to continue.</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Admin email"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            />
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-600"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
