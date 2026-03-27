import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

function SignUp() {
  // mode toggle
  const [isLogin, setIsLogin] = useState(true);
  // form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // navigation
  const navigate = useNavigate();
  const { setUser } = useAuth(); // auth setter

  // validation
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

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const url = isLogin ? "/auth/login" : "/auth/signup";

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await API.post(url, payload);

      const { msg, user } = res.data;

      // store globally
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(msg);

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  // render auth
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow rounded-xl space-y-4 w-[350px]"
      >
        <h2 className="text-xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* name input */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        )}

        {/* email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        {/* password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          {isLogin ? "Login" : "Create Account"}
        </button>

        {/* toggle link */}
        <p className="text-sm text-center">
          {isLogin ? "No account?" : "Already have account?"}
          <span
            onClick={() => setIsLogin((prev) => !prev)}
            className="text-blue-600 cursor-pointer ml-1"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
