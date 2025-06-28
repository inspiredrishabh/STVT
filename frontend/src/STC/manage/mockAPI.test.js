// Mock API Test - Demonstrates all the mock backend endpoints
// This file can be used to verify that all mock API functions work correctly




// Gupta ke samjhne ke liye hai




// Copy the MockBackendAPI class from CandidateManagementPage.jsx for testing
class MockBackendAPI {
  constructor() {
    this.storageKey = 'stc_candidates_test_data';
    this.init();
  }

  init() {
    // Clear existing test data
    localStorage.removeItem(this.storageKey);

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

  async delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getInitialCandidates() {
    return [
      {
        id: 1,
        name: "Test User",
        email: "test@example.com",
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
      }
    ];
  }

  async fetchCandidates() {
    await this.delay();
    const data = this.getData();
    return { success: true, data: data.candidates };
  }

  async createCandidate(candidateData) {
    await this.delay();
    const data = this.getData();

    const workInfo = candidateData.workInfo;
    const counter = data.counters[workInfo] || 1;
    const ticketNumber = `${workInfo}${counter.toString().padStart(5, '0')}`;

    const newCandidate = {
      ...candidateData,
      id: data.lastId + 1,
      ticketNumber,
      serialNo: data.lastId + 1000,
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
      updatedAt: new Date().toISOString()
    };

    data.candidates[index] = updatedCandidate;
    this.saveData(data);
    return { success: true, data: updatedCandidate };
  }

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

  async getDropdownData() {
    await this.delay(50);
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

// Test functions
async function testMockAPI() {
  console.log('🧪 Testing Mock Backend API...\n');

  const api = new MockBackendAPI();

  try {
    // Test 1: Fetch candidates
    console.log('1. Testing fetchCandidates...');
    const fetchResult = await api.fetchCandidates();
    console.log('✅ Fetch successful:', fetchResult.data.length, 'candidates');

    // Test 2: Create candidate
    console.log('\n2. Testing createCandidate...');
    const newCandidate = {
      name: "New Test User",
      email: "newtest@example.com",
      workInfo: "AJE",
      batch: "2024-2025",
      stream: "Railway",
      type: "STC",
      category: "Railway"
    };
    const createResult = await api.createCandidate(newCandidate);
    console.log('✅ Create successful:', createResult.data.ticketNumber);

    // Test 3: Update candidate
    console.log('\n3. Testing updateCandidate...');
    const updateResult = await api.updateCandidate(createResult.data.id, {
      name: "Updated Test User",
      status: "Inactive"
    });
    console.log('✅ Update successful:', updateResult.data.name);

    // Test 4: Get stats
    console.log('\n4. Testing getStats...');
    const statsResult = await api.getStats({ category: "Railway" });
    console.log('✅ Stats successful:', statsResult.data);

    // Test 5: Get dropdown data
    console.log('\n5. Testing getDropdownData...');
    const dropdownResult = await api.getDropdownData();
    console.log('✅ Dropdown data successful:', dropdownResult.data.batches);

    // Test 6: Delete candidate
    console.log('\n6. Testing deleteCandidate...');
    const deleteResult = await api.deleteCandidate(createResult.data.id);
    console.log('✅ Delete successful');

    // Verify deletion
    const finalFetch = await api.fetchCandidates();
    console.log('✅ Final verification:', finalFetch.data.length, 'candidates');

    console.log('\n🎉 All tests passed! Mock API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Cleanup
    localStorage.removeItem('stc_candidates_test_data');
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testMockAPI = testMockAPI;
  window.MockBackendAPI = MockBackendAPI;

  console.log('🔧 Mock API test loaded. Run testMockAPI() in the console to test all endpoints.');
}

export { MockBackendAPI, testMockAPI };
