import React from "react";

const Personal = ({ formData, onChange, errors = {}, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full shadow text-lg">
            👤
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Personal Detail</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          {/* Picture Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Picture<span className="text-red-500">*</span></label>
            <div className="flex items-center w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
              <label
                htmlFor="pictureUpload"
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded cursor-pointer text-sm mr-4"
              >
                Choose File
              </label>
              <input
                id="pictureUpload"
                type="file"
                accept="image/*"
                onChange={(e) => onChange("picture", e.target.files[0])}
                className="hidden"
              />
              <span className="text-gray-500 text-sm truncate">
                {formData.picture ? formData.picture.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter full name"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.sex || ""}
              onChange={(e) => onChange("sex", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fatherName || ""}
              onChange={(e) => onChange("fatherName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter father's name"
            />
          </div>

          {/* Mother's Name (Optional) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mother's Name</label>
            <input
              type="text"
              value={formData.motherName || ""}
              onChange={(e) => onChange("motherName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter mother's name"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dob || ""}
              onChange={(e) => onChange("dob", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category || ""}
              onChange={(e) => onChange("category", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select category</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          {/* PWD (Yes/No) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              PWD (Yes/No) <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.pwd || ""}
              onChange={(e) => onChange("pwd", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Type of Disability */}
          {formData.pwd === "Yes" && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Type of Disability</label>
              <input
                type="text"
                value={formData.typeOfDisability || ""}
                onChange={(e) => onChange("typeOfDisability", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Specify disability"
              />
            </div>
          )}

          {/* Nationality (default Indian) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nationality || "Indian"}
              onChange={(e) => onChange("nationality", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter nationality"
            />
          </div>

          {/* Marital Status (Optional) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Marital Status</label>
            <select
              value={formData.maritalStatus || ""}
              onChange={(e) => onChange("maritalStatus", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Personal;
