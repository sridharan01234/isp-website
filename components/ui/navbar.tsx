"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "./button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Plans", href: "/#plans" },
    { label: "Contact", href: "/contacts" },
    { label: "Get Quote", href: "/quote", isButton: true },
  ];

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled || isMobileMenuOpen ? "bg-white shadow-lg" : "bg-transparent"
  }`;

  return (
    <nav className={`${navbarClasses}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight flex items-center space-x-1 transition-colors duration-300"
            >
              <span
                className={`${
                  isScrolled || isMobileMenuOpen
                    ? "text-gray-800"
                    : "text-white"
                }`}
              >
                Thillai
              </span>
              <span className="text-sky-400">Cable</span>
            </Link>
          </motion.div>

          <div className="ml-4"></div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.isButton ? (
                  <Button variant="primary" size="sm">
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-800 hover:text-blue-600 transition-colors relative group"
                  >
                    {item.label}
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                    />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 text-blue-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-blue-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-blue-600" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-lg rounded-b-lg z-40 relative"
            >
              <div className="py-4 space-y-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block"
                  >
                    {item.isButton ? (
                      <Button variant="primary" size="sm" className="w-full">
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
