import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Shield, Settings, ClipboardList } from "lucide-react";

const roleOptions = [
    { value: "admin", label: "Administrator", icon: <Shield className="w-6 h-6" /> },
    { value: "master", label: "Master", icon: <Settings className="w-6 h-6" /> },
    { value: "operator", label: "Operator", icon: <ClipboardList className="w-6 h-6" /> },
];

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ role: "admin", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-pink-50 p-4">
            <div className="w-full max-w-md bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Northern Railways </h1>
                    <h2 className="text-2xl font-bold text-gray-900">Trainee Management System</h2>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Role
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {roleOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() =>
                                        handleChange({ target: { name: "role", value: option.value } })
                                    }
                                    className={`cursor-pointer rounded-xl border p-3 text-center transition ${credentials.role === option.value
                                        ? "bg-blue-100 border-blue-500"
                                        : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex justify-center mb-1 text-blue-600">
                                        {option.icon}
                                    </div>
                                    <div className="text-sm font-medium text-gray-800">
                                        {option.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password / Pin (Currently)
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={credentials.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                            placeholder="Enter password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
