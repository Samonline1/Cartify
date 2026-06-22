import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password required");
      return;
    }

    try {
      const res = await API.post("/admin/login", formData);
      const { msg, user } = res.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(msg);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6">
        <p className="text-2xl font-semibold text-center">Admin Login</p>
        <input
          type="email"
          placeholder="Admin email"
          className="w-full rounded border border-white/20 bg-black px-4 py-3 text-white outline-none"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border border-white/20 bg-black px-4 py-3 text-white outline-none"
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button className="w-full rounded bg-white px-4 py-3 font-medium text-black">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
