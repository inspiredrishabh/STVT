import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Shield, Settings, ClipboardList, Eye, EyeOff, Train, User, Lock } from "lucide-react";

// Import images
import anjiKhadBridge from "../assets/Anji-Khad-railway-bridge.jpg";
import charbagh1950 from "../assets/Charbagh 1950.jpg";
import charbaghStation from "../assets/Charbagh-Railway-Station-of-Lucknow.webp";
import tejasExpress from "../assets/Tejas-Express-locomotives.webp";
import knocksense from "../assets/knocksense_2025-05-31_fspx75ss_2WXHFE5.avif";
import trainingCenter from "../assets/Training center.jpg";
import nationalEmblem from "../assets/nationalEmblem.jpg";
import rail2 from "../assets/rail2.jpg";
import railPng from "../assets/rail.png";

const roleOptions = [
    { value: "admin", label: "Administrator", icon: <Shield className="w-5 h-5" /> },
    { value: "master", label: "Master", icon: <Settings className="w-5 h-5" /> },
    { value: "operator", label: "Operator", icon: <ClipboardList className="w-5 h-5" /> },
];

const galleryImages = [
    { src: charbagh1950, title: "Charbagh 1950" },
    { src: charbaghStation, title: "Charbagh Railway Station" },
    { src: tejasExpress, title: "Tejas Express Locomotives" },
    { src: knocksense, title: "Vande Bharat Express" },
    { src: trainingCenter, title: "Training Center" },
    { src: anjiKhadBridge, title: "Anji Khad Railway Bridge" },
];

const Login2 = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ role: "admin", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-swipe functionality for image gallery
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { role, password } = credentials;

        if (!password.trim()) {
            setError("Password is required");
            setIsLoading(false);
            return;
        }

        try {
            const result = await login(role, password);

            if (result.success) {
                navigate("/dashboard");
            } else {
                setError(result.message || "Login failed");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400">
            {/* Header Navbar */}
            <header className="bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg border-b-4 border-orange-600 h-20 flex-shrink-0">
                <div className="w-full px-3 h-full">
                    <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
                        {/* Left side - Government logos */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <img src={nationalEmblem} alt="National Emblem" className="h-11 w-auto" />
                            <div className="border-l border-orange-300 pl-2">
                                <h1 className="text-sm font-bold text-orange-900 leading-tight">Government of India</h1>
                                <h2 className="text-xs text-orange-700 leading-tight">Republic of India</h2>
                            </div>
                        </div>

                        {/* Center - Railway logo and title */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <img src={rail2} alt="Railway Logo" className="h-11 w-auto" />
                            <div className="text-center">
                                <h1 className="text-sm font-bold text-orange-900 leading-tight">Northern Railway</h1>
                                <h2 className="text-sm font-semibold text-orange-800 leading-tight">Indian Railways</h2>
                                <p className="text-xs text-orange-700 leading-tight">Trainee Management System</p>
                                <p className="text-xs text-orange-700 leading-tight">Digital Platform</p>
                            </div>
                        </div>

                        {/* Right side - Additional info */}
                        <div className="text-right flex-shrink-0 flex items-center space-x-2">
                            <img src={railPng} alt="Railway Ministry Logo" className="h-11 w-auto" />
                            <div className="text-xs text-orange-700">
                                <p className="leading-tight">Ministry of Railways</p>
                                <p className="leading-tight">Government of India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-80px)] w-full">
                {/* Left Side - Photo Gallery */}
                <div className="w-1/2 p-4 flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
                    <div className="w-full max-w-md">
                        {/* Gallery Container Box */}
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-2xl overflow-hidden border-2 border-orange-300">
                            <div className="relative h-80 overflow-hidden">
                                {/* Image Slider */}
                                {galleryImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                            index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                        }`}
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <h3 className="text-white text-sm font-bold text-center drop-shadow-lg">
                                                {image.title}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Image Indicators */}
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 flex justify-center space-x-2">
                                {galleryImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            index === currentImageIndex 
                                                ? 'bg-orange-600 scale-125' 
                                                : 'bg-orange-300 hover:bg-orange-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        {/* Gallery Title */}
                        <div className="text-center mt-3">
                            <h2 className="text-lg font-bold text-orange-900 mb-1">Northern Railway Gallery</h2>
                            <p className="text-xs text-orange-700">Heritage & Modern Railways</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-1/2 flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 overflow-y-auto">
                    <div className="w-full max-w-md">
                        {/* Login Card Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-orange-900 mb-2">Welcome</h2>
                            <h3 className="text-xl font-bold text-orange-800 mb-2">Login Portal</h3>
                            <p className="text-orange-700 text-sm leading-tight">Please login to Trainee Management System</p>
                            <p className="text-orange-700 text-sm leading-tight">Secure Authentication Required</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-3">
                                <div className="flex">
                                    <div className="ml-2">
                                        <p className="text-xs text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Role Selection */}
                            <div>
                                <label className="block text-xs font-medium text-orange-800 mb-2">
                                    <User className="w-3 h-3 inline mr-1" />
                                    Select Role
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {roleOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() =>
                                                handleChange({ target: { name: "role", value: option.value } })
                                            }
                                            className={`cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 ${
                                                credentials.role === option.value
                                                    ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-400 shadow-sm"
                                                    : "border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className={`${
                                                    credentials.role === option.value ? 'text-orange-500' : 'text-orange-400'
                                                }`}>
                                                    {option.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-medium text-xs ${
                                                        credentials.role === option.value ? 'text-orange-700' : 'text-orange-600'
                                                    }`}>
                                                        {option.label}
                                                    </div>
                                                </div>
                                                <div className={`w-3 h-3 rounded-full border-2 ${
                                                    credentials.role === option.value 
                                                        ? 'border-orange-400 bg-orange-400' 
                                                        : 'border-orange-300'
                                                }`}>
                                                    {credentials.role === option.value && (
                                                        <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-xs font-medium text-orange-800 mb-1">
                                    <Lock className="w-3 h-3 inline mr-1" />
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={credentials.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pr-10 rounded-lg border-2 border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-xs bg-gradient-to-r from-orange-50 to-yellow-50"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-2 flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2 px-4 bg-gradient-to-r from-orange-600 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-yellow-600 focus:ring-4 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-xs shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Logging in...
                                    </div>
                                ) : (
                                    "LOGIN"
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-4 text-center text-xs text-orange-700">
                            <p className="leading-tight">© 2025 Indian Railways</p>
                            <p className="leading-tight">All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login2;
