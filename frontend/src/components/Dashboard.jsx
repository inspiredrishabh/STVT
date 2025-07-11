import React, { useState, useEffect } from 'react';

// Mock API Class for Dashboard Data
class DashboardAPI {
    constructor() {
        this.baseDelay = 500;
        this.baseURL = '/api/dashboard'; 
    }

    // Simulate API delay
    delay(ms = this.baseDelay) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }    // GET /api/dashboard/categories - STC, WTC, Non-Railway Categories Data for Bar Chart
    async getCategoriesData() {
        await this.delay();

        // Only 3 categories: STC, WTC, Non-Railway
        const mockData = [
            { category: 'STC', count: 450, color: '#2563eb' },
            { category: 'WTC', count: 320, color: '#10b981' },
            { category: 'Non-Railway', count: 500, color: '#f59e0b' }
        ];

        return {
            success: true,
            data: mockData,
            endpoint: `${this.baseURL}/categories`,
            method: 'GET'
        };
    }

    // GET /api/dashboard/distribution - Distribution Data for Pie Chart
    async getDistributionData() {
        await this.delay();

        // Pie chart showing STC, WTC, Non-Railway distribution
        const total = 450 + 320 + 500; // 1270

        const mockData = [
            {
                name: 'STC',
                value: Math.round((450 / total) * 100), // 35%
                count: 450,
                color: '#2563eb'
            },
            {
                name: 'WTC',
                value: Math.round((320 / total) * 100), // 25%
                count: 320,
                color: '#10b981'
            },
            {
                name: 'Non-Railway',
                value: Math.round((500 / total) * 100), // 39%
                count: 500,
                color: '#f59e0b'
            }
        ];

        return {
            success: true,
            data: mockData,
            endpoint: `${this.baseURL}/distribution`,
            method: 'GET'
        };
    }    // Helper function to calculate working days in a month (excluding government holidays in UP)
    calculateWorkingDays(year, month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        let workingDays = 0;

        // Government holidays in UP (approximate dates for calculation)
        const holidays = {
            1: [1, 26], // January: New Year, Republic Day
            2: [], // February
            3: [8], // March: Holi (varies, using approximate)
            4: [14], // April: Ambedkar Jayanti
            5: [1], // May: Labour Day
            6: [], // June
            7: [], // July
            8: [15], // August: Independence Day
            9: [], // September
            10: [2], // October: Gandhi Jayanti
            11: [], // November: Diwali (varies)
            12: [25] // December: Christmas
        };

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay();

            // Skip Sundays (0) and check if it's not a holiday
            if (dayOfWeek !== 0 && !holidays[month]?.includes(day)) {
                workingDays++;
            }
        }

        return workingDays;
    }

    // GET /api/dashboard/stats - Overall Statistics
    async getOverallStats() {
        await this.delay();

        const classroomCapacity = 126;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        // Calculate working days for current month
        const workingDaysThisMonth = this.calculateWorkingDays(currentYear, currentMonth);
        const trainingCapacity = classroomCapacity * workingDaysThisMonth;

        // Updated stats based on Railway (STC + WTC) vs Non-Railway structure
        const mockData = {
            totalCandidates: 1270, // 450 (STC) + 320 (WTC) + 500 (Non-Railway)
            railwayCandidates: 770, // 450 (STC) + 320 (WTC)
            nonRailwayCandidates: 500,
            stcCandidates: 450,
            wtcCandidates: 320,
            activeCourses: 35,
            completedCourses: 95,
            pendingApplications: 67,
            trainingCapacity: trainingCapacity,
            classroomCapacity: classroomCapacity,
            workingDaysThisMonth: workingDaysThisMonth,
            totalBatches: 18,
            monthlyGrowth: 12.5
        };

        return {
            success: true,
            data: mockData,
            endpoint: `${this.baseURL}/stats`,
            method: 'GET'
        };
    }    // GET /api/dashboard/activities - Recent Activities
    async getRecentActivities() {
        await this.delay();

        const mockData = [
            {
                id: 1,
                activity: 'New STC candidate registered',
                candidate: 'Rajesh Kumar - EMP001',
                time: '2 hours ago',
                type: 'registration',
                icon: '👤',
                category: 'STC'
            },
            {
                id: 2,
                activity: 'WTC course completion certificate issued',
                candidate: 'Priya Sharma - EMP145',
                time: '3 hours ago',
                type: 'completion',
                icon: '🎓',
                category: 'WTC'
            },
            {
                id: 3,
                activity: 'STC batch evaluation completed',
                candidate: 'Batch STC-2024-15 (25 candidates)',
                time: '5 hours ago',
                type: 'evaluation',
                icon: '📊',
                category: 'STC'
            },
            {
                id: 4,
                activity: 'New Non-Railway application submitted',
                candidate: 'Anil Verma - CONT789',
                time: '6 hours ago',
                type: 'application',
                icon: '📝',
                category: 'Non-Railway'
            },
            {
                id: 5,
                activity: 'WTC training schedule updated',
                candidate: 'Batch WTC-2024-08',
                time: '8 hours ago',
                type: 'schedule',
                icon: '📅',
                category: 'WTC'
            },
            {
                id: 6,
                activity: 'STC practical assessment conducted',
                candidate: 'Mumbai Division - 15 trainees',
                time: '10 hours ago',
                type: 'assessment',
                icon: '✅',
                category: 'STC'
            },
            {
                id: 7,
                activity: 'Non-Railway certification approved',
                candidate: 'Sunita Yadav - CERT456',
                time: '12 hours ago',
                type: 'approval',
                icon: '✓',
                category: 'Non-Railway'
            },
            {
                id: 8,
                activity: 'WTC theoretical exam results published',
                candidate: 'Delhi Zone - Batch WTC-2024-12',
                time: '1 day ago',
                type: 'results',
                icon: '📋',
                category: 'WTC'
            }
        ];

        return {
            success: true,
            data: mockData,
            endpoint: `${this.baseURL}/activities`,
            method: 'GET'
        };
    }
}

// Simple Chart Components (Since recharts might not be installed)
const SimpleBarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.count));

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <div className="w-16 text-sm font-medium text-gray-600 text-right">
                            {item.category}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                            <div
                                className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                                style={{
                                    backgroundColor: item.color,
                                    width: `${(item.count / maxValue) * 100}%`,
                                    minWidth: '40px'
                                }}
                            >
                                {item.count}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SimplePieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = 0;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
            <div className="flex items-center justify-center space-x-8">
                {/* SVG Pie Chart */}
                <div className="relative">
                    <svg width="200" height="200" className="transform -rotate-90">
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                        />
                        {data.map((item, index) => {
                            const percentage = (item.count / total) * 100;
                            const angle = (percentage / 100) * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + angle;

                            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

                            const largeArcFlag = angle > 180 ? 1 : 0;

                            const pathData = [
                                `M 100 100`,
                                `L ${x1} ${y1}`,
                                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                `Z`
                            ].join(' ');

                            currentAngle += angle;

                            return (
                                <path
                                    key={index}
                                    d={pathData}
                                    fill={item.color}
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.value}% ({item.count})</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function Dashboard() {
    const [categoriesData, setCategoriesData] = useState([]);
    const [distributionData, setDistributionData] = useState([]);
    const [overallStats, setOverallStats] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dashboardAPI = new DashboardAPI();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [categoriesRes, distributionRes, statsRes, activitiesRes] = await Promise.all([
                dashboardAPI.getCategoriesData(),
                dashboardAPI.getDistributionData(),
                dashboardAPI.getOverallStats(),
                dashboardAPI.getRecentActivities()
            ]); if (categoriesRes.success) setCategoriesData(categoriesRes.data);
            if (distributionRes.success) setDistributionData(distributionRes.data);
            if (statsRes.success) setOverallStats(statsRes.data);
            if (activitiesRes.success) setRecentActivities(activitiesRes.data);

            // Backend API Endpoints for implementation:
            // GET /api/dashboard/categories - Returns STC, WTC, Non-Railway categories data for bar chart
            // GET /api/dashboard/distribution - Returns distribution data for pie chart  
            // GET /api/dashboard/stats - Returns overall statistics
            // GET /api/dashboard/activities - Returns recent activities
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Dashboard data loading error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading dashboard...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="text-red-600 mr-3">⚠️</div>
                            <div>
                                <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
                                <p className="text-red-700 mt-1">{error}</p>
                                <button
                                    onClick={loadDashboardData}
                                    className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded text-sm"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Form Data Visualization</h1>
                            <p className="text-gray-600 mt-2">Comprehensive overview of training programs and candidate statistics</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={loadDashboardData}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                {overallStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                                    <p className="text-2xl font-bold text-gray-900">{overallStats.totalCandidates.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active Courses</p>
                                    <p className="text-2xl font-bold text-gray-900">{overallStats.activeCourses}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900">{overallStats.completedCourses}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Training Capacity</p>
                                    <p className="text-2xl font-bold text-gray-900">{overallStats.trainingCapacity}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {overallStats.classroomCapacity} × {overallStats.workingDaysThisMonth} days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Railway Breakdown Summary */}
                {overallStats && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Training Categories Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <h3 className="text-lg font-semibold text-blue-700">Railway Training</h3>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{overallStats.railwayCandidates}</p>
                                <div className="mt-3 space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">STC:</span>
                                        <span className="font-medium text-blue-700">{overallStats.stcCandidates}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">WTC:</span>
                                        <span className="font-medium text-blue-700">{overallStats.wtcCandidates}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                                <h3 className="text-lg font-semibold text-orange-700">Non-Railway Training</h3>
                                <p className="text-3xl font-bold text-orange-900 mt-2">{overallStats.nonRailwayCandidates}</p>
                                <p className="text-sm text-gray-600 mt-3">General training programs for non-railway personnel</p>
                            </div>

                            <div className="text-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <h3 className="text-lg font-semibold text-green-700">Total Candidates</h3>
                                <p className="text-3xl font-bold text-green-900 mt-2">{overallStats.totalCandidates}</p>
                                <div className="mt-3">
                                    <div className="text-sm text-gray-600">
                                        Railway: {Math.round((overallStats.railwayCandidates / overallStats.totalCandidates) * 100)}%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Non-Railway: {Math.round((overallStats.nonRailwayCandidates / overallStats.totalCandidates) * 100)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Bar Chart - STC, WTC, Non-Railway Categories */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <SimpleBarChart data={categoriesData} title="STC, WTC & Non-Railway Categories" />
                    </div>

                    {/* Pie Chart - Distribution */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <SimplePieChart data={distributionData} title="Distribution (Pie Chart)" />
                    </div>
                </div>

                {/* Recent Activities - Full Width */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View All
                        </button>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border-l-4"
                                style={{
                                    borderLeftColor:
                                        activity.category === 'STC' ? '#2563eb' :
                                            activity.category === 'WTC' ? '#10b981' :
                                                activity.category === 'Non-Railway' ? '#f59e0b' : '#6b7280'
                                }}>
                                <div className="flex-shrink-0 text-lg">
                                    {activity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {activity.activity}
                                        </p>
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${activity.category === 'STC' ? 'bg-blue-100 text-blue-700' :
                                            activity.category === 'WTC' ? 'bg-green-100 text-green-700' :
                                                activity.category === 'Non-Railway' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {activity.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {activity.candidate}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;