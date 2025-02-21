import { useContext } from "react";
import { FaArrowRight } from "react-icons/fa";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setIsLoggedIn, setUserData, backendUrl } =
    useContext(AppContext);

  const logout = async () => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={logo} alt="Logo" className="w-8 sm:w-16" />
      {userData ? (
        <div className=" w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData?.name?.[0]?.toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData?.isAccountVerified && (
                <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
                </li>
              )}

              <li
                onClick={() => logout()}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
          <FaArrowRight />
        </button>
      )}
    </div>
  );
};

export default Navbar;
