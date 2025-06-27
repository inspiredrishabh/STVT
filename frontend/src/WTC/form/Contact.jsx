import React from "react";

const Contact = ({ formData, onChange }) => {
  const handleCopyAddress = () => {
    onChange("permanentAddress", formData.currentAddress || "");
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full shadow text-lg">
          📞
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Contact Detail</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {/* Current Address */}
        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Current Address</label>
          <textarea
            rows="3"
            value={formData.currentAddress || ""}
            onChange={(e) => onChange("currentAddress", e.target.value)}
            placeholder="Enter current address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Copy Button */}
        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm text-gray-800"
          >
            Copy Current Address to Permanent
          </button>
        </div>

        {/* Permanent Address */}
        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Permanent Address</label>
          <textarea
            rows="3"
            value={formData.permanentAddress || ""}
            onChange={(e) => onChange("permanentAddress", e.target.value)}
            placeholder="Enter permanent address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone Number (WhatsApp)</label>
          <input
            type="tel"
            value={formData.phoneNumber || ""}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter WhatsApp number"
          />
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Emergency Contact Number</label>
          <input
            type="tel"
            value={formData.emergencyContactNumber || ""}
            onChange={(e) => onChange("emergencyContactNumber", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter emergency number"
          />
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter email"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
