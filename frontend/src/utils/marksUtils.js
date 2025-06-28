// Utility functions for handling marks calculations and data

// Mock trainee marks data - in real app, this would come from backend
export const mockTraineeMarksData = {
  1: { // Rahul Sharma - MSE-C
    course: 'MSE-C',
    marks: {
      'Session 1-Paper 1': 75,
      'Session 1-Paper 2': 82,
      'Session 1-Practical': 45,
      'Session 2-Paper 1': 55,
      'Session 2-Paper 2': 78,
      'Session 2-Practical': 42,
    },
    savedSessions: ['Session 1', 'Session 2'],
    supplementStatus: {
      'Session 1-Practical': true,
      'Session 2-Paper 1': false,
      'Session 2-Practical': false,
    }
  },
  2: { // Priya Singh - MJR-D
    course: 'MJR-D',
    marks: {
      'Session 1-Paper 1': 88,
      'Session 1-Paper 2': 92,
      'Session 1-Practical': 47,
      'Session 2-Paper 1': 65,
      'Session 2-Paper 2': 58,
      'Session 2-Practical': 35,
    },
    savedSessions: ['Session 1', 'Session 2'],
    supplementStatus: {
      'Session 1-Practical': true,
      'Session 2-Paper 2': false,
      'Session 2-Practical': true,
    }
  },
  3: { // Amit Kumar - MSE-C
    course: 'MSE-C',
    marks: {
      'Session 1-Paper 1': 95,
      'Session 1-Paper 2': 87,
      'Session 1-Practical': 48,
      'Session 2-Paper 1': 72,
      'Session 2-Paper 2': 89,
      'Session 2-Practical': 46,
      'Session 3-Paper 1': 78,
      'Session 3-Paper 2': 25,
    },
    savedSessions: ['Session 1', 'Session 2'],
    supplementStatus: {
      'Session 3-Paper 2': false,
    }
  },
  4: { // Sneha Patel - MJR-C
    course: 'MJR-C',
    marks: {
      'Session 1-Paper 1': 91,
      'Session 1-Paper 2': 85,
      'Session 1-Practical': 49,
    },
    savedSessions: ['Session 1'],
    supplementStatus: {}
  },
  6: { // Anita Verma - MJI-C
    course: 'MJI-C',
    marks: {
      'Session 1-Paper 1': 68,
      'Session 1-Paper 2': 72,
      'Session 1-Paper 3': 55,
      'Session 1-Paper 4': 78,
      'Session 1-Paper 5': 45,
      'Session 1-Paper 6': 82,
      'Session 1-Paper 7': 75,
    },
    savedSessions: ['Session 1'],
    supplementStatus: {
      'Session 1-Paper 3': true,
      'Session 1-Paper 5': false,
    }
  }
}

// Calculate overall marks from session marks
export const calculateOverallMarks = (traineeId) => {
  const traineeData = mockTraineeMarksData[traineeId]
  if (!traineeData || !traineeData.marks) {
    return { theory: 0, practical: 0, overall: 0 }
  }

  const marks = traineeData.marks
  let theoryTotal = 0, theoryCount = 0
  let practicalTotal = 0, practicalCount = 0
  let overallTotal = 0, overallCount = 0

  Object.entries(marks).forEach(([key, value]) => {
    if (key.includes('Paper') || key.includes('Interview')) {
      theoryTotal += value
      theoryCount++
    } else if (key.includes('Practical')) {
      practicalTotal += value
      practicalCount++
    }
    overallTotal += value
    overallCount++
  })

  const theory = theoryCount > 0 ? Math.round(theoryTotal / theoryCount) : 0
  const practical = practicalCount > 0 ? Math.round(practicalTotal / practicalCount) : 0
  const overall = overallCount > 0 ? Math.round(overallTotal / overallCount) : 0

  return { theory, practical, overall }
}

// Get trainee marks data by ID
export const getTraineeMarksData = (traineeId) => {
  return mockTraineeMarksData[traineeId] || null
}

// Check if trainee has any marks data
export const hasMarksData = (traineeId) => {
  return !!mockTraineeMarksData[traineeId]
}

// Get completion percentage for a trainee
export const getCompletionPercentage = (traineeId, courseStructure) => {
  const traineeData = mockTraineeMarksData[traineeId]
  if (!traineeData || !traineeData.marks) return 0

  const totalPossibleMarks = Object.keys(traineeData.marks).length
  const completedMarks = Object.values(traineeData.marks).filter(mark => mark > 0).length
  
  return totalPossibleMarks > 0 ? Math.round((completedMarks / totalPossibleMarks) * 100) : 0
}
