import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from './PageHeader';
import StatsCards from './StatsCard';
import SearchFilters from './SearchAndFilter';
import CandidateTable from './CandidateTable';
import DeleteModal from './DeleteModal';
import DetailModal from './DetailModal';
import ActivityPanel from './ActivityPanel';
// import CandidateForm from '../form/Components/StcCandidateForm';

// Mock Backend API - Simulates REST endpoints with local storage persistence
class MockBackendAPI {
  constructor() {
    this.storageKey = 'stc_candidates_data';
    this.init();
  }

  init() {
    // Initialize with default data if none exists
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        candidates: this.getInitialCandidates(),
        lastId: 16,
        counters: {
          ASE: 1, AJE: 1, IJE: 1, RJE: 1, RCW: 1, RD: 1,
          TS: 1, LHI: 1, LHII: 1, FM: 1, WT: 1, DM: 1,
          WE: 1, NDT: 1, EA: 1, '3DMP': 1
        }
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
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getInitialCandidates() {
    return [
      // STC Candidates (Railway)
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        ticketNumber: "ASE00001",
        serialNo: 1001,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "ASE",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/men/1.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-01-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        ticketNumber: "AJE00001",
        serialNo: 1002,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "AJE",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/men/2.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-02-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        ticketNumber: "IJE00001",
        serialNo: 1003,
        batch: "2023-2024",
        stream: "Railway",
        workInfo: "IJE",
        type: "STC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/men/3.jpg",
        status: "Inactive",
        dateOfJoiningStcWtcNonRailway: "2023-10-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // WTC Candidates (Railway)
      {
        id: 4,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        ticketNumber: "RJE00001",
        serialNo: 2001,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "RJE",
        type: "WTC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/women/1.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-03-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        ticketNumber: "RCW00001",
        serialNo: 2002,
        batch: "2025-2026",
        stream: "Railway",
        workInfo: "RCW",
        type: "WTC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/women/2.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-11-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 6,
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        ticketNumber: "RD00001",
        serialNo: 2003,
        batch: "2024-2025",
        stream: "Railway",
        workInfo: "RD",
        type: "WTC",
        category: "Railway",
        picture: "https://randomuser.me/api/portraits/women/3.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-04-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Non Railway Candidates
      {
        id: 7,
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        ticketNumber: "TS00001",
        serialNo: 3001,
        batch: "2025-2026",
        stream: "Non Railway",
        workInfo: "TS",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/women/4.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-12-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 8,
        name: "David Brown",
        email: "david.brown@example.com",
        ticketNumber: "LHI00001",
        serialNo: 3002,
        batch: "2024-2025",
        stream: "Non Railway",
        workInfo: "LHI",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/men/4.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-05-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 9,
        name: "Mark Taylor",
        email: "mark.taylor@example.com",
        ticketNumber: "LHII00001",
        serialNo: 3003,
        batch: "2023-2024",
        stream: "Non Railway",
        workInfo: "LHII",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/men/5.jpg",
        status: "Inactive",
        dateOfJoiningStcWtcNonRailway: "2023-11-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 10,
        name: "Anna Johnson",
        email: "anna.johnson@example.com",
        ticketNumber: "FM00001",
        serialNo: 3004,
        batch: "2025-2026",
        stream: "Non Railway",
        workInfo: "FM",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/women/5.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-10-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Additional candidates with remaining work info types
      {
        id: 11,
        name: "Tom Wilson",
        email: "tom.wilson@example.com",
        ticketNumber: "WT00001",
        serialNo: 3005,
        batch: "2024-2025",
        stream: "Non Railway",
        workInfo: "WT",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/men/6.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-06-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 12,
        name: "Kate Davis",
        email: "kate.davis@example.com",
        ticketNumber: "DM00001",
        serialNo: 3006,
        batch: "2024-2025",
        stream: "Non Railway",
        workInfo: "DM",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/women/6.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-07-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 13,
        name: "Alex Smith",
        email: "alex.smith@example.com",
        ticketNumber: "WE00001",
        serialNo: 3007,
        batch: "2023-2024",
        stream: "Non Railway",
        workInfo: "WE",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/men/7.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2023-12-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 14,
        name: "Nina Brown",
        email: "nina.brown@example.com",
        ticketNumber: "NDT00001",
        serialNo: 3008,
        batch: "2024-2025",
        stream: "Non Railway",
        workInfo: "NDT",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/women/7.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-08-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 15,
        name: "Paul Johnson",
        email: "paul.johnson@example.com",
        ticketNumber: "EA00001",
        serialNo: 3009,
        batch: "2025-2026",
        stream: "Non Railway",
        workInfo: "EA",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/men/8.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-09-01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 16,
        name: "Grace Lee",
        email: "grace.lee@example.com",
        ticketNumber: "3DMP00001",
        serialNo: 3010,
        batch: "2024-2025",
        stream: "Non Railway",
        workInfo: "3DMP",
        type: "Non Railway",
        category: "Non Railway",
        picture: "https://randomuser.me/api/portraits/women/8.jpg",
        status: "Active",
        dateOfJoiningStcWtcNonRailway: "2024-08-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
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
    const ticketNumber = `${workInfo}${counter.toString().padStart(5, '0')}`;

    const newCandidate = {
      ...candidateData,
      id: data.lastId + 1,
      ticketNumber,
      serialNo: data.lastId + 1000,
      type: candidateData.stcWtcType || candidateData.type,
      picture: candidateData.picture instanceof File
        ? URL.createObjectURL(candidateData.picture)
        : candidateData.picture || 'https://randomuser.me/api/portraits/lego/1.jpg',
      status: candidateData.status || "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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

    const index = data.candidates.findIndex(c => c.id === candidateId);
    if (index === -1) {
      throw new Error('Candidate not found');
    }

    const updatedCandidate = {
      ...data.candidates[index],
      ...candidateData,
      type: candidateData.stcWtcType || candidateData.type,
      picture: candidateData.picture instanceof File
        ? URL.createObjectURL(candidateData.picture)
        : candidateData.picture || data.candidates[index].picture,
      updatedAt: new Date().toISOString()
    };

    data.candidates[index] = updatedCandidate;
    this.saveData(data);
    return { success: true, data: updatedCandidate };
  }

  // DELETE /api/candidates/:id
  async deleteCandidate(candidateId) {
    await this.delay();
    const data = this.getData();

    const index = data.candidates.findIndex(c => c.id === candidateId);
    if (index === -1) {
      throw new Error('Candidate not found');
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
      candidates = candidates.filter(c => c.category === filters.category);
    }
    if (filters.type && filters.type !== "All") {
      if (filters.type === "All Railway") {
        candidates = candidates.filter(c => c.category === "Railway");
      } else if (filters.type === "Non Railway") {
        candidates = candidates.filter(c => c.category === "Non Railway");
      } else {
        candidates = candidates.filter(c => c.type === filters.type);
      }
    }

    const stats = {
      totalCandidates: candidates.length,
      activeCandidates: candidates.filter(c => c.status === "Active").length,
      distinctBatches: [...new Set(candidates.map(c => c.batch))].length,
      distinctStreams: [...new Set(candidates.map(c => c.stream))].length,
      workInfoDistribution: this.getWorkInfoDistribution(candidates),
      batchDistribution: this.getBatchDistribution(candidates),
      streamDistribution: this.getStreamDistribution(candidates)
    };

    return { success: true, data: stats };
  }

  // GET /api/dropdowns
  async getDropdownData() {
    await this.delay(100);
    const data = this.getData();
    const candidates = data.candidates;

    const dropdownData = {
      batches: [...new Set(candidates.map(c => c.batch))].sort(),
      streams: [...new Set(candidates.map(c => c.stream))].sort(),
      workInfo: ["ASE", "AJE", "IJE", "RJE", "RCW", "RD", "TS", "LHI", "LHII", "FM", "WT", "DM", "WE", "NDT", "EA", "3DMP"],
      categories: ["All", "Railway", "Non Railway"],
      types: {
        "All": ["All"],
        "Railway": ["All Railway", "STC", "WTC"],
        "Non Railway": ["Non Railway"]
      }
    };

    return { success: true, data: dropdownData };
  }

  getWorkInfoDistribution(candidates) {
    const distribution = {};
    candidates.forEach(c => {
      distribution[c.workInfo] = (distribution[c.workInfo] || 0) + 1;
    });
    return distribution;
  }

  getBatchDistribution(candidates) {
    const distribution = {};
    candidates.forEach(c => {
      distribution[c.batch] = (distribution[c.batch] || 0) + 1;
    });
    return distribution;
  }

  getStreamDistribution(candidates) {
    const distribution = {};
    candidates.forEach(c => {
      distribution[c.stream] = (distribution[c.stream] || 0) + 1;
    });
    return distribution;
  }
}

// Initialize the mock backend
const mockAPI = new MockBackendAPI();

const CandidateManagementPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [dropdownData, setDropdownData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(["STC", "WTC", "Non Railway"]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, candidateId: null, candidateName: "" });
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // State to control view ('list' or 'form') and the candidate being edited
  const [view, setView] = useState('list');
  const [candidateToEdit, setCandidateToEdit] = useState(null);

  // API functions using the mock backend
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await mockAPI.fetchCandidates();
      if (response.success) {
        setCandidates(response.data);
        setError(null);
      } else {
        throw new Error('Failed to fetch candidates');
      }
    } catch (err) {
      setError('Failed to fetch candidates');
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const response = await mockAPI.getDropdownData();
      if (response.success) {
        setDropdownData(response.data);
      }
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  const createCandidate = async (candidateData) => {
    try {
      const response = await mockAPI.createCandidate(candidateData);
      if (response.success) {
        setCandidates(prev => [response.data, ...prev]);
        return response.data;
      } else {
        throw new Error('Failed to create candidate');
      }
    } catch (err) {
      setError('Failed to create candidate');
      console.error('Error creating candidate:', err);
      throw err;
    }
  };

  const updateCandidate = async (candidateId, candidateData) => {
    try {
      const response = await mockAPI.updateCandidate(candidateId, candidateData);
      if (response.success) {
        setCandidates(prev => prev.map(c =>
          c.id === candidateId ? response.data : c
        ));
      } else {
        throw new Error('Failed to update candidate');
      }
    } catch (err) {
      setError('Failed to update candidate');
      console.error('Error updating candidate:', err);
      throw err;
    }
  };

  const deleteCandidate = async (candidateId) => {
    try {
      const response = await mockAPI.deleteCandidate(candidateId);
      if (response.success) {
        setCandidates(prev => prev.filter(c => c.id !== candidateId));
      } else {
        throw new Error('Failed to delete candidate');
      }
    } catch (err) {
      setError('Failed to delete candidate');
      console.error('Error deleting candidate:', err);
      throw err;
    }
  };

  // Load initial data
  useEffect(() => {
    Promise.all([fetchCandidates(), fetchDropdownData()]);
  }, []);

  const activeCandidates = useMemo(() => {
    // If no filters are selected, return nothing
    if (selectedFilters.length === 0) {
      return [];
    }

    // Filter candidates based on selected filter types
    return candidates.filter(candidate => {
      if (selectedFilters.includes('STC') && candidate.type === 'STC') {
        return true;
      }
      if (selectedFilters.includes('WTC') && candidate.type === 'WTC') {
        return true;
      }
      if (selectedFilters.includes('Non Railway') && candidate.type === 'Non Railway') {
        return true;
      }
      return false;
    });
  }, [candidates, selectedFilters]);

  const filteredCandidates = useMemo(() => activeCandidates.filter(candidate => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = candidate.name?.toLowerCase().includes(searchLower) ||
      (candidate.email && candidate.email.toLowerCase().includes(searchLower)) ||
      candidate.ticketNumber?.toLowerCase().includes(searchLower) ||
      candidate.serialNo?.toString().includes(searchTerm);
    const matchesBatch = !filterBatch || candidate.batch === filterBatch;

    return matchesSearch && matchesBatch;
  }), [activeCandidates, searchTerm, filterBatch]);

  // Handle inline editing update
  const handleInlineUpdate = async (candidateId, updatedData) => {
    try {
      await updateCandidate(candidateId, updatedData);
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  // Handler to open the form for editing a specific candidate
  const handleEdit = (candidate) => {
    setCandidateToEdit(candidate);
    setView('form');
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
      setView('list'); // Return to the list view
      setCandidateToEdit(null); // Reset editing state
    } catch (err) {
      // Error handling is done in the API functions
      console.error('Form submission error:', err);
    }
  };

  const handleCancelForm = () => {
    setView('list');
    setCandidateToEdit(null);
  };

  const handleDelete = async () => {
    try {
      await deleteCandidate(deleteModal.candidateId);
      setDeleteModal({ isOpen: false, candidateId: null, candidateName: "" });
    } catch (err) {
      // Error handling is done in the API function
      console.error('Delete error:', err);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBatch("");
    setSelectedFilters(["STC", "WTC", "Non Railway"]); // Reset to all filters selected
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <PageHeader
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          isListView={view === 'list'}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : view === 'list' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <StatsCards
                  candidates={activeCandidates}
                  filterType={selectedFilters.length === 1 ? selectedFilters[0] : "All"}
                  filterCategory={selectedFilters.includes("Non Railway") && !selectedFilters.includes("STC") && !selectedFilters.includes("WTC") ? "Non Railway" :
                    (!selectedFilters.includes("Non Railway") && (selectedFilters.includes("STC") || selectedFilters.includes("WTC"))) ? "Railway" : "All"}
                  mockAPI={mockAPI}
                />
                <SearchFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterBatch={filterBatch}
                  setFilterBatch={setFilterBatch}
                  dropdownData={dropdownData}
                  onClearFilters={clearFilters}
                  mockAPI={mockAPI}
                />
                <CandidateTable
                  candidates={filteredCandidates}
                  onViewDetail={setSelectedCandidate}
                  onDelete={(id, name) => setDeleteModal({ isOpen: true, candidateId: id, candidateName: name })}
                  onEdit={handleEdit} // Pass the edit handler
                  onUpdate={handleInlineUpdate} // Pass the inline update handler
                />
              </div>
              <div className="lg:col-span-1">
                <ActivityPanel
                  candidates={activeCandidates}
                  mockAPI={mockAPI}
                />
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
          onCancel={() => setDeleteModal({ isOpen: false, candidateId: null, candidateName: "" })}
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