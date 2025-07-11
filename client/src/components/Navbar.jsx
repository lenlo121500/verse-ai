import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32">
      <Link to={"/"}>
        <h1 className="text-2xl font-extrabold tracking-tight text-primary flex items-center space-x-1">
          <span className="text-black">Verse</span>
          <span>AI</span>
        </h1>
      </Link>

      {user ? (
        <UserButton />
      ) : (
        <button
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
          onClick={openSignIn}
        >
          Get Started <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
