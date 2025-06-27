import React, { useState } from 'react';

const Personal = () => {
  const [formData, setFormData] = useState({
    picture: null,
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    category: '',
    pwd: '',
    disabilityType: '',
    nationality: '',
    maritalStatus: '',
    phoneNo: '',
    email: '',
    emergencyContact: '',
    permanentAddress: '',
    currentAddress: '',
    gender: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categoryOptions = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'];
  const disabilityTypes = ['Visual Impairment', 'Hearing Impairment', 'Locomotor Disability', 'Intellectual Disability', 'Multiple Disabilities', 'Other'];
  const nationalityOptions = ['Indian', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  const genderOptions = ['Male', 'Female', 'Other'];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'fatherName', 'motherName', 'dob', 'category', 'nationality', 'maritalStatus', 'phoneNo', 'email', 'permanentAddress', 'currentAddress', 'gender'];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phoneNo && !phoneRegex.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Enter valid 10-digit phone number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Enter valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/personal-details', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Personal details submitted successfully!');
        console.log('Success:', await response.json());
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyPermanentAddress = () => {
    setFormData(prev => ({ ...prev, currentAddress: prev.permanentAddress }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8 border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Personal Details</h2>
        <p className="text-gray-600">Please fill in all required information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Picture Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Picture <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="picture"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          />
          {errors.picture && <p className="text-red-500 text-xs mt-1">{errors.picture}</p>}
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.dob ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
              placeholder="Enter father's name"
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.fatherName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mother's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleInputChange}
              placeholder="Enter mother's name"
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.motherName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {errors.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName}</p>}
          </div>
        </div>

        {/* Category and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            {formData.category === 'Other' ? (
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Please specify category"
                className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.category ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
              />
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.category ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
              >
                <option value="">Select Category</option>
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
            {formData.category !== 'Other' && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: 'Other' }))}
                className="text-blue-500 text-sm mt-1 hover:underline"
              >
                Other (Click to specify)
              </button>
            )}
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.gender ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            >
              <option value="">Select Gender</option>
              {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
        </div>

        {/* PWD Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Person with Disability (PWD)
            </label>
            <select
              name="pwd"
              value={formData.pwd}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData.pwd === 'Yes' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type of Disability
              </label>
              {formData.disabilityType === 'Other' ? (
                <input
                  type="text"
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleInputChange}
                  placeholder="Please specify disability type"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              ) : (
                <select
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select Disability Type</option>
                  {disabilityTypes.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {formData.disabilityType !== 'Other' && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, disabilityType: 'Other' }))}
                  className="text-blue-500 text-sm mt-1 hover:underline"
                >
                  Other (Click to specify)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Nationality and Marital Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nationality <span className="text-red-500">*</span>
            </label>
            {formData.nationality === 'Other' ? (
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="Please specify nationality"
                className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.nationality ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
              />
            ) : (
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.nationality ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
              >
                <option value="">Select Nationality</option>
                {nationalityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
            {formData.nationality !== 'Other' && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, nationality: 'Other' }))}
                className="text-blue-500 text-sm mt-1 hover:underline"
              >
                Other (Click to specify)
              </button>
            )}
            {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Marital Status <span className="text-red-500">*</span>
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.maritalStatus ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            >
              <option value="">Select Marital Status</option>
              {maritalStatusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.maritalStatus && <p className="text-red-500 text-xs mt-1">{errors.maritalStatus}</p>}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone No. (WhatsApp) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleInputChange}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.phoneNo ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {errors.phoneNo && <p className="text-red-500 text-xs mt-1">{errors.phoneNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Emergency Contact
          </label>
          <input
            type="tel"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder="Enter emergency contact number"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Address Information */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Permanent Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleInputChange}
            placeholder="Enter complete permanent address"
            rows="3"
            className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${errors.permanentAddress ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
          />
          {errors.permanentAddress && <p className="text-red-500 text-xs mt-1">{errors.permanentAddress}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Address <span className="text-red-500">*</span>
            <button
              type="button"
              onClick={copyPermanentAddress}
              className="ml-3 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Same as Permanent
            </button>
          </label>
          <textarea
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleInputChange}
            placeholder="Enter complete current address"
            rows="3"
            className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${errors.currentAddress ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
          />
          {errors.currentAddress && <p className="text-red-500 text-xs mt-1">{errors.currentAddress}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-1'
              }`}
          >
            {loading ? 'Submitting...' : 'Submit Personal Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Personal;
