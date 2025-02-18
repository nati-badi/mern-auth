import { useContext } from "react";
import three from "../../src/assets/three.png";
import webDesign from "../../src/assets/web-design.png";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img
        src={webDesign}
        alt="three"
        className="w-36 h-36 rounded-full mb-6"
      />

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey, I&apos;m {userData ? userData.name : "Badi"}.
        <img src={three} alt="Web Design" className="w-8 aspect-square" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our website!
      </h2>
      <p className="mb-8 max-w-md">
        Let&apos;s start with a quick product tour and we will have you up and
        running in no time!
      </p>

      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;
