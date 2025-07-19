import { Link } from "react-router-dom";
import {
  Users,
  ClipboardList,
  GraduationCap,
  FileText,
  ArrowLeft,
  Settings,
  Award,
} from "lucide-react";

const HomePageSTC = () => {
  const managementOptions = [
    {
      id: "trainee-profile",
      title: "Trainee Profile",
      description: "View and manage trainee profiles",
      icon: Users,
      path: "/stc/trainee-profile",
      color: "bg-green-500 hover:bg-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "feed-marks",
      title: "Feed Marks",
      description: "Input and manage trainee marks",
      icon: ClipboardList,
      path: "/stc/feed-marks",
      color: "bg-blue-500 hover:bg-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "line-training",
      title: "Line Training",
      description: "Manage line training schedules",
      icon: GraduationCap,
      path: "/stc/line-training",
      color: "bg-purple-500 hover:bg-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "marksheet",
      title: "Marksheet",
      description: "Generate and view marksheets",
      icon: FileText,
      path: "/stc/marksheet",
      color: "bg-orange-500 hover:bg-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: "certificate",
      title: "Certificate Generation",
      description: "Generate training certificates",
      icon: Award,
      path: "/stc/certificate",
      color: "bg-indigo-500 hover:bg-indigo-600",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-md border-b border-gray-200 w-full">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and Title */}
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  STC Management
                </h1>
                <p className="text-gray-600 text-sm ">
                  Supervisors' Training Center Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-8 py-12">
        {/* Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {managementOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Link key={option.id} to={option.path} className="group">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-orange-500 h-full flex flex-col">
                  {/* Icon and Title */}
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-md ${option.iconBg} flex items-center justify-center mr-4`}
                    >
                      <IconComponent className={`w-6 h-6 ${option.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {option.title}
                    </h3>
                  </div>
                  {/* Content */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {option.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePageSTC;