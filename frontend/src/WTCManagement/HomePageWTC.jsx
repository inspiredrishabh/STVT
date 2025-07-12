import { Link } from "react-router-dom";
import {
  Users,
  RectangleHorizontal,
  FileText,
  ArrowLeft,
  Settings,
  UserCheck,
} from "lucide-react";

const HomePageWTC = () => {
  const managementOptions = [
    {
      id: "trainee-profile",
      title: "Trainee Profile",
      description: "View and manage trainee profiles",
      icon: Users,
      path: "/wtc/trainee-profile",
      color: "bg-green-500 hover:bg-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "attendance-system",
      title: "Attendance System",
      description: "Mark and track trainee attendance",
      icon: UserCheck,
      path: "/wtc/attendance",
      color: "bg-blue-500 hover:bg-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "certificate",
      title: "Certificate Generation",
      description: "Manage Certificate Generation",
      icon: RectangleHorizontal,
      path: "/wtc/certificate",
      color: "bg-purple-500 hover:bg-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "letter",
      title: "Letter Generation",
      description: "Generate official letters",
      icon: FileText,
      path: "/wtc/letter",
      color: "bg-orange-500 hover:bg-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 w-full">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and Title */}
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  WTC Management
                </h1>
                <p className="text-gray-600 text-sm ">
                  WorkShop Training Center Management System
                </p>
              </div>
            </div>

            {/* Right side - Status indicator */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium text-xs">
                  System Active
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Current Date</div>
                <div className="text-xs font-medium text-gray-700">
                  {new Date().toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-6 border border-gray-200 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Quick Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">25</div>
            <div className="text-gray-600">Active Trainees</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <div className="text-gray-600">Ongoing Courses</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
            <div className="text-gray-600">Completed This Month</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="text-3xl font-bold text-orange-600 mb-2">92%</div>
            <div className="text-gray-600">Average Attendance</div>
          </div>
        </div>
      </div> */}


      {/* Main Content */}
      <div className="w-full px-8 py-12">
        {/* Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {managementOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Link key={option.id} to={option.path} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-200">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-full ${option.iconBg} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-8 h-8 ${option.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className={`w-full py-2 px-4 ${option.color} text-white text-center rounded-lg font-medium`}
                    >
                      Open Module
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default HomePageWTC;