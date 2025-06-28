import { LogOut, UserCircle, Plus, Users, Settings, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from '../auth/AuthContext';
import logo from '../assets/rail.png';

const Navbar = () => {
    const { userRole, logout } = useAuth();
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [showManagementDropdown, setShowManagementDropdown] = useState(false);
    const addDropdownRef = useRef(null);
    const managementDropdownRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addDropdownRef.current && !addDropdownRef.current.contains(event.target)) {
                setShowAddDropdown(false);
            }
            if (managementDropdownRef.current && !managementDropdownRef.current.contains(event.target)) {
                setShowManagementDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <img src={logo} alt="Railway logo" className="w-12" />
                        <span className="font-semibold text-gray-800 text-lg">
                            NR Trainee Management
                        </span>
                    </Link>

                    {/* Navigation Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {/* Add Candidate Dropdown */}
                        <div className="relative" ref={addDropdownRef}>
                            <button
                                onClick={() => setShowAddDropdown(!showAddDropdown)}
                                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Candidate</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {showAddDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <Link
                                        to="/stc-form"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={() => setShowAddDropdown(false)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        STC Candidate
                                    </Link>
                                    <Link
                                        to="/wtc-form"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={() => setShowAddDropdown(false)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        WTC Candidate
                                    </Link>
                                    <Link
                                        to="/non-railway-form"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
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
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            <span>Manage Candidate</span>
                        </Link>

                        {/* Management Systems Dropdown */}
                        <div className="relative" ref={managementDropdownRef}>
                            <button
                                onClick={() => setShowManagementDropdown(!showManagementDropdown)}
                                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Management Systems</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {showManagementDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <Link
                                        to="/stc-management"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={() => setShowManagementDropdown(false)}
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        STC Management System
                                    </Link>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <Link
                                        to="/wtc-management"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        WTC Management System
                                    </Link>

                                </div>

                            )}
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-3">
                        {/* User badge */}
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 capitalize">
                            <UserCircle className="w-4 h-4" />
                            {userRole}
                        </div>

                        {/* Logout button */}
                        <button onClick={logout} className="flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden border-t border-gray-200">
                <div className="px-4 py-2 space-y-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Add Candidate</div>
                    <Link to="/stc-form" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 rounded">
                        <Plus className="w-4 h-4 mr-2" />
                        STC Candidate
                    </Link>
                    <Link to="/wtc-form" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 rounded">
                        <Plus className="w-4 h-4 mr-2" />
                        WTC Candidate
                    </Link>
                    <Link to="/non-railway-form" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 rounded">
                        <Plus className="w-4 h-4 mr-2" />
                        Non-Railway Candidate
                    </Link>

                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Management</div>
                    <Link to="/manage-candidate" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 rounded">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Candidate
                    </Link>
                    <Link to="/stc-management" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 rounded">
                        <Settings className="w-4 h-4 mr-2" />
                        STC Management System
                    </Link>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
