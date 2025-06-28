# STC Candidate Management System - Mock Backend Implementation

## Overview
This document describes the comprehensive mock backend implementation for the STC Candidate Management System. The system provides a complete frontend-only solution with simulated API endpoints, persistent data storage using localStorage, and full CRUD operations.

## Features Implemented

### 🏗️ Mock Backend API Architecture
- **MockBackendAPI Class**: Complete backend simulation with localStorage persistence
- **REST-like Endpoints**: Simulated HTTP requests with delays and proper responses
- **Data Persistence**: Uses localStorage to maintain data across browser sessions
- **Error Handling**: Proper error responses and edge case handling
- **Automatic ID Generation**: Sequential IDs and ticket number generation

### 📊 Data Model
```javascript
{
  id: number,
  name: string,
  email: string,
  ticketNumber: string, // Auto-generated (e.g., "ASE00001")
  serialNo: number,
  batch: string, // Format: "2024-2025"
  stream: string, // "Railway" | "Non Railway"
  workInfo: string, // ASE, AJE, IJE, RJE, RCW, RD, TS, LHI, LHII, FM, WT, DM, WE, NDT, EA, 3DMP
  type: string, // "STC" | "WTC" | "Non Railway"
  category: string, // "Railway" | "Non Railway"
  picture: string,
  status: string, // "Active" | "Inactive"
  dateOfJoiningStcWtcNonRailway: string,
  createdAt: string,
  updatedAt: string
}
```

### 🔧 Mock API Endpoints

#### 1. GET /api/candidates
```javascript
await mockAPI.fetchCandidates()
// Returns: { success: true, data: Candidate[] }
```

#### 2. POST /api/candidates
```javascript
await mockAPI.createCandidate(candidateData)
// Returns: { success: true, data: Candidate }
// Auto-generates: id, ticketNumber, serialNo, timestamps
```

#### 3. PUT /api/candidates/:id
```javascript
await mockAPI.updateCandidate(candidateId, candidateData)
// Returns: { success: true, data: Candidate }
// Updates: updatedAt timestamp
```

#### 4. DELETE /api/candidates/:id
```javascript
await mockAPI.deleteCandidate(candidateId)
// Returns: { success: true }
```

#### 5. GET /api/candidates/stats
```javascript
await mockAPI.getStats(filters)
// Returns: { success: true, data: StatsObject }
// Includes: totalCandidates, activeCandidates, distributions
```

#### 6. GET /api/dropdowns
```javascript
await mockAPI.getDropdownData()
// Returns: { success: true, data: DropdownData }
// Includes: batches, streams, workInfo, categories, types
```

### 🎯 Component Integration

#### CandidateManagementPage.jsx
- **Main orchestrator** of all mock API calls
- **State management** for candidates, dropdowns, loading, and errors
- **CRUD operations** integrated with UI actions
- **Filter management** with hierarchical filtering (All → Railway/Non Railway → STC/WTC)

#### StatsCard.jsx
- **Real-time statistics** fetched from mock API
- **Filter-aware stats** that update based on current filters
- **Loading states** and fallback calculations
- **API-driven data** with local fallbacks

#### SearchAndFilter.jsx
- **Dynamic dropdown data** from mock API
- **Real-time filter updates** with API calls
- **Loading states** for smooth UX
- **Filter persistence** across component renders

#### ActivityPanel.jsx
- **Recent activity simulation** based on candidate data
- **Mock API integration** for activity feeds
- **Enhanced UI** with loading states and better data presentation
- **Add candidate integration** with form navigation

#### CandidateTable.jsx
- **Ticket number display** instead of employee numbers
- **Compatible with new data structure**
- **Proper field mapping** for both old and new data formats

### 🔄 Data Flow

```
User Action → Component → Mock API → localStorage → Component Update → UI Refresh
```

1. **User initiates action** (create, update, delete, filter)
2. **Component calls mock API** function
3. **Mock API processes request** with simulated delay
4. **Data persisted to localStorage** for persistence
5. **Component state updated** with response
6. **UI automatically refreshes** with new data

### 📈 Statistics & Analytics
- **Real-time calculations** of candidate metrics
- **Filter-specific statistics** that update dynamically
- **Work info distribution** analysis
- **Batch and stream analytics**
- **Active vs inactive candidate tracking**

### 🎨 UI Enhancements
- **Loading states** for all async operations
- **Error handling** with user-friendly messages
- **Responsive design** maintained across all components
- **Smooth transitions** and animations
- **Consistent styling** with the existing design system

### 🧪 Testing
- **Complete test suite** in `mockAPI.test.js`
- **All endpoint coverage** with automated tests
- **Browser console testing** available
- **Data integrity verification**

#### Running Tests
```javascript
// In browser console
testMockAPI() // Runs all endpoint tests
```

### 📁 File Structure
```
frontend/src/STC/manage/
├── CandidateManagementPage.jsx (Main component with MockBackendAPI)
├── StatsCard.jsx (API-integrated statistics)
├── SearchAndFilter.jsx (Dynamic filters)
├── ActivityPanel.jsx (Recent activity)
├── CandidateTable.jsx (Updated for ticket numbers)
├── PageHeader.jsx (Filter controls)
├── DetailModal.jsx (Updated field mapping)
├── DeleteModal.jsx (No changes needed)
├── ResultSummary.jsx (No changes needed)
└── mockAPI.test.js (Test suite)
```

### 🔮 Future Migration to Real Backend
The mock API structure is designed to make migration to a real backend seamless:

1. **Replace MockBackendAPI class** with actual HTTP client
2. **Update endpoints** to real server URLs
3. **Modify authentication** if needed
4. **Keep component logic unchanged**

#### Migration Example
```javascript
// Current mock implementation
const response = await mockAPI.fetchCandidates();

// Future real backend
const response = await fetch('/api/candidates')
  .then(res => res.json())
  .then(data => ({ success: true, data }));
```

### 🛡️ Data Persistence
- **localStorage-based** persistence across browser sessions
- **JSON serialization** of complex data structures
- **Automatic initialization** with sample data
- **Data integrity** maintained across operations

### 💡 Key Benefits
1. **No backend dependency** - Pure frontend development
2. **Realistic API simulation** - True-to-life async operations
3. **Full CRUD support** - Complete data management
4. **Persistent storage** - Data survives page refreshes
5. **Easy testing** - Built-in test suite
6. **Scalable architecture** - Ready for backend migration
7. **Rich UI feedback** - Loading states and error handling

### 🚀 Usage Instructions
1. **No setup required** - Everything is self-contained
2. **Automatic initialization** - Sample data loads on first run
3. **Full functionality** - All features work out of the box
4. **Test with console** - Run `testMockAPI()` to verify

This implementation provides a complete, production-ready candidate management system that functions entirely in the frontend while maintaining all the characteristics of a real backend-driven application.
