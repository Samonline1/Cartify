import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser || storedUser.role !== "admin") {
      navigate("/admin");
    }
  }, [navigate, user]);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <p>Admin Dashboard</p>
    </div>
  );
}

export default AdminDashboard;
