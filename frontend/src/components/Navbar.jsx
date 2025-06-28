import { LogOut, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '../auth/AuthContext';
import logo from '../assets/rail.png';

const Navbar = () => {
    const { userRole, logout } = useAuth();

    return (
        <nav className="bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-18">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <img src={logo} alt="Railway logo" className="w-16" />
                        <span className="font-semibold text-gray-800 text-xl">
                            NR Trainee Management System
                        </span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-3 ml-4">
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
        </nav>
    );
};

export default Navbar;
