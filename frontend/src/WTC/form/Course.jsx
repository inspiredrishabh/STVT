import React from "react";

const Course = ({ formData, onChange, onSubmit }) => {
  const batchOptions = [];
  for (let year = 2010; year <= 2025; year++) {
    batchOptions.push(`${year}-${year + 1}`);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(); // optional callback from parent
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full shadow text-lg">
          🎓
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Course Detail</h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6"
      >
        {/* Ticket Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Ticket Number</label>
          <input
            type="text"
            value={formData.ticketNo || ""}
            onChange={(e) => onChange("ticketNo", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter ticket number"
          />
        </div>

        {/* Batch */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Batch</label>
          <select
            value={formData.batch || ""}
            onChange={(e) => onChange("batch", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select batch</option>
            {batchOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Date of Joining at STC */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Date of Joining at STC</label>
          <input
            type="date"
            value={formData.dateOfJoiningStcWtcNonRailway || ""}
            onChange={(e) => onChange("dateOfJoiningStcWtcNonRailway", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Date of Sparing from STC */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Date of Sparing from STC</label>
          <input
            type="date"
            value={formData.dateOfSparing || ""}
            onChange={(e) => onChange("dateOfSparing", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Module Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Module Number</label>
          <input
            type="text"
            value={formData.moduleNo || ""}
            onChange={(e) => onChange("moduleNo", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter module number"
          />
        </div>

        {/* Course Duration */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Course Duration</label>
          <input
            type="text"
            value={formData.courseDuration || ""}
            onChange={(e) => onChange("courseDuration", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="E.g., 3 months"
          />
        </div>

        {/* Save Button */}
        <div className="sm:col-span-2 flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-md"
          >
            💾 Save Course Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default Course;
