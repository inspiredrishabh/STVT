import React, { useState, useEffect } from 'react';

// Real API Class for Dashboard Data
class DashboardAPI {
    constructor() {
        this.baseURL = '/api';
    }

    // Fetch STC candidates count
    async getStcCandidatesCount() {
        try {
            const response = await fetch(`${this.baseURL}/stc`);
            const data = await response.json();
            return data.success ? data.count || data.data?.length || 0 : 0;
        } catch (error) {
            console.error('Error fetching STC candidates:', error);
            return 0;
        }
    }

    // Fetch WTC candidates count
    async getWtcCandidatesCount() {
        try {
            const response = await fetch(`${this.baseURL}/wtc`);
            const data = await response.json();
            return data.success ? data.count || data.data?.length || 0 : 0;
        } catch (error) {
            console.error('Error fetching WTC candidates:', error);
            return 0;
        }
    }

    // Fetch Non-Railway candidates count
    async getNonRailwayCandidatesCount() {
        try {
            const response = await fetch(`${this.baseURL}/nonrailway`);
            const data = await response.json();
            return data.success ? data.count || data.data?.length || 0 : 0;
        } catch (error) {
            console.error('Error fetching Non-Railway candidates:', error);
            return 0;
        }
    }

    // Get categories data for bar chart
    async getCategoriesData() {
        try {
            const [stcCount, wtcCount, nonRailwayCount] = await Promise.all([
                this.getStcCandidatesCount(),
                this.getWtcCandidatesCount(),
                this.getNonRailwayCandidatesCount()
            ]);

            const data = [
                { category: 'STC', count: stcCount, color: '#2563eb' },
                { category: 'WTC', count: wtcCount, color: '#10b981' },
                { category: 'Non-Railway', count: nonRailwayCount, color: '#f59e0b' }
            ];

            return {
                success: true,
                data: data,
                endpoint: 'Real API endpoints',
                method: 'GET'
            };
        } catch (error) {
            console.error('Error fetching categories data:', error);
            return {
                success: false,
                data: [],
                error: error.message
            };
        }
    }

    // Get distribution data for pie chart
    async getDistributionData() {
        try {
            const [stcCount, wtcCount, nonRailwayCount] = await Promise.all([
                this.getStcCandidatesCount(),
                this.getWtcCandidatesCount(),
                this.getNonRailwayCandidatesCount()
            ]);

            const total = stcCount + wtcCount + nonRailwayCount;

            if (total === 0) {
                return {
                    success: true,
                    data: [],
                    endpoint: 'Real API endpoints',
                    method: 'GET'
                };
            }

            const data = [
                {
                    name: 'STC',
                    value: Math.round((stcCount / total) * 100),
                    count: stcCount,
                    color: '#2563eb'
                },
                {
                    name: 'WTC',
                    value: Math.round((wtcCount / total) * 100),
                    count: wtcCount,
                    color: '#10b981'
                },
                {
                    name: 'Non-Railway',
                    value: Math.round((nonRailwayCount / total) * 100),
                    count: nonRailwayCount,
                    color: '#f59e0b'
                }
            ];

            return {
                success: true,
                data: data,
                endpoint: 'Real API endpoints',
                method: 'GET'
            };
        } catch (error) {
            console.error('Error fetching distribution data:', error);
            return {
                success: false,
                data: [],
                error: error.message
            };
        }
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

    // Get overall statistics
    async getOverallStats() {
        try {
            const [stcCount, wtcCount, nonRailwayCount] = await Promise.all([
                this.getStcCandidatesCount(),
                this.getWtcCandidatesCount(),
                this.getNonRailwayCandidatesCount()
            ]);

            const classroomCapacity = 126;
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            // Calculate working days for current month
            const workingDaysThisMonth = this.calculateWorkingDays(currentYear, currentMonth);
            const trainingCapacity = classroomCapacity * workingDaysThisMonth;

            // Calculate stats based on real data
            const totalCandidates = stcCount + wtcCount + nonRailwayCount;
            const railwayCandidates = stcCount + wtcCount;

            const data = {
                totalCandidates: totalCandidates,
                railwayCandidates: railwayCandidates,
                nonRailwayCandidates: nonRailwayCount,
                stcCandidates: stcCount,
                wtcCandidates: wtcCount,
                activeCourses: Math.ceil(totalCandidates / 25), // Assuming 25 candidates per course
                completedCourses: Math.floor(totalCandidates / 30), // Assuming some courses are completed
                pendingApplications: Math.floor(totalCandidates * 0.1), // 10% pending
                trainingCapacity: trainingCapacity,
                classroomCapacity: classroomCapacity,
                workingDaysThisMonth: workingDaysThisMonth,
                totalBatches: Math.ceil(totalCandidates / 25),
                monthlyGrowth: totalCandidates > 0 ? 12.5 : 0
            };

            return {
                success: true,
                data: data,
                endpoint: 'Real API endpoints',
                method: 'GET'
            };
        } catch (error) {
            console.error('Error fetching overall stats:', error);
            return {
                success: false,
                data: null,
                error: error.message
            };
        }
    }    // Get recent activities from all three systems
    async getRecentActivities() {
        try {
            // Fetch recent data from all three endpoints
            const [stcResponse, wtcResponse, nonRailwayResponse] = await Promise.all([
                fetch(`${this.baseURL}/stc`).catch(() => ({ json: () => ({ success: false, data: [] }) })),
                fetch(`${this.baseURL}/wtc`).catch(() => ({ json: () => ({ success: false, data: [] }) })),
                fetch(`${this.baseURL}/nonrailway`).catch(() => ({ json: () => ({ success: false, data: [] }) }))
            ]);

            const [stcData, wtcData, nonRailwayData] = await Promise.all([
                stcResponse.json(),
                wtcResponse.json(),
                nonRailwayResponse.json()
            ]);

            const activities = [];

            // Process STC data
            if (stcData.success && stcData.data) {
                const stcCandidates = Array.isArray(stcData.data) ? stcData.data.slice(0, 3) : [];
                stcCandidates.forEach((candidate, index) => {
                    activities.push({
                        id: `stc-${candidate.id || index}`,
                        activity: 'STC candidate registered',
                        candidate: `${candidate.name || 'Unknown'} - ${candidate.ticket_no || 'N/A'}`,
                        time: this.getTimeAgo(candidate.created_at || new Date()),
                        type: 'registration',
                        icon: '�',
                        category: 'STC'
                    });
                });
            }

            // Process WTC data
            if (wtcData.success && wtcData.data) {
                const wtcCandidates = Array.isArray(wtcData.data) ? wtcData.data.slice(0, 3) : [];
                wtcCandidates.forEach((candidate, index) => {
                    activities.push({
                        id: `wtc-${candidate.id || index}`,
                        activity: 'WTC candidate registered',
                        candidate: `${candidate.name || 'Unknown'} - ${candidate.ticket_no || 'N/A'}`,
                        time: this.getTimeAgo(candidate.created_at || new Date()),
                        type: 'registration',
                        icon: '🎓',
                        category: 'WTC'
                    });
                });
            }

            // Process Non-Railway data
            if (nonRailwayData.success && nonRailwayData.data) {
                const nonRailwayCandidates = Array.isArray(nonRailwayData.data) ? nonRailwayData.data.slice(0, 2) : [];
                nonRailwayCandidates.forEach((candidate, index) => {
                    activities.push({
                        id: `nonrailway-${candidate.id || index}`,
                        activity: 'Non-Railway application submitted',
                        candidate: `${candidate.name || 'Unknown'} - ${candidate.ticket_no || 'N/A'}`,
                        time: this.getTimeAgo(candidate.created_at || new Date()),
                        type: 'application',
                        icon: '📝',
                        category: 'Non-Railway'
                    });
                });
            }

            // Sort activities by time (most recent first)
            activities.sort((a, b) => new Date(b.time) - new Date(a.time));

            return {
                success: true,
                data: activities.slice(0, 8), // Limit to 8 activities
                endpoint: 'Real API endpoints',
                method: 'GET'
            };
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            return {
                success: false,
                data: [],
                error: error.message
            };
        }
    }

    // Helper function to format time ago
    getTimeAgo(dateString) {
        try {
            if (!dateString) {
                return 'Unknown time';
            }

            const now = new Date();
            let date;
            
            // Convert to string if it's not already
            const dateStr = typeof dateString === 'string' ? dateString : String(dateString);
            
            // SQLite stores datetime as 'YYYY-MM-DD HH:MM:SS' in UTC
            // We need to explicitly parse it as UTC
            if (dateStr.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
                // Add 'Z' to indicate UTC timezone
                date = new Date(dateStr.replace(' ', 'T') + 'Z');
            } else {
                date = new Date(dateStr);
            }
            
            // If still invalid, return a fallback
            if (isNaN(date.getTime())) {
                console.warn('Invalid date string:', dateString);
                return 'Recently';
            }

            const diffInSeconds = Math.floor((now - date) / 1000);
            
            // Remove debug log for cleaner output
            // console.log('Time calculation:', {
            //     now: now.toISOString(),
            //     date: date.toISOString(),
            //     dateString,
            //     diffInSeconds
            // });

            if (diffInSeconds < 0) {
                return 'Just now'; // Handle future dates
            }
            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
            if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
            return date.toLocaleDateString();
        } catch (error) {
            console.error('Error in getTimeAgo:', error, dateString);
            return 'Recently';
        }
    }
}

// Simple Chart Components (Since recharts might not be installed)
const SimpleBarChart = ({ data, title }) => {
    if (!data || data.length === 0) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
                <div className="text-center text-gray-500 py-8">No data available</div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.count));
    if (maxValue === 0) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
                <div className="text-center text-gray-500 py-8">No candidates registered yet</div>
            </div>
        );
    }

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
    if (!data || data.length === 0) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
                <div className="text-center text-gray-500 py-8">No data available</div>
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + item.count, 0);
    if (total === 0) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
                <div className="text-center text-gray-500 py-8">No candidates registered yet</div>
            </div>
        );
    }

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
            ]);

            if (categoriesRes.success) setCategoriesData(categoriesRes.data);
            if (distributionRes.success) setDistributionData(distributionRes.data);
            if (statsRes.success) setOverallStats(statsRes.data);
            if (activitiesRes.success) setRecentActivities(activitiesRes.data);

            // Real API endpoints being used:
            // GET /api/stc - Returns STC candidates data
            // GET /api/wtc - Returns WTC candidates data  
            // GET /api/nonrailway - Returns Non-Railway candidates data
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