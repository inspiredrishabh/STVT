import {
  LogOut,
  UserCircle,
  Plus,
  Users,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/rail2.jpg";
import nationalEmblem from "../assets/nationalEmblem.jpg";

const Navbar = () => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showManagementDropdown, setShowManagementDropdown] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const addDropdownRef = useRef(null);
  const managementDropdownRef = useRef(null);
  const fontSizeDropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Memoize search items
  const searchItems = useMemo(
    () => [
      {
        name: "STC Management",
        path: "/stc-management",
        category: "Management",
      },
      { name: "STC Candidate", path: "/stc-form", category: "Add" },
      { name: "STC Form", path: "/stc-form", category: "Forms" },
      { name: "WTC Management", path: "/wtc", category: "Management" },
      { name: "WTC Candidate", path: "/wtc-form", category: "Add" },
      { name: "WTC Form", path: "/wtc-form", category: "Forms" },
      {
        name: "Non-Railway Candidate",
        path: "/non-railway-form",
        category: "Add",
      },
      {
        name: "Non Railway Form",
        path: "/non-railway-form",
        category: "Forms",
      },
      {
        name: "Manage Candidate",
        path: "/manage-candidate",
        category: "Management",
      },
      {
        name: "Candidate Management",
        path: "/manage-candidate",
        category: "Management",
      },
      { name: "Dashboard", path: "/dashboard", category: "Navigation" },
      { name: "Home", path: "/", category: "Navigation" },
      {
        name: "Trainee Management",
        path: "/manage-candidate",
        category: "Management",
      },
      {
        name: "Railway Training",
        path: "/stc-management",
        category: "Training",
      },
      { name: "Workshop Training", path: "/wtc", category: "Training" },
      {
        name: "Training Center",
        path: "/stc-management",
        category: "Training",
      },
    ],
    []
  );

  // Font size handler
  const handleFontSizeChange = useCallback((size) => {
    const root = document.documentElement;
    root.style.fontSize =
      size === "small" ? "14px" : size === "large" ? "18px" : "16px";
    setShowFontSizeDropdown(false);
  }, []);

  // Debounced search input handler
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = searchItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 6));
        setShowSearchDropdown(true);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 150); // 150ms debounce

    return () => clearTimeout(handler);
  }, [searchQuery, searchItems]);

  // Search input change
  const handleSearchInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Search form submit
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        const exactMatch = searchItems.find(
          (item) => item.name.toLowerCase() === searchQuery.toLowerCase()
        );
        if (exactMatch && exactMatch.path !== "#") {
          navigate(exactMatch.path);
        } else if (searchResults.length > 0) {
          const firstResult = searchResults[0];
          if (firstResult.path !== "#") {
            navigate(firstResult.path);
          }
        }
        setShowSearchDropdown(false);
        setSearchQuery("");
      }
    },
    [searchQuery, searchItems, searchResults, navigate]
  );

  // Search result click
  const handleSearchResultClick = useCallback(
    (item) => {
      setSearchQuery("");
      setShowSearchDropdown(false);
      if (item.path !== "#") {
        navigate(item.path);
      }
    },
    [navigate]
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addDropdownRef.current &&
        !addDropdownRef.current.contains(event.target)
      )
        setShowAddDropdown(false);
      if (
        managementDropdownRef.current &&
        !managementDropdownRef.current.contains(event.target)
      )
        setShowManagementDropdown(false);
      if (
        fontSizeDropdownRef.current &&
        !fontSizeDropdownRef.current.contains(event.target)
      )
        setShowFontSizeDropdown(false);
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      )
        setShowSearchDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Close mobile menu on resize to larger screen
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Top Header Bar - Government Style */}
      <div className="bg-orange-50 border-b border-orange-300">
        <div className="max-w-9xl mx-auto px-4 py-1">
          <div className="flex flex-wrap justify-between items-center text-xs h-auto md:h-8">
            <div className="flex items-center w-full md:w-auto mb-1 md:mb-0">
              <span
                className="text-orange-700 font-medium text-[10px] sm:text-xs truncate"
                aria-label="Current Date"
              >
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative" ref={fontSizeDropdownRef}>
                <button
                  onClick={() => setShowFontSizeDropdown((v) => !v)}
                  className="text-orange-700 hover:text-orange-900 transition-colors text-[10px] sm:text-xs flex items-center space-x-1"
                  aria-haspopup="true"
                  aria-expanded={showFontSizeDropdown}
                  aria-controls="font-size-dropdown"
                >
                  <span>Font Size</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showFontSizeDropdown && (
                  <div
                    id="font-size-dropdown"
                    className="absolute top-full right-0 mt-1 w-24 bg-white rounded shadow-lg border border-orange-200 py-1 z-50"
                  >
                    <button
                      onClick={() => handleFontSizeChange("small")}
                      className="block w-full text-left px-3 py-1 text-xs text-orange-700 hover:bg-orange-50"
                    >
                      Small
                    </button>
                    <button
                      onClick={() => handleFontSizeChange("normal")}
                      className="block w-full text-left px-3 py-1 text-xs text-orange-700 hover:bg-orange-50"
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => handleFontSizeChange("large")}
                      className="block w-full text-left px-3 py-1 text-xs text-orange-700 hover:bg-orange-50"
                    >
                      Large
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-9xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left - National Emblem, Logo and Title */}
            <div className="flex items-center space-x-4">
              <img
                src={nationalEmblem}
                alt="National Emblem"
                className="w-12 h-12 md:w-16 md:h-16"
              />
              <img src={logo} alt="Railway logo" className="w-12 h-12 md:w-16 md:h-16" />
              <div>
                <Link to="/dashboard" className="block">
                  <h1 className="text-lg md:text-xl font-bold text-black-800 hover:text-black-600 transition-colors cursor-pointer">
                    Northern Railway
                  </h1>
                  <h2 className="text-base md:text-lg font-semibold text-black-700">
                    Supervisor Training Center
                  </h2>
                </Link>
                <p className="text-xs md:text-sm text-black-600">
                  Trainee Management System
                </p>
              </div>
            </div>

            {/* Center - Search with Dropdown */}
            <div
              className="flex items-center space-x-2 relative w-full md:w-auto"
              ref={searchDropdownRef}
            >
              <form
                onSubmit={handleSearch}
                className="flex items-center space-x-2 w-full md:w-auto"
                role="search"
                aria-label="Site Search"
              >
                <div className="relative flex-1 md:flex-none">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="px-3 py-2 border border-orange-300 rounded text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50"
                    autoComplete="off"
                    aria-label="Search"
                  />
                  {/* Search Dropdown */}
                  {showSearchDropdown && searchResults.length > 0 && (
                    <div
                      className="absolute top-full left-0 mt-1 w-full bg-white rounded shadow-lg border border-orange-200 py-1 z-[9999] max-h-80 overflow-y-auto"
                      role="listbox"
                    >
                      {searchResults.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchResultClick(item)}
                          className="block w-full text-left px-3 py-2 text-sm text-orange-700 hover:bg-orange-50 hover:text-orange-900 border-none bg-transparent"
                          role="option"
                          aria-label={item.name}
                          type="button"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                              {item.category}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 md:px-4 md:py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                  aria-label="Submit Search"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right - User Info */}
            <div className="flex items-center space-x-4">
              {/* User badge */}
              <div
                className="flex items-center gap-2 px-3 py-1 rounded bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200 capitalize"
                aria-label={`Role: ${userRole}`}
              >
                <UserCircle className="w-4 h-4" />
                {userRole}
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1 rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        className="bg-orange-600 shadow-md sticky top-0 z-40"
        aria-label="Main Navigation"
      >
        <div className="max-w-9xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center text-white p-2"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-0 flex-1">
              {/* Add Candidate Dropdown */}
              <div className="relative" ref={addDropdownRef}>
                <button
                  onClick={() => setShowAddDropdown((v) => !v)}
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 border-r border-orange-500 transition-colors h-12"
                  aria-haspopup="true"
                  aria-expanded={showAddDropdown}
                  aria-controls="add-dropdown"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Candidate</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showAddDropdown && (
                  <div
                    id="add-dropdown"
                    className="absolute top-full left-0 mt-0 w-56 bg-white rounded-b-lg shadow-lg border border-orange-200 py-1 z-50"
                  >
                    <Link
                      to="/stc-form"
                      className="flex items-center px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 hover:text-orange-900"
                      onClick={() => setShowAddDropdown(false)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      STC Candidate
                    </Link>
                    <Link
                      to="/wtc-form"
                      className="flex items-center px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 hover:text-orange-900"
                      onClick={() => setShowAddDropdown(false)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      WTC Candidate
                    </Link>
                    <Link
                      to="/non-railway-form"
                      className="flex items-center px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 hover:text-orange-900"
                      onClick={() => setShowAddDropdown(false)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Non-Railway Candidate
                    </Link>
                  </div>
                )}
              </div>

              {/* Manage Candidate */}
              <Link
                to="/manage-candidate"
                className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 border-r border-orange-500 transition-colors h-12"
              >
                <Users className="w-4 h-4" />
                <span>Manage Candidate</span>
              </Link>

              {/* Management Systems Dropdown */}
              <div className="relative" ref={managementDropdownRef}>
                <button
                  onClick={() => setShowManagementDropdown((v) => !v)}
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 border-r border-orange-500 transition-colors h-12"
                  aria-haspopup="true"
                  aria-expanded={showManagementDropdown}
                  aria-controls="management-dropdown"
                >
                  <Settings className="w-4 h-4" />
                  <span>Management Systems</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showManagementDropdown && (
                  <div
                    id="management-dropdown"
                    className="absolute top-full left-0 mt-0 w-64 bg-white rounded-b-lg shadow-lg border border-orange-200 py-1 z-50"
                  >
                    <Link
                      to="/stc-management"
                      className="flex items-center px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 hover:text-orange-900"
                      onClick={() => setShowManagementDropdown(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      STC Management System
                    </Link>
                    <div className="border-t border-orange-100 my-1"></div>
                    <Link
                      to="/wtc"
                      className="flex items-center px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 hover:text-orange-900"
                      onClick={() => setShowManagementDropdown(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      WTC Management System
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Title for mobile view */}
            <div className="md:hidden text-white text-sm font-semibold">
              Trainee Management
            </div>
          </div>
        </div>

        {/* Mobile Menu - Now controlled by state */}
        <div
          id="mobile-menu"
          className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-orange-500 bg-orange-600 transition-all duration-300 ease-in-out`}
          ref={mobileMenuRef}
        >
          <div className="px-4 py-3 space-y-2 max-h-[80vh] overflow-y-auto">
            <div className="text-xs font-semibold text-orange-100 uppercase tracking-wide mb-2">
              Add Candidate
            </div>
            <Link
              to="/stc-form"
              className="flex items-center px-3 py-2 text-sm text-white hover:bg-orange-700 rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus className="w-4 h-4 mr-2" />
              STC Candidate
            </Link>
            <Link
              to="/wtc-form"
              className="flex items-center px-3 py-2 text-sm text-white hover:bg-orange-700 rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus className="w-4 h-4 mr-2" />
              WTC Candidate
            </Link>
            <Link
              to="/non-railway-form"
              className="flex items-center px-3 py-2 text-sm text-white hover:bg-orange-700 rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Non-Railway Candidate
            </Link>

            <div className="text-xs font-semibold text-orange-100 uppercase tracking-wide mb-2 mt-4 pt-2 border-t border-orange-500">
              Management
            </div>
            <Link
              to="/manage-candidate"
              className="flex items-center px-3 py-2 text-sm text-white hover:bg-orange-700 rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Candidate
            </Link>
            <Link
              to="/stc-management"
              className="flex items-center px-3 py-2 text-sm text-white hover:bg-orange-700 rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              STC Management System
            </Link>
            <Link
              to="/wtc"
              className="flex items-center px-3 py-2 text-sm text-white hover:bg-orange-700 rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              WTC Management System
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
