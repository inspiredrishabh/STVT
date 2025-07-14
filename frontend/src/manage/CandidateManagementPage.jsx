import React, { useState, useMemo, useEffect } from "react";
import PageHeader from "./PageHeader";
import StatsCards from "./StatsCard";
import SearchFilters from "./SearchAndFilter";
import CandidateTable from "./CandidateTable";
import DeleteModal from "./DeleteModal";
import DetailModal from "./DetailModal";
import ActivityPanel from "./ActivityPanel";
// import CandidateForm from '../form/Components/StcCandidateForm';

// Real Backend API - Connects to actual REST endpoints
class RealBackendAPI {
  constructor() {
    this.baseURL = "/api";
    // Course structure mapping for course-specific candidates
    this.courseStructure = {
      "MSE-C&W": "mse-c&w",
      "MSE-D": "mse-d",
      "MSE-W": "mse-w",
      "MJR-C&W": "mjr-c&w",
      "MJR-D": "mjr-d",
      "MJR-W": "mjr-w",
      "MJI-C&W": "mji-c&w",
      "MJI-D": "mji-d",
      "MJI-W": "mji-w",
      "MJP-C&W": "mjp-c&w",
      "MJP-D": "mjp-d",
      "MJP-W": "mjp-w",
    };
  }

  // Helper method to determine the correct API endpoint for a candidate
  getCandidateEndpoint(candidate) {
    const { type, workInfo } = candidate;
    // Get ticket number from multiple possible field names, with type-specific preferences
    let ticketNo;

    if (type === "WTC") {
      // WTC prefers ticketNumber (camelCase)
      ticketNo =
        candidate.ticketNumber || candidate.ticketNo || candidate.ticket_no;
    } else {
      // STC and Non-Railway prefer ticket_no (snake_case)
      ticketNo =
        candidate.ticket_no || candidate.ticketNumber || candidate.ticketNo;
    }

    // Check if ticket number is available
    if (!ticketNo) {
      console.error("Ticket number is undefined for candidate:", candidate);
      throw new Error(
        `Ticket number is undefined for candidate ${candidate.name || candidate.id
        }`
      );
    }

    // Check if this is a course-specific candidate
    if (type === "STC" && workInfo && this.courseStructure[workInfo]) {
      const endpoint = `${this.baseURL}/${this.courseStructure[workInfo]}/${ticketNo}`;
      return endpoint;
    }

    // Default endpoints for basic candidates
    const endpoints = {
      STC: `${this.baseURL}/stc/${ticketNo}`,
      WTC: `${this.baseURL}/wtc/${ticketNo}`,
      "Non Railway": `${this.baseURL}/nonrailway/${ticketNo}`,
    };

    const endpoint = endpoints[type] || endpoints["STC"];
    return endpoint;
  }

  // Helper method to transform frontend camelCase fields to backend snake_case fields
  // transformFieldsForBackend(candidateData) {
  //   // Common field mappings that apply to all candidate types
  //   const commonFieldMapping = {
  //     // Personal Information
  //     fatherName: 'father_name',
  //     motherName: 'mother_name',
  //     phoneNumber: 'phone_number',
  //     emergencyContactNumber: 'emergency_contact_number',
  //     permanentAddress: 'permanent_address',
  //     currentAddress: 'current_address',

  //     // Contact Information
  //     email: 'email',

  //     // Professional Information (common)
  //     employeeNumber: 'employee_number',
  //     ticketNumber: 'ticket_no',
  //     workingUnder: 'working_under',
  //     hrmsId: 'hrms_id',
  //     pfNoNpsUps: 'pf_no_nps_ups',
  //     dateOfAppointmentInRailway: 'date_of_appointment_in_railway',
  //     modeOfAppointment: 'mode_of_appointment',

  //     // Educational Information
  //     highestQualification: 'highest_qualification',
  //     fieldOfStudy: 'field_of_study',
  //     gradeType: 'grade_type',
  //     gradeValue: 'grade_value',

  //     // Course Information (common)
  //     dateOfSparing: 'date_of_sparing',
  //     dateOfJoiningStcWtcNonRailway: 'date_of_joining_stc_wtc_non_railway',

  //     // Additional fields
  //     typeOfDisability: 'type_of_disability',
  //     resignationStatus: 'resignation_status'
  //   };

  //   // STC-specific field mappings
  //   const stcFieldMapping = {
  //     ...commonFieldMapping,
  //     // STC specific fields
  //     moduleNo: 'module_no',
  //     moduleName: 'module_name',
  //     courseDuration: 'course_duration',
  //     stationCode: 'station_code'
  //   };

  //   // WTC-specific field mappings (WTC uses camelCase in backend, so no transformation needed for most fields)
  //   const wtcFieldMapping = {
  //     // Transform only the common fields that need snake_case conversion
  //     fatherName: 'fatherName', // Keep camelCase for WTC
  //     motherName: 'motherName', // Keep camelCase for WTC
  //     phoneNumber: 'phoneNumber', // Keep camelCase for WTC
  //     emergencyContactNumber: 'emergencyContactNumber', // Keep camelCase for WTC
  //     permanentAddress: 'permanentAddress', // Keep camelCase for WTC
  //     currentAddress: 'currentAddress', // Keep camelCase for WTC

  //     // Professional Information (WTC uses camelCase)
  //     employeeNumber: 'employeeNumber',
  //     ticketNumber: 'ticketNumber', // WTC uses ticketNumber (camelCase) not ticket_no
  //     workingUnder: 'workingUnder',
  //     hrmsId: 'hrmsId',
  //     pfNoNpsUps: 'pfNoNpsUps',
  //     dateOfAppointmentInRailway: 'dateOfAppointmentInRailway',
  //     modeOfAppointment: 'modeOfAppointment',

  //     // Educational Information (WTC uses camelCase)
  //     highestQualification: 'highestQualification',
  //     fieldOfStudy: 'fieldOfStudy',
  //     gradeType: 'gradeType',
  //     gradeValue: 'gradeValue',

  //     // Course Information (WTC uses camelCase)
  //     dateOfSparing: 'dateOfSparing',
  //     dateOfJoiningStcWtcNonRailway: 'dateOfJoiningStcWtcNonRailway',

  //     // WTC specific fields (all camelCase)
  //     courseType: 'courseType',
  //     designationOther: 'designationOther',
  //     trainingPeriod: 'trainingPeriod',
  //     customTrainingPeriod: 'customTrainingPeriod',
  //     theoryDuration: 'theoryDuration',
  //     customTheoryDuration: 'customTheoryDuration',
  //     practicalDuration: 'practicalDuration',
  //     customPracticalDuration: 'customPracticalDuration',
  //     customFieldOfStudy: 'customFieldOfStudy',
  //     courseCoordinator: 'courseCoordinator',

  //     // Additional fields (WTC uses camelCase)
  //     typeOfDisability: 'typeOfDisability',
  //     resignationStatus: 'resignationStatus'
  //   };

  //   // Non-Railway specific field mappings
  //   const nonRailwayFieldMapping = {
  //     ...commonFieldMapping,
  //     // Non-Railway specific fields (uses snake_case like STC)
  //     courseType: 'course_type',
  //     duration: 'duration',
  //     theory: 'theory',
  //     practical: 'practical',
  //     remarks: 'remarks',
  //     moduleNo: 'module_no',
  //     courseCoordinator: 'course_coordinator',
  //     // Additional Non-Railway fields (some stay as-is, some transform)
  //     unit: 'unit',
  //     institution: 'institution',
  //     nationality: 'nationality',
  //     pwd: 'pwd',
  //     designation: 'designation',
  //     batch: 'batch'
  //   };

  //   // Determine which field mapping to use based on candidate type
  //   let fieldMapping = commonFieldMapping;
  //   const candidateType = candidateData.type;

  //   if (candidateType === 'STC') {
  //     fieldMapping = stcFieldMapping;
  //   } else if (candidateType === 'WTC') {
  //     fieldMapping = wtcFieldMapping;
  //   } else if (candidateType === 'Non Railway') {
  //     fieldMapping = nonRailwayFieldMapping;
  //   }

  //   console.log(`Using field mapping for candidate type: ${candidateType}`);
  //   console.log('Field mapping being used:', candidateType === 'STC' ? 'STC (snake_case)' : candidateType === 'WTC' ? 'WTC (camelCase)' : candidateType === 'Non Railway' ? 'Non Railway (snake_case)' : 'Common');

  //   const transformedData = {};

  //   // Transform fields that have mappings
  //   Object.keys(candidateData).forEach(key => {
  //     const backendKey = fieldMapping[key] || key;
  //     // Only include fields that are not undefined or null
  //     if (candidateData[key] !== undefined && candidateData[key] !== null) {
  //       transformedData[backendKey] = candidateData[key];
  //     }
  //   });

  //   console.log(`Transformed ${Object.keys(candidateData).length} frontend fields to ${Object.keys(transformedData).length} backend fields for ${candidateType}`);
  //   if (candidateType === 'WTC') {
  //     console.log('WTC transformation details:');
  //     console.log('Original data keys:', Object.keys(candidateData));
  //     console.log('Transformed data keys:', Object.keys(transformedData));
  //     console.log('Sample transformed fields:', Object.fromEntries(Object.entries(transformedData).slice(0, 10)));
  //   }
  //   if (candidateType === 'Non Railway') {
  //     console.log('Non Railway transformation details:');
  //     console.log('Original data keys:', Object.keys(candidateData));
  //     console.log('Transformed data keys:', Object.keys(transformedData));
  //     console.log('Sample transformed fields:', Object.fromEntries(Object.entries(transformedData).slice(0, 10)));
  //   }

  //   return transformedData;
  // }

  // Update in RealBackendAPI class:

  // Helper method to transform frontend camelCase fields to backend snake_case fields

  transformFieldsForBackend(candidateData) {
    const transformed = { ...candidateData };

    // Common field mappings that apply to all candidate types
    const commonMappings = {
      // Personal Info
      fatherName: "father_name",
      motherName: "mother_name",
      phoneNumber: "phone_number",
      emergencyContactNumber: "emergency_contact_number",
      permanentAddress: "permanent_address",
      currentAddress: "current_address",
      typeOfDisability: "type_of_disability",

      // Professional Info
      ticketNumber: "ticket_no",
      dateOfJoiningStcWtcNonRailway: "date_of_joining_stc_wtc_non_railway",
      dateOfSparing: "date_of_sparing",
      workingUnder: "working_under",

      // Education
      highestQualification: "highest_qualification",
      fieldOfStudy: "field_of_study",
      gradeType: "grade_type",
      gradeValue: "grade_value",
    };

    // Type-specific mappings
    if (candidateData.type === "Non Railway") {
      commonMappings.courseType = "course_type";
      commonMappings.moduleNo = "module_no";
      commonMappings.courseCoordinator = "course_coordinator";
      // For Non-Railway, workInfo maps to designation
      commonMappings.workInfo = "designation";
    } else if (candidateData.type === "STC") {
      commonMappings.hrmsId = "hrms_id";
      commonMappings.pfNoNpsUps = "pf_no_nps_ups";
      commonMappings.employeeNumber = "employee_number";
      commonMappings.dateOfAppointmentInRailway =
        "date_of_appointment_in_railway";
      commonMappings.modeOfAppointment = "mode_of_appointment";
      commonMappings.moduleNo = "module_no";
      commonMappings.courseDuration = "course_duration";
      commonMappings.stationCode = "station_code";
      commonMappings.resignationStatus = "resignation_status";
      commonMappings.workInfo = "designation";
    } else if (candidateData.type === "WTC") {
      commonMappings.hrmsId = "hrms_id";
      commonMappings.pfNoNpsUps = "pf_no_nps_ups";
      commonMappings.employeeNumber = "employee_number";
      commonMappings.dateOfAppointmentInRailway =
        "date_of_appointment_in_railway";
      commonMappings.modeOfAppointment = "mode_of_appointment";
      commonMappings.courseType = "course_type";
      commonMappings.workInfo = "designation";
    }

    // Apply transformations
    Object.keys(commonMappings).forEach((frontendField) => {
      if (transformed[frontendField] !== undefined) {
        transformed[commonMappings[frontendField]] = transformed[frontendField];
        delete transformed[frontendField];
      }
    });

    return transformed;
  }

  // Helper method to transform backend response back to frontend camelCase format
  // transformBackendResponseToFrontend(backendData, candidateType) {
  //   // Reverse field mappings - from snake_case to camelCase
  //   const commonReverseMapping = {
  //     // Personal Information
  //     father_name: "fatherName",
  //     mother_name: "motherName",
  //     phone_number: "phoneNumber",
  //     emergency_contact_number: "emergencyContactNumber",
  //     permanent_address: "permanentAddress",
  //     current_address: "currentAddress",

  //     // Professional Information (common)
  //     employee_number: "employeeNumber",
  //     ticket_no: "ticketNumber",
  //     working_under: "workingUnder",
  //     hrms_id: "hrmsId",
  //     pf_no_nps_ups: "pfNoNpsUps",
  //     date_of_appointment_in_railway: "dateOfAppointmentInRailway",
  //     mode_of_appointment: "modeOfAppointment",

  //     // Educational Information
  //     highest_qualification: "highestQualification",
  //     field_of_study: "fieldOfStudy",
  //     grade_type: "gradeType",
  //     grade_value: "gradeValue",

  //     // Course Information (common)
  //     date_of_sparing: "dateOfSparing",
  //     date_of_joining_stc_wtc_non_railway: "dateOfJoiningStcWtcNonRailway",

  //     // Additional fields
  //     type_of_disability: "typeOfDisability",
  //     resignation_status: "resignationStatus",
  //   };

  //   // STC-specific reverse mappings
  //   const stcReverseMapping = {
  //     ...commonReverseMapping,
  //     module_no: "moduleNo",
  //     module_name: "moduleName",
  //     course_duration: "courseDuration",
  //     station_code: "stationCode",
  //   };

  //   // WTC-specific reverse mappings (WTC uses camelCase in backend, so most fields don't need transformation)
  //   const wtcReverseMapping = {
  //     // Only transform fields that might come as snake_case from backend
  //     father_name: "fatherName",
  //     mother_name: "motherName",
  //     phone_number: "phoneNumber",
  //     emergency_contact_number: "emergencyContactNumber",
  //     permanent_address: "permanentAddress",
  //     current_address: "currentAddress",
  //     employee_number: "employeeNumber",
  //     ticket_no: "ticketNumber",
  //     working_under: "workingUnder",
  //     hrms_id: "hrmsId",
  //     pf_no_nps_ups: "pfNoNpsUps",
  //     date_of_appointment_in_railway: "dateOfAppointmentInRailway",
  //     mode_of_appointment: "modeOfAppointment",
  //     highest_qualification: "highestQualification",
  //     field_of_study: "fieldOfStudy",
  //     grade_type: "gradeType",
  //     grade_value: "gradeValue",
  //     date_of_sparing: "dateOfSparing",
  //     date_of_joining_stc_wtc_non_railway: "dateOfJoiningStcWtcNonRailway",
  //     type_of_disability: "typeOfDisability",
  //     resignation_status: "resignationStatus",

  //     // WTC fields that are already camelCase in backend (pass through)
  //     courseType: "courseType",
  //     designationOther: "designationOther",
  //     trainingPeriod: "trainingPeriod",
  //     customTrainingPeriod: "customTrainingPeriod",
  //     theoryDuration: "theoryDuration",
  //     customTheoryDuration: "customTheoryDuration",
  //     practicalDuration: "practicalDuration",
  //     customPracticalDuration: "customPracticalDuration",
  //     customFieldOfStudy: "customFieldOfStudy",
  //     courseCoordinator: "courseCoordinator",

  //     // Common fields that are already camelCase
  //     fatherName: "fatherName",
  //     motherName: "motherName",
  //     phoneNumber: "phoneNumber",
  //     emergencyContactNumber: "emergencyContactNumber",
  //     permanentAddress: "permanentAddress",
  //     currentAddress: "currentAddress",
  //     employeeNumber: "employeeNumber",
  //     ticketNumber: "ticketNumber",
  //     workingUnder: "workingUnder",
  //     hrmsId: "hrmsId",
  //     pfNoNpsUps: "pfNoNpsUps",
  //     dateOfAppointmentInRailway: "dateOfAppointmentInRailway",
  //     modeOfAppointment: "modeOfAppointment",
  //     highestQualification: "highestQualification",
  //     fieldOfStudy: "fieldOfStudy",
  //     gradeType: "gradeType",
  //     gradeValue: "gradeValue",
  //     dateOfSparing: "dateOfSparing",
  //     dateOfJoiningStcWtcNonRailway: "dateOfJoiningStcWtcNonRailway",
  //     typeOfDisability: "typeOfDisability",
  //     resignationStatus: "resignationStatus",
  //   };

  //   // Non-Railway specific reverse mappings
  //   const nonRailwayReverseMapping = {
  //     ...commonReverseMapping,
  //     // Non-Railway specific fields (from snake_case to camelCase)
  //     course_type: "courseType",
  //     module_no: "moduleNo",
  //     course_coordinator: "courseCoordinator",
  //     // Keep fields that are already correct (no transformation needed)
  //     duration: "duration",
  //     theory: "theory",
  //     practical: "practical",
  //     remarks: "remarks",
  //     unit: "unit",
  //     institution: "institution",
  //     nationality: "nationality",
  //     pwd: "pwd",
  //     // Additional common fields that might come as snake_case
  //     batch: "batch",
  //     designation: "designation",
  //   };

  //   // Determine which reverse mapping to use
  //   let reverseMapping = commonReverseMapping;
  //   if (candidateType === "STC") {
  //     reverseMapping = stcReverseMapping;
  //   } else if (candidateType === "WTC") {
  //     reverseMapping = wtcReverseMapping;
  //   } else if (candidateType === "Non Railway") {
  //     reverseMapping = nonRailwayReverseMapping;
  //   }

  //   const transformedData = {};

  //   // Transform fields that have reverse mappings
  //   Object.keys(backendData).forEach((key) => {
  //     const frontendKey = reverseMapping[key] || key;
  //     // Only include fields that are not undefined or null
  //     if (backendData[key] !== undefined && backendData[key] !== null) {
  //       transformedData[frontendKey] = backendData[key];
  //     }
  //   });

  //   console.log(
  //     `Transformed ${Object.keys(backendData).length} backend fields to ${
  //       Object.keys(transformedData).length
  //     } frontend fields for type: ${candidateType}`
  //   );

  //   if (candidateType === "WTC") {
  //     console.log("WTC reverse transformation details:");
  //     console.log("Backend data keys:", Object.keys(backendData));
  //     console.log("Frontend data keys:", Object.keys(transformedData));
  //     console.log(
  //       "Sample reverse transformed fields:",
  //       Object.fromEntries(Object.entries(transformedData).slice(0, 10))
  //     );
  //   }

  //   if (candidateType === "Non Railway") {
  //     console.log("Non Railway reverse transformation details:");
  //     console.log("Backend data keys:", Object.keys(backendData));
  //     console.log("Frontend data keys:", Object.keys(transformedData));
  //     console.log(
  //       "Sample reverse transformed fields:",
  //       Object.fromEntries(Object.entries(transformedData).slice(0, 10))
  //     );
  //   }

  //   return transformedData;
  // }
  // Add this method to the RealBackendAPI class:

  // Helper method to transform backend response back to frontend camelCase format
  transformBackendResponseToFrontend(backendData, candidateType) {
    if (!backendData) return backendData;

    const commonTransformations = {
      // Personal Info
      father_name: "fatherName",
      mother_name: "motherName",
      phone_number: "phoneNumber",
      emergency_contact_number: "emergencyContactNumber",
      permanent_address: "permanentAddress",
      current_address: "currentAddress",
      type_of_disability: "typeOfDisability",

      // Professional Info
      ticket_no: "ticketNumber",
      date_of_joining_stc_wtc_non_railway: "dateOfJoiningStcWtcNonRailway",
      date_of_sparing: "dateOfSparing",
      working_under: "workingUnder",

      // Education
      highest_qualification: "highestQualification",
      field_of_study: "fieldOfStudy",
      grade_type: "gradeType",
      grade_value: "gradeValue",

      // System fields
      created_at: "createdAt",
      updated_at: "updatedAt",
    };

    // Non-Railway specific transformations
    if (candidateType === "Non Railway") {
      commonTransformations.course_type = "courseType";
      commonTransformations.module_no = "moduleNo";
      commonTransformations.course_coordinator = "courseCoordinator";
      // For Non-Railway, designation maps to workInfo for consistency
      commonTransformations.designation = "workInfo";
    }

    // STC specific transformations
    if (candidateType === "STC") {
      commonTransformations.hrms_id = "hrmsId";
      commonTransformations.pf_no_nps_ups = "pfNoNpsUps";
      commonTransformations.employee_number = "employeeNumber";
      commonTransformations.date_of_appointment_in_railway =
        "dateOfAppointmentInRailway";
      commonTransformations.mode_of_appointment = "modeOfAppointment";
      commonTransformations.module_no = "moduleNo";
      commonTransformations.course_duration = "courseDuration";
      commonTransformations.station_code = "stationCode";
      commonTransformations.resignation_status = "resignationStatus";
      commonTransformations.designation = "workInfo";
    }

    // WTC specific transformations
    if (candidateType === "WTC") {
      commonTransformations.hrms_id = "hrmsId";
      commonTransformations.pf_no_nps_ups = "pfNoNpsUps";
      commonTransformations.employee_number = "employeeNumber";
      commonTransformations.date_of_appointment_in_railway =
        "dateOfAppointmentInRailway";
      commonTransformations.mode_of_appointment = "modeOfAppointment";
      commonTransformations.course_type = "courseType";
      commonTransformations.designation = "workInfo";
    }

    const transformed = { ...backendData };

    // Apply transformations
    Object.keys(commonTransformations).forEach((backendField) => {
      if (transformed[backendField] !== undefined) {
        transformed[commonTransformations[backendField]] =
          transformed[backendField];
        delete transformed[backendField];
      }
    });

    // Ensure consistent field names
    if (candidateType === "Non Railway") {
      transformed.type = "Non Railway";
      transformed.category = "Non Railway";
      transformed.stream = "Non Railway";
    } else if (candidateType === "STC") {
      transformed.type = "STC";
      transformed.category = "Railway";
      transformed.stream = "Railway";
    } else if (candidateType === "WTC") {
      transformed.type = "WTC";
      transformed.category = "Railway";
      transformed.stream = "Railway";
    }

    return transformed;
  }
  // Helper method to get candidate details by ticket number
  async getCandidateByTicket(candidate) {
    try {
      const endpoint = this.getCandidateEndpoint(candidate);
      const response = await fetch(endpoint);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      throw error;
    }
  }

  // Fetch all STC candidates
  async getStcCandidates() {
    try {
      const response = await fetch(`${this.baseURL}/stc`);
      const data = await response.json();
      if (data.success) {
        return data.data.map((candidate) => {
          return {
            ...candidate,
            id: `stc-${candidate.id}`, // Make ID unique across types
            originalId: candidate.id,
            type: "STC",
            category: "Railway",
            stream: "Railway",
            workInfo: candidate.designation || "N/A",
            ticketNumber:
              candidate.ticket_no ||
              candidate.ticketNumber ||
              `STC${candidate.id}`, // Multiple fallbacks
            ticket_no:
              candidate.ticket_no ||
              candidate.ticketNumber ||
              `STC${candidate.id}`, // Ensure ticket_no is also set
            serialNo: candidate.id + 1000,
            batch: candidate.batch || "2024-2025",
            status:
              candidate.resignation_status === "yes" ? "Resigned" : "Active",
            phoneNumber: candidate.phone_number || "N/A",
            // Personal Information
            fatherName: candidate.father_name,
            motherName: candidate.mother_name,
            sex: candidate.sex,
            dob: candidate.dob,
            // Contact Information
            email: candidate.email,
            emergencyContactNumber: candidate.emergency_contact_number,
            permanentAddress: candidate.permanent_address,
            currentAddress: candidate.current_address,
            // Professional Information
            designation: candidate.designation,
            unit: candidate.unit,
            workingUnder: candidate.working_under,
            hrmsId: candidate.hrms_id,
            pfNoNpsUps: candidate.pf_no_nps_ups,
            employeeNumber: candidate.employee_number,
            stationCode: candidate.station_code,
            dateOfAppointmentInRailway:
              candidate.date_of_appointment_in_railway,
            modeOfAppointment: candidate.mode_of_appointment,
            // Educational Information
            highestQualification: candidate.highest_qualification,
            fieldOfStudy: candidate.field_of_study,
            institution: candidate.institution,
            gradeType: candidate.grade_type,
            gradeValue: candidate.grade_value,
            // Course Information
            moduleNo: candidate.module_no,
            moduleName: candidate.module_name,
            courseDuration: candidate.course_duration,
            dateOfSparing: candidate.date_of_sparing,
            // Additional fields
            nationality: candidate.nationality,
            // category: candidate.category,
            pwd: candidate.pwd,
            typeOfDisability: candidate.type_of_disability,
            dateOfJoiningStcWtcNonRailway:
              candidate.date_of_joining_stc_wtc_non_railway ||
              candidate.created_at,
            createdAt: candidate.created_at,
            updatedAt: candidate.updated_at,
            picture: candidate.picture ? `${candidate.picture}` : null,
          };
        });
      }
      return [];
    } catch (error) {
      console.error("Error fetching STC candidates:", error);
      return [];
    }
  }

  // Fetch all WTC candidates
  async getWtcCandidates() {
    try {
      const response = await fetch(`${this.baseURL}/wtc`);
      const data = await response.json();
      if (data.success) {
        return data.data.map((candidate) => {

          // Get ticket number from any available field
          const ticketNumber =
            candidate.ticket_no ||
            candidate.ticketNo ||
            candidate.ticketNumber ||
            `WTC${candidate.id}`;

          return {
            ...candidate,
            id: `wtc-${candidate.id}`, // Make ID unique across types
            originalId: candidate.id,
            type: "WTC",
            category: "Railway",
            stream: "Railway",
            workInfo: candidate.designation || "N/A",
            ticketNumber: ticketNumber, // Ensure ticketNumber is set
            ticket_no: ticketNumber, // Ensure ticket_no is also set
            ticketNo: ticketNumber, // Ensure ticketNo is also set for consistency
            serialNo: candidate.id + 2000,
            batch: candidate.batch || "2024-2025",
            status: "Active",
            phoneNumber: candidate.phoneNumber || "N/A",
            // Personal Information
            fatherName: candidate.fatherName,
            motherName: candidate.motherName,
            sex: candidate.sex,
            dob: candidate.dob,
            // Contact Information
            email: candidate.email,
            emergencyContactNumber: candidate.emergencyContactNumber,
            permanentAddress: candidate.permanentAddress,
            currentAddress: candidate.currentAddress,
            // Professional Information
            designation: candidate.designation,
            designationOther: candidate.designationOther,
            unit: candidate.unit,
            workingUnder: candidate.workingUnder,
            hrmsId: candidate.hrmsId,
            pfNoNpsUps: candidate.pfNoNpsUps,
            employeeNumber: candidate.employeeNumber,
            dateOfAppointmentInRailway: candidate.dateOfAppointmentInRailway,
            modeOfAppointment: candidate.modeOfAppointment,
            // Educational Information
            highestQualification: candidate.highestQualification,
            fieldOfStudy: candidate.fieldOfStudy,
            customFieldOfStudy: candidate.customFieldOfStudy,
            institution: candidate.institution,
            gradeType: candidate.gradeType,
            gradeValue: candidate.gradeValue,
            // Course Information (WTC-specific)
            courseType: candidate.courseType,
            trainingPeriod: candidate.trainingPeriod,
            customTrainingPeriod: candidate.customTrainingPeriod,
            theoryDuration: candidate.theoryDuration,
            customTheoryDuration: candidate.customTheoryDuration,
            practicalDuration: candidate.practicalDuration,
            customPracticalDuration: candidate.customPracticalDuration,
            dateOfSparing: candidate.dateOfSparing,
            courseCoordinator: candidate.courseCoordinator,
            // Additional fields
            nationality: candidate.nationality,
            // category: candidate.category,
            pwd: candidate.pwd,
            typeOfDisability: candidate.typeOfDisability,
            dateOfJoiningStcWtcNonRailway:
              candidate.dateOfJoiningStcWtcNonRailway || candidate.createdAt,
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt,
            picture: candidate.picture ? `${candidate.picture}` : null,
          };
        });
      }
      return [];
    } catch (error) {
      console.error("Error fetching WTC candidates:", error);
      return [];
    }
  }

  // Fetch all Non-Railway candidates
  // async getNonRailwayCandidates() {
  //   try {
  //     const response = await fetch(`${this.baseURL}/nonrailway`);
  //     const data = await response.json();
  //     if (data.success) {
  //       return data.data.map((candidate) => {
  //         console.log("Non-Railway Candidate raw data:", candidate); // Debug logging
  //         return {
  //           ...candidate,
  //           id: `nonrailway-${candidate.id}`, // Make ID unique across types
  //           originalId: candidate.id,
  //           type: "Non Railway",
  //           category: "Non Railway",
  //           stream: "Non Railway",
  //           workInfo: candidate.designation || "N/A",
  //           ticketNumber:
  //             candidate.ticket_no ||
  //             candidate.ticketNumber ||
  //             `NR${candidate.id}`, // Multiple fallbacks
  //           ticket_no:
  //             candidate.ticket_no ||
  //             candidate.ticketNumber ||
  //             `NR${candidate.id}`, // Ensure ticket_no is also set
  //           serialNo: candidate.id + 3000,
  //           batch: candidate.batch || "2024-2025",
  //           status: "Active",
  //           phoneNumber: candidate.phone_number || "N/A",
  //           // Personal Information
  //           fatherName: candidate.father_name,
  //           motherName: candidate.mother_name,
  //           sex: candidate.sex,
  //           dob: candidate.dob,
  //           // Contact Information
  //           email: candidate.email,
  //           emergencyContactNumber: candidate.emergency_contact_number,
  //           permanentAddress: candidate.permanent_address,
  //           currentAddress: candidate.current_address,
  //           // Professional Information (Non-Railway specific)
  //           designation: candidate.designation,
  //           unit: candidate.unit,
  //           workingUnder: candidate.working_under,
  //           remarks: candidate.remarks,
  //           // Educational Information
  //           highestQualification: candidate.highest_qualification,
  //           fieldOfStudy: candidate.field_of_study,
  //           institution: candidate.institution,
  //           gradeType: candidate.grade_type,
  //           gradeValue: candidate.grade_value,
  //           // Course Information (Non-Railway specific)
  //           courseType: candidate.course_type,
  //           duration: candidate.duration,
  //           theory: candidate.theory,
  //           practical: candidate.practical,
  //           moduleNo: candidate.module_no,
  //           dateOfSparing: candidate.date_of_sparing,
  //           courseCoordinator: candidate.course_coordinator,
  //           // Additional fields
  //           nationality: candidate.nationality,
  //           category: candidate.category,
  //           pwd: candidate.pwd,
  //           typeOfDisability: candidate.type_of_disability,
  //           dateOfJoiningStcWtcNonRailway:
  //             candidate.date_of_joining_stc_wtc_non_railway ||
  //             candidate.created_at,
  //           createdAt: candidate.created_at,
  //           updatedAt: candidate.updated_at,
  //           picture: candidate.picture ? `/${candidate.picture}` : null,
  //         };
  //       });
  //     }
  //     return [];
  //   } catch (error) {
  //     console.error("Error fetching Non-Railway candidates:", error);
  //     return [];
  //   }
  // }
  // Update the getNonRailwayCandidates method:

  // Fetch all Non-Railway candidates
  async getNonRailwayCandidates() {
    try {
      const response = await fetch(`${this.baseURL}/nonrailway`);
      const data = await response.json();
      if (data.success) {
        return data.data.map((candidate) => {
          return {
            ...candidate,
            id: `nonrailway-${candidate.id}`, // Make ID unique across types
            originalId: candidate.id,
            type: "Non Railway",
            category: "Non Railway",
            stream: "Non Railway",
            workInfo: candidate.designation || "N/A",
            ticketNumber:
              candidate.ticket_no ||
              candidate.ticketNumber ||
              `NR${candidate.id}`, // Multiple fallbacks
            ticket_no:
              candidate.ticket_no ||
              candidate.ticketNumber ||
              `NR${candidate.id}`, // Ensure ticket_no is also set
            serialNo: candidate.id + 3000,
            batch: candidate.batch || "2024-2025",
            status: "Active",
            phoneNumber: candidate.phone_number || "N/A",
            // Personal Information
            fatherName: candidate.father_name,
            motherName: candidate.mother_name,
            sex: candidate.sex,
            dob: candidate.dob,
            // Contact Information
            email: candidate.email,
            emergencyContactNumber: candidate.emergency_contact_number,
            permanentAddress: candidate.permanent_address,
            currentAddress: candidate.current_address,
            // Professional Information (Non-Railway specific)
            designation: candidate.designation,
            unit: candidate.unit,
            workingUnder: candidate.working_under,
            remarks: candidate.remarks,
            // Educational Information
            highestQualification: candidate.highest_qualification,
            fieldOfStudy: candidate.field_of_study,
            institution: candidate.institution,
            gradeType: candidate.grade_type,
            gradeValue: candidate.grade_value,
            // Course Information (Non-Railway specific)
            courseType: candidate.course_type,
            duration: candidate.duration,
            theory: candidate.theory,
            practical: candidate.practical,
            moduleNo: candidate.module_no,
            dateOfSparing: candidate.date_of_sparing,
            courseCoordinator: candidate.course_coordinator,
            // Additional fields
            nationality: candidate.nationality,
            // category: candidate.category,
            pwd: candidate.pwd,
            typeOfDisability: candidate.type_of_disability,
            dateOfJoiningStcWtcNonRailway:
              candidate.date_of_joining_stc_wtc_non_railway ||
              candidate.created_at,
            createdAt: candidate.created_at,
            updatedAt: candidate.updated_at,
            picture: candidate.picture ? `${candidate.picture}` : null,
          };
        });
      }
      return [];
    } catch (error) {
      console.error("Error fetching Non-Railway candidates:", error);
      return [];
    }
  }

  // Fetch all candidates from all three systems
  async getAllCandidates() {
    try {
      // Fetch basic candidates
      const [stcCandidates, wtcCandidates, nonRailwayCandidates] =
        await Promise.all([
          this.getStcCandidates(),
          this.getWtcCandidates(),
          this.getNonRailwayCandidates(),
        ]);

      // Fetch course-specific candidates
      const courseSpecificCandidates = await this.getCourseSpecificCandidates();

      return [
        ...stcCandidates,
        ...wtcCandidates,
        ...nonRailwayCandidates,
        ...courseSpecificCandidates,
      ];
    } catch (error) {
      console.error("Error fetching all candidates:", error);
      return [];
    }
  }

  // Fetch candidates from course-specific tables
  async getCourseSpecificCandidates() {
    try {
      const coursePromises = Object.entries(this.courseStructure).map(
        async ([courseCode, apiPath]) => {
          try {
            const response = await fetch(`${this.baseURL}/${apiPath}`);
            const data = await response.json();
            if (data.success) {
              return data.data.map((candidate) => ({
                ...candidate,
                id: `${apiPath}-${candidate.id}`, // Unique ID for course-specific candidates
                originalId: candidate.id,
                type: "STC", // All course-specific candidates are STC type
                category: "Railway",
                stream: "Railway",
                workInfo: courseCode, // Use the course code as workInfo
                ticketNumber: candidate.ticket_no || candidate.ticketNo, // Handle both field names
                serialNo: candidate.id + 5000, // Different serial number range
                batch: candidate.batch || "2024-2025",
                status: "Active",
                phoneNumber: candidate.phone_number || "N/A",
                // Personal Information
                fatherName: candidate.father_name,
                motherName: candidate.mother_name,
                sex: candidate.sex,
                dob: candidate.dob,
                // Contact Information
                email: candidate.email,
                emergencyContactNumber: candidate.emergency_contact_number,
                permanentAddress: candidate.permanent_address,
                currentAddress: candidate.current_address,
                // Professional Information
                designation: candidate.designation,
                unit: candidate.unit,
                workingUnder: candidate.working_under,
                hrmsId: candidate.hrms_id,
                pfNoNpsUps: candidate.pf_no_nps_ups,
                employeeNumber: candidate.employee_number,
                stationCode: candidate.station_code,
                dateOfAppointmentInRailway:
                  candidate.date_of_appointment_in_railway,
                modeOfAppointment: candidate.mode_of_appointment,
                // Educational Information
                highestQualification: candidate.highest_qualification,
                fieldOfStudy: candidate.field_of_study,
                institution: candidate.institution,
                gradeType: candidate.grade_type,
                gradeValue: candidate.grade_value,
                // Course Information
                moduleNo: candidate.module_no,
                moduleName: candidate.module_name,
                courseDuration: candidate.course_duration,
                dateOfSparing: candidate.date_of_sparing,
                // Additional fields
                nationality: candidate.nationality,
                // category: candidate.category,
                pwd: candidate.pwd,
                typeOfDisability: candidate.type_of_disability,
                dateOfJoiningStcWtcNonRailway:
                  candidate.date_of_joining_stc_wtc_non_railway ||
                  candidate.created_at,
                createdAt: candidate.created_at,
                updatedAt: candidate.updated_at,
                picture: candidate.picture ? `${candidate.picture}` : null,
              }));
            }
            return [];
          } catch (error) {
            console.error(`Error fetching ${courseCode} candidates:`, error);
            return [];
          }
        }
      );

      const courseResults = await Promise.all(coursePromises);
      return courseResults.flat();
    } catch (error) {
      console.error("Error fetching course-specific candidates:", error);
      return [];
    }
  }

  // Map to match MockBackendAPI interface
  async fetchCandidates() {
    const candidates = await this.getAllCandidates();
    return { success: true, data: candidates };
  }

  // Get dropdown data for filters
  async getDropdownData() {
    try {
      const candidates = await this.getAllCandidates();

      const streams = [...new Set(candidates.map((c) => c.stream))];
      const types = [...new Set(candidates.map((c) => c.type))];
      const workInfos = [...new Set(candidates.map((c) => c.workInfo))];
      const batches = [...new Set(candidates.map((c) => c.batch))];
      const units = [...new Set(candidates.map((c) => c.unit).filter(Boolean))];

      return {
        success: true,
        data: {
          streams,
          types,
          workInfo: workInfos,
          batches,
          units,
          statuses: ["Active", "Inactive", "Pending"],
        },
      };
    } catch (error) {
      console.error("Error getting dropdown data:", error);
      return { success: false, data: null };
    }
  }

  // Delete candidate from appropriate endpoint
  async deleteCandidate(candidateId) {
    try {
      // Find candidate to determine type and ticket number
      const candidates = await this.getAllCandidates();
      const candidate = candidates.find((c) => c.id === candidateId);

      if (!candidate) {
        return { success: false, message: "Candidate not found" };
      }

      const endpoint = this.getCandidateEndpoint(candidate);

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error("Error deleting candidate:", error);
      return { success: false, message: "Failed to delete candidate" };
    }
  }

  // Placeholder for create and update (now implemented)
  async createCandidate(candidateData) {
    try {
      // Determine endpoint based on candidate type
      const { type, workInfo } = candidateData;
      let endpoint = `${this.baseURL}/stc`; // Default to STC

      if (type === "WTC") {
        endpoint = `${this.baseURL}/wtc`;
      } else if (type === "Non Railway") {
        endpoint = `${this.baseURL}/nonrailway`;
      } else if (type === "STC" && workInfo && this.courseStructure[workInfo]) {
        endpoint = `${this.baseURL}/${this.courseStructure[workInfo]}`;
      }

      // Transform frontend camelCase fields to backend snake_case fields
      const transformedData = this.transformFieldsForBackend(candidateData);

      const formData = new FormData();

      // Add all transformed candidate data to form data
      Object.keys(transformedData).forEach((key) => {
        if (
          transformedData[key] !== null &&
          transformedData[key] !== undefined
        ) {
          formData.append(key, transformedData[key]);
        }
      });

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Transform the response to match our expected format
        return {
          success: true,
          data: {
            ...data.data,
            id:
              type === "STC"
                ? `stc-${data.data.id}`
                : type === "WTC"
                  ? `wtc-${data.data.id}`
                  : `nonrailway-${data.data.id}`,
            type,
            category: type === "Non Railway" ? "Non Railway" : "Railway",
            stream: type === "Non Railway" ? "Non Railway" : "Railway",
            workInfo: data.data.designation || "N/A",
            ticketNumber: data.data.ticket_no,
            status: "Active",
          },
        };
      }

      return {
        success: false,
        message: data.message || "Failed to create candidate",
      };
    } catch (error) {
      console.error("Error creating candidate:", error);
      return { success: false, message: "Failed to create candidate" };
    }
  }

  async updateCandidate(candidateId, candidateData) {
    try {
      // Find candidate to determine endpoint
      const candidates = await this.getAllCandidates();
      const candidate = candidates.find((c) => c.id === candidateId);

      if (!candidate) {
        return { success: false, message: "Candidate not found" };
      }

      const endpoint = this.getCandidateEndpoint(candidate);

      // Transform frontend camelCase fields to backend snake_case fields
      const transformedData = this.transformFieldsForBackend(candidateData);

      const formData = new FormData();

      // Add all transformed candidate data to form data
      Object.keys(transformedData).forEach((key) => {
        if (
          transformedData[key] !== null &&
          transformedData[key] !== undefined
        ) {
          formData.append(key, transformedData[key]);
        }
      });

      const response = await fetch(endpoint, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {

        // Transform the backend response to match our expected format
        const transformedBackendData = this.transformBackendResponseToFrontend(
          data.data,
          candidate.type
        );

        const updatedCandidate = {
          // Keep all existing candidate data
          ...candidate,
          // Update with the new backend data, transforming field names properly
          ...transformedBackendData,
          // Ensure these key fields are always correct
          id: candidateId, // Keep the same ID format
          type: candidate.type,
          category: candidate.category,
          stream: candidate.stream,
          workInfo: data.data.designation || candidate.workInfo,
          // Handle ticket number properly for different candidate types
          ticketNumber:
            candidate.type === "WTC"
              ? data.data.ticketNumber ||
              data.data.ticket_no ||
              candidate.ticketNumber
              : data.data.ticket_no ||
              data.data.ticketNumber ||
              candidate.ticketNumber,
          status: candidate.status,
          // Update timestamps
          updatedAt:
            data.data.updated_at ||
            data.data.updatedAt ||
            new Date().toISOString(),
        };

        return {
          success: true,
          data: updatedCandidate,
        };
      }

      return {
        success: false,
        message: data.message || "Failed to update candidate",
      };
    } catch (error) {
      console.error("Error updating candidate:", error);
      return { success: false, message: "Failed to update candidate" };
    }
  }

  // Get statistics (mock implementation matching MockBackendAPI interface)
  async getStats(filters = {}) {
    try {
      const candidates = await this.getAllCandidates();

      // Apply filters if any
      let filteredCandidates = candidates;
      if (filters.stream && filters.stream !== "All") {
        filteredCandidates = candidates.filter(
          (c) => c.stream === filters.stream
        );
      }

      // Handle complex filter types
      if (filters.type && filters.type !== "All") {
        if (filters.type === "Railway") {
          // Filter for both STC and WTC (Railway candidates)
          filteredCandidates = filteredCandidates.filter(
            (c) => c.type === "STC" || c.type === "WTC"
          );
        } else if (filters.type === "STC") {
          filteredCandidates = filteredCandidates.filter(
            (c) => c.type === "STC"
          );
        } else if (filters.type === "WTC") {
          filteredCandidates = filteredCandidates.filter(
            (c) => c.type === "WTC"
          );
        } else if (filters.type === "Non Railway") {
          filteredCandidates = filteredCandidates.filter(
            (c) => c.type === "Non Railway"
          );
        } else if (filters.type.includes(" + ")) {
          // Handle combined types like "STC + WTC"
          const types = filters.type.split(" + ");
          filteredCandidates = filteredCandidates.filter((c) =>
            types.includes(c.type)
          );
        }
      }

      if (filters.status && filters.status !== "All") {
        filteredCandidates = filteredCandidates.filter(
          (c) => c.status === filters.status
        );
      }

      const stats = {
        totalCandidates: filteredCandidates.length,
        activeCandidates: filteredCandidates.filter(
          (c) => c.status === "Active"
        ).length,
        inactiveCandidates: filteredCandidates.filter(
          (c) => c.status === "Inactive"
        ).length,
        pendingCandidates: filteredCandidates.filter(
          (c) => c.status === "Pending"
        ).length,
        stcCandidates: filteredCandidates.filter((c) => c.type === "STC")
          .length,
        wtcCandidates: filteredCandidates.filter((c) => c.type === "WTC")
          .length,
        nonRailwayCandidates: filteredCandidates.filter(
          (c) => c.type === "Non Railway"
        ).length,
        railwayCandidates: filteredCandidates.filter(
          (c) => c.category === "Railway"
        ).length,
        distinctBatches: [...new Set(filteredCandidates.map((c) => c.batch))]
          .length,
        workInfoDistribution: this.getWorkInfoDistribution(filteredCandidates),
        batchDistribution: this.getBatchDistribution(filteredCandidates),
        streamDistribution: this.getStreamDistribution(filteredCandidates),
      };
      return { success: true, data: stats };
    } catch (error) {
      console.error("Error getting stats:", error);
      return { success: false, data: null };
    }
  }

  getWorkInfoDistribution(candidates) {
    const distribution = {};
    candidates.forEach((candidate) => {
      const workInfo = candidate.workInfo;
      distribution[workInfo] = (distribution[workInfo] || 0) + 1;
    });
    return distribution;
  }

  getBatchDistribution(candidates) {
    const distribution = {};
    candidates.forEach((candidate) => {
      const batch = candidate.batch;
      distribution[batch] = (distribution[batch] || 0) + 1;
    });
    return distribution;
  }

  getStreamDistribution(candidates) {
    const distribution = {};
    candidates.forEach((candidate) => {
      const stream = candidate.stream;
      distribution[stream] = (distribution[stream] || 0) + 1;
    });
    return distribution;
  }
}

// Mock Backend API - Simulates REST endpoints with local storage persistence (DEPRECATED - Use RealBackendAPI)
class MockBackendAPI {
  constructor() {
    this.storageKey = "stc_candidates_data";
    this.init();
  }

  init() {
    // Initialize with default data if none exists
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        candidates: this.getInitialCandidates(),
        lastId: 16,
        counters: {
          ASE: 1,
          AJE: 1,
          IJE: 1,
          RJE: 1,
          RCW: 1,
          RD: 1,
          TS: 1,
          LHI: 1,
          LHII: 1,
          FM: 1,
          WT: 1,
          DM: 1,
          WE: 1,
          NDT: 1,
          EA: 1,
          "3DMP": 1,
          MSE: 1,
          MJR: 1,
        },
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Simulate network delay
  async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getInitialCandidates() {
    return [
      // STC Candidates (Railway) - Adding trainees from TraineeProfile
      {
        id: 1,
        name: "Rahul Kumar",
        email: "rahul.kumar@railway.gov.in",
        ticketNumber: "STC2024001",
        serialNo: 1001,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "MSE",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/men/1.jpg",
        status: "Active",
        designation: "MSE",
        unit: "JAT",
        phoneNumber: "9876543210",
        dateOfJoiningStcWtcNonRailway: "2024-01-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Priya Sharma",
        email: "priya.sharma@railway.gov.in",
        ticketNumber: "STC2024002",
        serialNo: 1002,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "MSE",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/women/1.jpg",
        status: "Active",
        designation: "MSE",
        unit: "FZD",
        phoneNumber: "9876543211",
        dateOfJoiningStcWtcNonRailway: "2024-02-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Amit Singh",
        email: "amit.singh@railway.gov.in",
        ticketNumber: "STC2024003",
        serialNo: 1003,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "MSE",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/men/2.jpg",
        status: "Active",
        designation: "MSE",
        unit: "MB",
        phoneNumber: "9876543212",
        dateOfJoiningStcWtcNonRailway: "2024-03-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: "Neha Gupta",
        email: "neha.gupta@railway.gov.in",
        ticketNumber: "STC2024004",
        serialNo: 1004,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "MJR",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/women/2.jpg",
        status: "Active",
        designation: "MJR",
        unit: "MB",
        phoneNumber: "9876543213",
        dateOfJoiningStcWtcNonRailway: "2024-01-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 5,
        name: "Vikash Yadav",
        email: "vikash.yadav@railway.gov.in",
        ticketNumber: "STC2024005",
        serialNo: 1005,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "MJR",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/men/3.jpg",
        status: "Active",
        designation: "MJR",
        unit: "FZD",
        phoneNumber: "9876543214",
        dateOfJoiningStcWtcNonRailway: "2024-02-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 6,
        name: "Sunita Devi",
        email: "sunita.devi@railway.gov.in",
        ticketNumber: "STC2024006",
        serialNo: 1006,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "MJR",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/women/3.jpg",
        status: "Active",
        designation: "MJR",
        unit: "JAT",
        phoneNumber: "9876543215",
        dateOfJoiningStcWtcNonRailway: "2024-03-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Original STC Candidates
      {
        id: 7,
        name: "John Doe",
        email: "john.doe@example.com",
        ticketNumber: "ASE00001",
        serialNo: 2001,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "ASE",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/men/4.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-01-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 8,
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        ticketNumber: "AJE00001",
        serialNo: 2002,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "AJE",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/men/5.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-02-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 9,
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        ticketNumber: "IJE00001",
        serialNo: 2003,
        batch: "2023-2024",
        stream: "Railway",
        workInfo: "IJE",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/men/6.jpg",
        status: "Inactive",
        dateOfJoiningStcWtcNonRailway: "2023-10-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // WTC Candidates (Railway)
      {
        id: 10,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        ticketNumber: "RJE00001",
        serialNo: 3001,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "RJE",
        type: "WTC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/women/4.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-03-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 11,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        ticketNumber: "RCW00001",
        serialNo: 3002,
        batch: "2025-2026",
        stream: "Railway",
        workInfo: "RCW",
        type: "WTC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/women/5.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-11-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 12,
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        ticketNumber: "RD00001",
        serialNo: 3003,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "RD",
        type: "WTC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/women/6.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-04-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Non Railway Candidates
      {
        id: 13,
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        ticketNumber: "TS00001",
        serialNo: 4001,
        batch: "2025-2026",
        stream: "Non Railway",
        workInfo: "TS",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/women/7.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-12-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 14,
        name: "David Brown",
        email: "david.brown@example.com",
        ticketNumber: "LHI00001",
        serialNo: 4002,
        batch: "2024-2025",
        stream: "Non Railway",
        workInfo: "LHI",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/men/7.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-05-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 15,
        name: "Mark Taylor",
        email: "mark.taylor@example.com",
        ticketNumber: "LHII00001",
        serialNo: 4003,
        batch: "2023-2024",
        stream: "Non Railway",
        workInfo: "LHII",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/men/8.jpg",
        status: "Inactive",
        dateOfJoiningStcWtcNonRailway: "2023-11-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 16,
        name: "Anna Johnson",
        email: "anna.johnson@example.com",
        ticketNumber: "FM00001",
        serialNo: 4004,
        batch: "2025-2026",
        stream: "Non Railway",
        workInfo: "FM",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/women/8.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-10-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // GET /api/candidates
  async fetchCandidates() {
    await this.delay();
    const data = this.getData();
    return { success: true, data: data.candidates };
  }

  // POST /api/candidates
  async createCandidate(candidateData) {
    await this.delay();
    const data = this.getData();

    // Generate ticket number
    const workInfo = candidateData.workInfo;
    const counter = data.counters[workInfo] || 1;
    const ticketNumber = `${workInfo}${counter.toString().padStart(5, "0")}`;

    const newCandidate = {
      ...candidateData,
      id: data.lastId + 1,
      ticketNumber,
      serialNo: data.lastId + 1000,
      type: candidateData.stcWtcType || candidateData.type,
      picture:
        candidateData.picture instanceof File
          ? URL.createObjectURL(candidateData.picture)
          : candidateData.picture ||
          "https://randomuser.me/api/portraits/lego/1.jpg",
      status: candidateData.status || "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.candidates.unshift(newCandidate);
    data.lastId += 1;
    data.counters[workInfo] = counter + 1;

    this.saveData(data);
    return { success: true, data: newCandidate };
  }

  // PUT /api/candidates/:id
  async updateCandidate(candidateId, candidateData) {
    await this.delay();
    const data = this.getData();

    const index = data.candidates.findIndex((c) => c.id === candidateId);
    if (index === -1) {
      throw new Error("Candidate not found");
    }

    const updatedCandidate = {
      ...data.candidates[index],
      ...candidateData,
      type: candidateData.stcWtcType || candidateData.type,
      picture:
        candidateData.picture instanceof File
          ? URL.createObjectURL(candidateData.picture)
          : candidateData.picture || data.candidates[index].picture,
      updatedAt: new Date().toISOString(),
    };

    data.candidates[index] = updatedCandidate;
    this.saveData(data);
    return { success: true, data: updatedCandidate };
  }

  // DELETE /api/candidates/:id
  async deleteCandidate(candidateId) {
    await this.delay();
    const data = this.getData();

    const index = data.candidates.findIndex((c) => c.id === candidateId);
    if (index === -1) {
      throw new Error("Candidate not found");
    }

    data.candidates.splice(index, 1);
    this.saveData(data);
    return { success: true };
  }

  // GET /api/candidates/stats
  async getStats(filters = {}) {
    await this.delay();
    const data = this.getData();
    let candidates = data.candidates;

    // Apply filters
    if (filters.category && filters.category !== "All") {
      candidates = candidates.filter((c) => c.category === filters.category);
    }
    if (filters.type && filters.type !== "All") {
      if (filters.type === "All Railway") {
        candidates = candidates.filter((c) => c.category === "Railway");
      } else if (filters.type === "Non Railway") {
        candidates = candidates.filter((c) => c.category === "Non Railway");
      } else {
        candidates = candidates.filter((c) => c.type === filters.type);
      }
    }

    const stats = {
      totalCandidates: candidates.length,
      activeCandidates: candidates.filter((c) => c.status === "Active").length,
      distinctBatches: [...new Set(candidates.map((c) => c.batch))].length,
      distinctStreams: [...new Set(candidates.map((c) => c.stream))].length,
      workInfoDistribution: this.getWorkInfoDistribution(candidates),
      batchDistribution: this.getBatchDistribution(candidates),
      streamDistribution: this.getStreamDistribution(candidates),
    };

    return { success: true, data: stats };
  }

  // GET /api/dropdowns
  async getDropdownData() {
    await this.delay(100);
    const data = this.getData();
    const candidates = data.candidates;

    const dropdownData = {
      batches: [...new Set(candidates.map((c) => c.batch))].sort(),
      streams: [...new Set(candidates.map((c) => c.stream))].sort(),
      workInfo: [
        "ASE",
        "AJE",
        "IJE",
        "RJE",
        "RCW",
        "RD",
        "TS",
        "LHI",
        "LHII",
        "FM",
        "WT",
        "DM",
        "WE",
        "NDT",
        "EA",
        "3DMP",
      ],
      categories: ["All", "Railway", "Non Railway"],
      types: {
        All: ["All"],
        Railway: ["All Railway", "STC", "WTC"],
        "Non Railway": ["Non Railway"],
      },
    };

    return { success: true, data: dropdownData };
  }

  getWorkInfoDistribution(candidates) {
    const distribution = {};
    candidates.forEach((c) => {
      distribution[c.workInfo] = (distribution[c.workInfo] || 0) + 1;
    });
    return distribution;
  }

  getBatchDistribution(candidates) {
    const distribution = {};
    candidates.forEach((c) => {
      distribution[c.batch] = (distribution[c.batch] || 0) + 1;
    });
    return distribution;
  }

  getStreamDistribution(candidates) {
    const distribution = {};
    candidates.forEach((c) => {
      distribution[c.stream] = (distribution[c.stream] || 0) + 1;
    });
    return distribution;
  }
}

// Initialize the real backend API
const api = new RealBackendAPI();

// Toast Notification Component
const ToastNotification = ({ message, type = "success", onClose }) => {
  const getNotificationStyles = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          iconColor: "text-green-400",
          icon: (
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          ),
        };
      case "error":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-400",
          icon: (
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          ),
        };
      case "warning":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-400",
          icon: (
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          ),
        };
      default:
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          iconColor: "text-blue-400",
          icon: (
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          ),
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${styles.bgColor} border ${styles.borderColor} ${styles.textColor} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transform transition-all duration-300 ease-in-out max-w-md`}
    >
      <div className="flex-shrink-0">
        <svg
          className={`h-5 w-5 ${styles.iconColor}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {styles.icon}
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={onClose}
          className={`inline-flex ${styles.iconColor} hover:opacity-75 focus:outline-none transition-opacity duration-200`}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const CandidateManagementPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [dropdownData, setDropdownData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([
    "STC",
    "WTC",
    "Non Railway",
  ]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    candidateId: null,
    candidateName: "",
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [autoFilterNotification, setAutoFilterNotification] = useState(null);
  const [successNotification, setSuccessNotification] = useState(null);
  const [notification, setNotification] = useState(null); // For different types of notifications
  const [notificationTimeout, setNotificationTimeout] = useState(null);

  // State to control view ('list' or 'form') and the candidate being edited
  const [view, setView] = useState("list");
  const [candidateToEdit, setCandidateToEdit] = useState(null);

  // API functions using the real backend
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.fetchCandidates();
      if (response.success) {
        setCandidates(response.data);
        setError(null);
      } else {
        throw new Error("Failed to fetch candidates");
      }
    } catch (err) {
      setError("Failed to fetch candidates");
      console.error("Error fetching candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const response = await api.getDropdownData();
      if (response.success) {
        setDropdownData(response.data);
      }
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  const createCandidate = async (candidateData) => {
    try {
      const response = await api.createCandidate(candidateData);
      if (response.success) {
        setCandidates((prev) => [response.data, ...prev]);
        // Show success notification
        const candidateName =
          response.data.name || candidateData.name || "New candidate";
        showSuccessNotification(`${candidateName} created successfully!`);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create candidate");
      }
    } catch (err) {
      const errorMessage = `Failed to create candidate: ${err.message}`;
      setError(errorMessage);
      showNotification(errorMessage, "error");
      console.error("Error creating candidate:", err);
      throw err;
    }
  };

  const updateCandidate = async (candidateId, candidateData) => {
    try {
      const response = await api.updateCandidate(candidateId, candidateData);
      if (response.success) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidateId ? response.data : c))
        );
        // Show success notification
        const candidateName =
          response.data.name || candidateData.name || "Candidate";
        showSuccessNotification(`${candidateName} updated successfully!`);
      } else {
        throw new Error(response.message || "Failed to update candidate");
      }
    } catch (err) {
      const errorMessage = `Failed to update candidate: ${err.message}`;
      setError(errorMessage);
      showNotification(errorMessage, "error");
      console.error("Error updating candidate:", err);
      throw err;
    }
  };

  const deleteCandidate = async (candidateId) => {
    try {
      // Get candidate name before deletion for the success message
      const candidateToDelete = candidates.find((c) => c.id === candidateId);
      const candidateName = candidateToDelete?.name || "Candidate";

      const response = await api.deleteCandidate(candidateId);
      if (response.success) {
        setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
        // Show success notification
        showSuccessNotification(`${candidateName} deleted successfully!`);
      } else {
        throw new Error(response.message || "Failed to delete candidate");
      }
    } catch (err) {
      const errorMessage = `Failed to delete candidate: ${err.message}`;
      setError(errorMessage);
      showNotification(errorMessage, "error");
      console.error("Error deleting candidate:", err);
      throw err;
    }
  };

  // Load initial data
  useEffect(() => {
    Promise.all([fetchCandidates(), fetchDropdownData()]);

    // Cleanup function
    return () => {
      if (notificationTimeout) {
        clearTimeout(notificationTimeout);
      }
    };
  }, [notificationTimeout]);

  // Check for trainee data from TraineeProfile and auto-filter
  useEffect(() => {
    const editTraineeId = localStorage.getItem("editTraineeId");
    const editTraineeName = localStorage.getItem("editTraineeName");
    const editTraineeTicket = localStorage.getItem("editTraineeTicket");
    // const editTraineeDesignation = localStorage.getItem("editTraineeDesignation");

    if (editTraineeId && editTraineeName && candidates.length > 0) {
      // Try to find the candidate by different criteria
      let searchCriteria = editTraineeName;

      // If ticket number exists, use it for more precise matching
      if (editTraineeTicket) {
        searchCriteria = editTraineeTicket;
      }

      // Set search term to automatically filter for the specific trainee
      setSearchTerm(searchCriteria);

      // Make sure STC filter is enabled since this is coming from STC management
      if (!selectedFilters.includes("STC")) {
        setSelectedFilters((prev) => [...prev, "STC"]);
      }

      // Show notification about auto-filtering
      setAutoFilterNotification({
        traineeName: editTraineeName,
        searchCriteria: searchCriteria,
        ticketNo: editTraineeTicket,
      });

      // Clear the localStorage data after using it
      localStorage.removeItem("editTraineeId");
      localStorage.removeItem("editTraineeName");
      localStorage.removeItem("editTraineeTicket");
      localStorage.removeItem("editTraineeDesignation");
    }
  }, [candidates, selectedFilters]); // Run after candidates are loaded

  const activeCandidates = useMemo(() => {
    // If no filters are selected, return nothing
    if (selectedFilters.length === 0) {
      return [];
    }

    // Filter candidates based on selected filter types
    const filtered = candidates.filter((candidate) => {
      const isStcMatch =
        selectedFilters.includes("STC") && candidate.type === "STC";
      const isWtcMatch =
        selectedFilters.includes("WTC") && candidate.type === "WTC";
      const isNonRailwayMatch =
        selectedFilters.includes("Non Railway") &&
        candidate.type === "Non Railway";

      return isStcMatch || isWtcMatch || isNonRailwayMatch;
    });

    return filtered;
  }, [candidates, selectedFilters]);

  const filteredCandidates = useMemo(() => {
    const searchFiltered = activeCandidates.filter((candidate) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        candidate.name?.toLowerCase().includes(searchLower) ||
        (candidate.email &&
          candidate.email.toLowerCase().includes(searchLower)) ||
        candidate.ticketNumber?.toLowerCase().includes(searchLower) ||
        candidate.serialNo?.toString().includes(searchTerm);
      const matchesBatch = !filterBatch || candidate.batch === filterBatch;

      return matchesSearch && matchesBatch;
    });

    return searchFiltered;
  }, [activeCandidates, searchTerm, filterBatch]);

  // Handle inline editing update
  const handleInlineUpdate = async (candidateId, updatedData) => {
    try {
      await updateCandidate(candidateId, updatedData);
      // Success message is already handled in updateCandidate function
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  // Handler to open the form for editing a specific candidate
  const handleEdit = (candidate) => {
    setCandidateToEdit(candidate);
    setView("form");
  };

  // Unified form submission handler for both adding and editing
  const handleFormSubmit = async (formData) => {
    try {
      if (candidateToEdit) {
        // This is an UPDATE
        await updateCandidate(candidateToEdit.id, formData);
      } else {
        // This is an ADD
        await createCandidate(formData);
      }
      setView("list"); // Return to the list view
      setCandidateToEdit(null); // Reset editing state
    } catch (err) {
      // Error handling is done in the API functions
      console.error("Form submission error:", err);
    }
  };

  const handleCancelForm = () => {
    setView("list");
    setCandidateToEdit(null);
  };

  const handleDelete = async () => {
    try {
      await deleteCandidate(deleteModal.candidateId);
      setDeleteModal({ isOpen: false, candidateId: null, candidateName: "" });
    } catch (err) {
      // Error handling is done in the API function
      console.error("Delete error:", err);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBatch("");
    setSelectedFilters(["STC", "WTC", "Non Railway"]); // Reset to all filters selected
  };

  // Derive filter type for StatsCards from selectedFilters
  const getFilterTypeForStats = () => {
    if (selectedFilters.length === 3) return "All"; // All types selected
    if (selectedFilters.length === 1) return selectedFilters[0]; // Single type
    if (selectedFilters.length === 2) {
      // Handle specific combinations
      if (selectedFilters.includes("STC") && selectedFilters.includes("WTC"))
        return "Railway";
      return selectedFilters.join(" + "); // Show combined types
    }
    return "Filtered"; // Fallback for other combinations
  };


  // Helper function to show success notifications
  const showSuccessNotification = (message) => {
    // Clear any existing timeout
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }

    setSuccessNotification(message);
    setError(null); // Clear any existing error when showing success

    // Auto-dismiss after 3 seconds
    const timeout = setTimeout(() => {
      setSuccessNotification(null);
      setNotificationTimeout(null);
    }, 3000);

    setNotificationTimeout(timeout);
  };

  // Enhanced notification system for different types
  const showNotification = (message, type = "success", duration = 3000) => {
    // Clear any existing timeout
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }

    setNotification({ message, type });
    setError(null); // Clear any existing error

    // Auto-dismiss
    const timeout = setTimeout(() => {
      setNotification(null);
      setNotificationTimeout(null);
    }, duration);

    setNotificationTimeout(timeout);
  };
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Toast Notifications */}
        {successNotification && (
          <ToastNotification
            message={successNotification}
            type="success"
            onClose={() => {
              if (notificationTimeout) clearTimeout(notificationTimeout);
              setSuccessNotification(null);
              setNotificationTimeout(null);
            }}
          />
        )}

        {notification && (
          <ToastNotification
            message={notification.message}
            type={notification.type}
            onClose={() => {
              if (notificationTimeout) clearTimeout(notificationTimeout);
              setNotification(null);
              setNotificationTimeout(null);
            }}
          />
        )}

        {/* Auto-filter notification */}
        {autoFilterNotification && (
          <div className="bg-blue-50 border-2 border-blue-300 text-blue-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  Filtered for trainee:{" "}
                  <strong>{autoFilterNotification.traineeName}</strong>
                  {autoFilterNotification.ticketNo && (
                    <span> (Ticket: {autoFilterNotification.ticketNo})</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => setAutoFilterNotification(null)}
                className="inline-flex text-blue-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <PageHeader
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          isListView={view === "list"}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : view === "list" ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <StatsCards
                  candidates={activeCandidates}
                  selectedFilters={selectedFilters}
                  filterType={getFilterTypeForStats()}
                  filterCategory="All"
                  mockAPI={api}
                />
                <SearchFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterBatch={filterBatch}
                  setFilterBatch={setFilterBatch}
                  dropdownData={dropdownData}
                  onClearFilters={clearFilters}
                  mockAPI={api}
                />
                <CandidateTable
                  candidates={filteredCandidates}
                  onViewDetail={setSelectedCandidate}
                  onDelete={(id, name) =>
                    setDeleteModal({
                      isOpen: true,
                      candidateId: id,
                      candidateName: name,
                    })
                  }
                  onEdit={handleEdit} // Pass the edit handler
                  onUpdate={handleInlineUpdate} // Pass the inline update handler
                />
              </div>
              <div className="lg:col-span-1">
                <ActivityPanel candidates={activeCandidates} mockAPI={api} />
              </div>
            </div>
          </>
        ) : (
          <CandidateForm
            candidate={candidateToEdit} // Pass the candidate to edit, or null for a new one
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            isEdit={!!candidateToEdit} // True if editing, false if adding
          />
        )}

        <DeleteModal
          isOpen={deleteModal.isOpen}
          candidateName={deleteModal.candidateName}
          onConfirm={handleDelete}
          onCancel={() =>
            setDeleteModal({
              isOpen: false,
              candidateId: null,
              candidateName: "",
            })
          }
        />

        {selectedCandidate && (
          <DetailModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CandidateManagementPage;
