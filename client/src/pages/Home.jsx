import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/images/bg.jpg')] bg-cover bg-center">
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
