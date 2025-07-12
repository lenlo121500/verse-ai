import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed z-50 w-full backdrop-blur-2xl">
      <div className="flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32">
        {/* Logo */}
        <ScrollLink
          to="hero"
          smooth={true}
          duration={500}
          offset={-70}
          className="cursor-pointer"
          onClick={closeMenu}
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-primary flex items-center space-x-1">
            <span className="text-black">Verse</span>
            <span>AI</span>
          </h1>
        </ScrollLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <ScrollLink
            to="features"
            smooth={true}
            duration={500}
            offset={-70}
            className="cursor-pointer hover:text-primary transition"
          >
            Features
          </ScrollLink>
          <ScrollLink
            to="testimonials"
            smooth={true}
            duration={500}
            offset={-70}
            className="cursor-pointer hover:text-primary transition"
          >
            Testimonials
          </ScrollLink>
          <ScrollLink
            to="pricing"
            smooth={true}
            duration={500}
            offset={-70}
            className="cursor-pointer hover:text-primary transition"
          >
            Pricing
          </ScrollLink>
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden md:flex">
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

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {user && <UserButton />}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="size-6 text-gray-700" />
            ) : (
              <Menu className="size-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-4">
              <ScrollLink
                to="features"
                smooth={true}
                duration={500}
                offset={-70}
                className="block text-gray-700 hover:text-primary transition cursor-pointer py-2 border-b border-gray-100"
                onClick={closeMenu}
              >
                Features
              </ScrollLink>
              <ScrollLink
                to="testimonials"
                smooth={true}
                duration={500}
                offset={-70}
                className="block text-gray-700 hover:text-primary transition cursor-pointer py-2 border-b border-gray-100"
                onClick={closeMenu}
              >
                Testimonials
              </ScrollLink>
              <ScrollLink
                to="pricing"
                smooth={true}
                duration={500}
                offset={-70}
                className="block text-gray-700 hover:text-primary transition cursor-pointer py-2 border-b border-gray-100"
                onClick={closeMenu}
              >
                Pricing
              </ScrollLink>
            </div>

            {/* Mobile Auth Button */}
            {!user && (
              <button
                className="w-full flex items-center justify-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-6 py-3 mt-6"
                onClick={() => {
                  openSignIn();
                  closeMenu();
                }}
              >
                Get Started <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
