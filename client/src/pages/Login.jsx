import { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [authMode, setAuthMode] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (authMode === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          navigate("/");
          toast.success("Account created successfully!");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          navigate("/");
          toast.success("Login successful!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 cursor-pointer sm:w-16"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {authMode === "Sign Up" ? "Create an Account" : "Login"}
        </h2>

        <p className="text-center text-sm mb-6">
          {authMode === "Sign Up"
            ? "Sign up with your email"
            : "Login with your email"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {authMode === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <MdOutlineAccountCircle className="w-5 h-5" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none"
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <MdOutlineEmail className="w-5 h-5" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
              placeholder="Email"
              required
              className="bg-transparent outline-none"
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <RiLockPasswordLine className="w-5 h-5" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none"
            />
          </div>
          <p
            onClick={() => navigate("/forgot-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            {authMode}
          </button>
        </form>

        {authMode === "Sign Up" ? (
          <p className="text-gray-400 text-center text-sm mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => setAuthMode("Login")}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => setAuthMode("Sign Up")}
            >
              Sign up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
