import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const logout = () => {
    localStorage.removeItem("user");
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed w-full top-0 left-0 bg-white/70 backdrop-blur-lg shadow-md z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 group">
          <img
            src={logo}
            alt="Soho Tavern Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-125 transition-transform duration-300"
          />
          <span className="text-sm sm:text-base lg:text-lg font-serif font-semibold text-burgundy">
            <span className="hidden sm:inline">Soho Tavern — Gateshead</span>
            <span className="sm:hidden">Soho Tavern</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={
                  location.pathname === "/dashboard"
                    ? "bg-burgundy text-white px-3 py-1 rounded-md hover:bg-burgundy/90 transition"
                    : "hover:text-burgundy transition"
                }
              >
                Dashboard
              </Link>
              {user.role !== "viewer" && user.role !== "admin" && (
                <Link
                  to="/checklist"
                  className={
                    location.pathname === "/checklist"
                      ? "bg-burgundy text-white px-3 py-1 rounded-md hover:bg-burgundy/90 transition"
                      : "hover:text-burgundy transition"
                  }
                >
                  Checklist
                </Link>
              )}
              {user.role !== "admin" && (
                <Link
                  to="/reports"
                  className={
                    location.pathname === "/reports"
                      ? "bg-burgundy text-white px-3 py-1 rounded-md hover:bg-burgundy/90 transition"
                      : "hover:text-burgundy transition"
                  }
                >
                  Reports
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  to="/users"
                  className={
                    location.pathname === "/users"
                      ? "bg-burgundy text-white px-3 py-1 rounded-md hover:bg-burgundy/90 transition"
                      : "hover:text-burgundy transition"
                  }
                >
                  Users
                </Link>
              )}
              <button
                onClick={logout}
                className="hover:text-burgundy transition"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        {user && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-burgundy/10 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-burgundy" />
            ) : (
              <Menu className="w-6 h-6 text-burgundy" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {user && isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg border-t border-burgundy/10">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className={
                location.pathname === "/dashboard"
                  ? "block px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition text-sm font-medium"
                  : "block px-4 py-2 hover:bg-burgundy/10 rounded-lg transition text-sm font-medium"
              }
            >
              Dashboard
            </Link>
            {user.role !== "viewer" && user.role !== "admin" && (
              <Link
                to="/checklist"
                onClick={closeMenu}
                className={
                  location.pathname === "/checklist"
                    ? "block px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition text-sm font-medium"
                    : "block px-4 py-2 hover:bg-burgundy/10 rounded-lg transition text-sm font-medium"
                }
              >
                Checklist
              </Link>
            )}
            {user.role !== "admin" && (
              <Link
                to="/reports"
                onClick={closeMenu}
                className={
                  location.pathname === "/reports"
                    ? "block px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition text-sm font-medium"
                    : "block px-4 py-2 hover:bg-burgundy/10 rounded-lg transition text-sm font-medium"
                }
              >
                Reports
              </Link>
            )}
            {user.role === "admin" && (
              <Link
                to="/users"
                onClick={closeMenu}
                className={
                  location.pathname === "/users"
                    ? "block px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition text-sm font-medium"
                    : "block px-4 py-2 hover:bg-burgundy/10 rounded-lg transition text-sm font-medium"
                }
              >
                Users
              </Link>
            )}
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 hover:bg-burgundy/10 rounded-lg transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
