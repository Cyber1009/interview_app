/**
 * Mock Service Implementation
 * Provides temporary data for development and testing
 */

// Generate a random ID
const generateId = () => Math.floor(Math.random() * 10000);

// Get mock data from localStorage or create default data
const getMockData = (key, defaultData) => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

// Save mock data to localStorage
const saveMockData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

// Default interviews
const defaultInterviews = [
  {
    id: 1,
    title: "Frontend Developer Interview",
    description: "Technical interview for frontend developer position",
    status: "active",
    createdAt: "2025-04-20T10:00:00Z",
    duration: 30,
    maxQuestions: 5,
    questionCount: 3,
    tokenCount: 5,
    responseCount: 2
  },
  {
    id: 2,
    title: "Product Manager Interview",
    description: "Interview for product management candidates",
    status: "draft",
    createdAt: "2025-04-21T14:30:00Z",
    duration: 45,
    maxQuestions: 7,
    questionCount: 0,
    tokenCount: 0,
    responseCount: 0
  }
];

// Default questions for each interview
const defaultQuestions = {
  1: [
    {
      id: 101,
      text: "Describe your experience with React.js",
      preparationTime: 60,
      recordingTime: 180,
      interviewId: 1,
      order: 0
    },
    {
      id: 102,
      text: "How do you approach responsive design?",
      preparationTime: 45,
      recordingTime: 120,
      interviewId: 1,
      order: 1
    },
    {
      id: 103,
      text: "Explain your debugging process for a frontend issue",
      preparationTime: 60,
      recordingTime: 180,
      interviewId: 1,
      order: 2
    }
  ],
  2: []
};

// Default tokens for each interview
const defaultTokens = {
  1: [
    {
      id: 201,
      value: "FD8A7B",
      interviewId: 1,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      used: false
    },
    {
      id: 202,
      value: "C93D4E",
      interviewId: 1,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      used: true
    },
    {
      id: 203,
      value: "76GH23",
      interviewId: 1,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      used: false
    },
    {
      id: 204,
      value: "K8L53P",
      interviewId: 1,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      used: false
    },
    {
      id: 205,
      value: "M4N9Q7",
      interviewId: 1,
      expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      used: false
    }
  ],
  2: []
};

// Default results for each interview
const defaultResults = {
  1: [
    {
      id: 301,
      candidateName: "John Smith",
      token: "C93D4E",
      interviewId: 1,
      startedAt: "2025-04-21T10:15:00Z",
      completedAt: "2025-04-21T10:43:00Z",
      duration: 28,
      score: 8,
      totalQuestions: 3,
      answeredQuestions: 3,
      isStarred: true,
      answers: [
        {
          questionId: 101,
          questionText: "Describe your experience with React.js",
          videoUrl: "https://example.com/videos/john_q1.mp4",
          transcription: "I have been working with React for 3 years now in production environments..."
        },
        {
          questionId: 102,
          questionText: "How do you approach responsive design?",
          videoUrl: "https://example.com/videos/john_q2.mp4",
          transcription: "I typically start with a mobile-first approach and use media queries..."
        },
        {
          questionId: 103,
          questionText: "Explain your debugging process for a frontend issue",
          videoUrl: "https://example.com/videos/john_q3.mp4",
          transcription: "When debugging frontend issues, I first check the console for errors..."
        }
      ]
    },
    {
      id: 302,
      candidateName: "Alice Johnson",
      token: "FD8A7B",
      interviewId: 1,
      startedAt: "2025-04-22T14:00:00Z",
      completedAt: "2025-04-22T14:25:00Z",
      duration: 25,
      score: 7,
      totalQuestions: 3,
      answeredQuestions: 3,
      isStarred: false,
      answers: [
        {
          questionId: 101,
          questionText: "Describe your experience with React.js",
          videoUrl: "https://example.com/videos/alice_q1.mp4",
          transcription: "I've been using React professionally for about 2 years now..."
        },
        {
          questionId: 102,
          questionText: "How do you approach responsive design?",
          videoUrl: "https://example.com/videos/alice_q2.mp4",
          transcription: "I use a combination of flexbox, grid, and media queries..."
        },
        {
          questionId: 103,
          questionText: "Explain your debugging process for a frontend issue",
          videoUrl: "https://example.com/videos/alice_q3.mp4",
          transcription: "I start by reproducing the issue and then use browser dev tools..."
        }
      ]
    }
  ],
  2: []
};

// Mock interview API implementation
export const mockInterviewAPI = {
  // Interview management
  getAllInterviews: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const interviews = getMockData('mockInterviews', defaultInterviews);
        resolve({ data: interviews });
      }, 300);
    });
  },
  
  getInterview: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const interviews = getMockData('mockInterviews', defaultInterviews);
        const interview = interviews.find(i => i.id === parseInt(id, 10));
        
        if (interview) {
          resolve({ data: interview });
        } else {
          reject({ message: 'Interview not found' });
        }
      }, 200);
    });
  },
  
  createInterview: (interviewData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const interviews = getMockData('mockInterviews', defaultInterviews);
        const newInterview = {
          ...interviewData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          questionCount: 0,
          tokenCount: 0,
          responseCount: 0
        };
        
        const updatedInterviews = [...interviews, newInterview];
        saveMockData('mockInterviews', updatedInterviews);
        
        // Initialize empty lists for the new interview
        const questionsMap = getMockData('mockQuestions', defaultQuestions);
        questionsMap[newInterview.id] = [];
        saveMockData('mockQuestions', questionsMap);
        
        const tokensMap = getMockData('mockTokens', defaultTokens);
        tokensMap[newInterview.id] = [];
        saveMockData('mockTokens', tokensMap);
        
        const resultsMap = getMockData('mockResults', defaultResults);
        resultsMap[newInterview.id] = [];
        saveMockData('mockResults', resultsMap);
        
        resolve({ data: newInterview });
      }, 300);
    });
  },
  
  updateInterview: (id, interviewData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const interviews = getMockData('mockInterviews', defaultInterviews);
        const index = interviews.findIndex(i => i.id === parseInt(id, 10));
        
        if (index !== -1) {
          const updatedInterview = {
            ...interviews[index],
            ...interviewData
          };
          interviews[index] = updatedInterview;
          saveMockData('mockInterviews', interviews);
          resolve({ data: updatedInterview });
        } else {
          reject({ message: 'Interview not found' });
        }
      }, 200);
    });
  },
  
  deleteInterview: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const interviews = getMockData('mockInterviews', defaultInterviews);
        const filteredInterviews = interviews.filter(i => i.id !== parseInt(id, 10));
        
        if (interviews.length !== filteredInterviews.length) {
          saveMockData('mockInterviews', filteredInterviews);
          
          // Clean up related data
          const questionsMap = getMockData('mockQuestions', defaultQuestions);
          delete questionsMap[id];
          saveMockData('mockQuestions', questionsMap);
          
          const tokensMap = getMockData('mockTokens', defaultTokens);
          delete tokensMap[id];
          saveMockData('mockTokens', tokensMap);
          
          const resultsMap = getMockData('mockResults', defaultResults);
          delete resultsMap[id];
          saveMockData('mockResults', resultsMap);
          
          resolve({ data: { message: 'Interview deleted successfully' } });
        } else {
          reject({ message: 'Interview not found' });
        }
      }, 200);
    });
  },
  
  // Get interview results
  getInterviewResults: (interviewId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const resultsMap = getMockData('mockResults', defaultResults);
        const results = resultsMap[interviewId] || [];
        resolve({ data: results });
      }, 200);
    });
  },
  
  getResultDetail: (resultId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultsMap = getMockData('mockResults', defaultResults);
        let foundResult = null;
        
        Object.values(resultsMap).forEach(interviewResults => {
          const result = interviewResults.find(r => r.id === parseInt(resultId, 10));
          if (result) {
            foundResult = result;
          }
        });
        
        if (foundResult) {
          resolve({ data: foundResult });
        } else {
          reject({ message: 'Result not found' });
        }
      }, 200);
    });
  },
  
  deleteResult: (resultId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultsMap = getMockData('mockResults', defaultResults);
        let found = false;
        
        // Find and remove the result
        const updatedResultsMap = {...resultsMap};
        Object.keys(updatedResultsMap).forEach(interviewId => {
          const results = updatedResultsMap[interviewId];
          const index = results.findIndex(r => r.id === parseInt(resultId, 10));
          
          if (index !== -1) {
            updatedResultsMap[interviewId] = results.filter(r => r.id !== parseInt(resultId, 10));
            found = true;
          }
        });
        
        if (found) {
          saveMockData('mockResults', updatedResultsMap);
          resolve({ data: { message: 'Result deleted successfully' } });
        } else {
          reject({ message: 'Result not found' });
        }
      }, 200);
    });
  },
  
  updateResultStatus: (resultId, statusData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultsMap = getMockData('mockResults', defaultResults);
        let found = false;
        
        // Find and update the result
        const updatedResultsMap = {...resultsMap};
        Object.keys(updatedResultsMap).forEach(interviewId => {
          const results = updatedResultsMap[interviewId];
          const index = results.findIndex(r => r.id === parseInt(resultId, 10));
          
          if (index !== -1) {
            updatedResultsMap[interviewId][index] = {
              ...updatedResultsMap[interviewId][index],
              ...statusData
            };
            found = true;
          }
        });
        
        if (found) {
          saveMockData('mockResults', updatedResultsMap);
          resolve({ data: { message: 'Result status updated successfully' } });
        } else {
          reject({ message: 'Result not found' });
        }
      }, 200);
    });
  }
};

// Mock question API implementation
export const mockQuestionAPI = {
  getQuestionsByInterview: (interviewId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const questionsMap = getMockData('mockQuestions', defaultQuestions);
        const questions = questionsMap[interviewId] || [];
        resolve({ data: questions });
      }, 200);
    });
  },
  
  addQuestion: (questionData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { interviewId, ...data } = questionData;
        const questionsMap = getMockData('mockQuestions', defaultQuestions);
        const questions = questionsMap[interviewId] || [];
        
        const newQuestion = {
          ...data,
          id: generateId(),
          interviewId: parseInt(interviewId, 10),
          order: questions.length
        };
        
        questionsMap[interviewId] = [...questions, newQuestion];
        saveMockData('mockQuestions', questionsMap);
        
        // Update interview's question count
        const interviews = getMockData('mockInterviews', defaultInterviews);
        const index = interviews.findIndex(i => i.id === parseInt(interviewId, 10));
        if (index !== -1) {
          interviews[index].questionCount = (interviews[index].questionCount || 0) + 1;
          saveMockData('mockInterviews', interviews);
        }
        
        resolve({ data: newQuestion });
      }, 300);
    });
  },
  
  updateQuestion: (id, questionData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const questionsMap = getMockData('mockQuestions', defaultQuestions);
        let found = false;
        
        // Find and update the question
        const updatedQuestionsMap = {...questionsMap};
        Object.keys(updatedQuestionsMap).forEach(interviewId => {
          const questions = updatedQuestionsMap[interviewId];
          const index = questions.findIndex(q => q.id === parseInt(id, 10));
          
          if (index !== -1) {
            updatedQuestionsMap[interviewId][index] = {
              ...updatedQuestionsMap[interviewId][index],
              ...questionData
            };
            found = true;
          }
        });
        
        if (found) {
          saveMockData('mockQuestions', updatedQuestionsMap);
          resolve({ data: { message: 'Question updated successfully' } });
        } else {
          reject({ message: 'Question not found' });
        }
      }, 200);
    });
  },
  
  deleteQuestion: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const questionsMap = getMockData('mockQuestions', defaultQuestions);
        let found = false;
        let interviewIdOfDeletedQuestion = null;
        
        // Find and remove the question
        const updatedQuestionsMap = {...questionsMap};
        Object.keys(updatedQuestionsMap).forEach(interviewId => {
          const questions = updatedQuestionsMap[interviewId];
          const index = questions.findIndex(q => q.id === parseInt(id, 10));
          
          if (index !== -1) {
            updatedQuestionsMap[interviewId] = questions.filter(q => q.id !== parseInt(id, 10));
            found = true;
            interviewIdOfDeletedQuestion = interviewId;
          }
        });
        
        if (found && interviewIdOfDeletedQuestion) {
          saveMockData('mockQuestions', updatedQuestionsMap);
          
          // Update interview's question count
          const interviews = getMockData('mockInterviews', defaultInterviews);
          const index = interviews.findIndex(i => i.id === parseInt(interviewIdOfDeletedQuestion, 10));
          if (index !== -1) {
            interviews[index].questionCount = Math.max(0, (interviews[index].questionCount || 0) - 1);
            saveMockData('mockInterviews', interviews);
          }
          
          resolve({ data: { message: 'Question deleted successfully' } });
        } else {
          reject({ message: 'Question not found' });
        }
      }, 200);
    });
  },
  
  reorderQuestions: (interviewId, questionIds) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const questionsMap = getMockData('mockQuestions', defaultQuestions);
        const questions = questionsMap[interviewId];
        
        if (!questions) {
          reject({ message: 'Interview not found' });
          return;
        }
        
        // Create a map of id to question object
        const questionMap = {};
        questions.forEach(q => {
          questionMap[q.id] = q;
        });
        
        // Create reordered array
        const reorderedQuestions = questionIds.map((id, index) => {
          const question = questionMap[id];
          if (!question) {
            return null;
          }
          return {
            ...question,
            order: index
          };
        }).filter(Boolean);
        
        if (reorderedQuestions.length !== questions.length) {
          reject({ message: 'Invalid question IDs provided' });
          return;
        }
        
        questionsMap[interviewId] = reorderedQuestions;
        saveMockData('mockQuestions', questionsMap);
        
        resolve({ data: { message: 'Questions reordered successfully' } });
      }, 200);
    });
  }
};

// Mock token API implementation
export const mockTokenAPI = {
  getTokensByInterview: (interviewId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tokensMap = getMockData('mockTokens', defaultTokens);
        const tokens = tokensMap[interviewId] || [];
        resolve({ data: tokens });
      }, 200);
    });
  },
  
  generateToken: (interviewId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tokensMap = getMockData('mockTokens', defaultTokens);
        const tokens = tokensMap[interviewId] || [];
        
        // Generate random token
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let tokenValue = '';
        for (let i = 0; i < 6; i++) {
          tokenValue += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const newToken = {
          id: generateId(),
          value: tokenValue,
          interviewId: parseInt(interviewId, 10),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          used: false
        };
        
        tokensMap[interviewId] = [...tokens, newToken];
        saveMockData('mockTokens', tokensMap);
        
        // Update interview's token count
        const interviews = getMockData('mockInterviews', defaultInterviews);
        const index = interviews.findIndex(i => i.id === parseInt(interviewId, 10));
        if (index !== -1) {
          interviews[index].tokenCount = (interviews[index].tokenCount || 0) + 1;
          saveMockData('mockInterviews', interviews);
        }
        
        resolve({ data: newToken });
      }, 300);
    });
  },
  
  generateBulkTokens: (interviewId, count) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tokensMap = getMockData('mockTokens', defaultTokens);
        const tokens = tokensMap[interviewId] || [];
        const newTokens = [];
        
        // Generate random tokens
        for (let j = 0; j < count; j++) {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let tokenValue = '';
          for (let i = 0; i < 6; i++) {
            tokenValue += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          
          const newToken = {
            id: generateId(),
            value: tokenValue,
            interviewId: parseInt(interviewId, 10),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            used: false
          };
          
          newTokens.push(newToken);
        }
        
        tokensMap[interviewId] = [...tokens, ...newTokens];
        saveMockData('mockTokens', tokensMap);
        
        // Update interview's token count
        const interviews = getMockData('mockInterviews', defaultInterviews);
        const index = interviews.findIndex(i => i.id === parseInt(interviewId, 10));
        if (index !== -1) {
          interviews[index].tokenCount = (interviews[index].tokenCount || 0) + count;
          saveMockData('mockInterviews', interviews);
        }
        
        resolve({ data: newTokens });
      }, 300);
    });
  },
  
  deleteToken: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tokensMap = getMockData('mockTokens', defaultTokens);
        let found = false;
        let interviewIdOfDeletedToken = null;
        
        // Find and remove the token
        const updatedTokensMap = {...tokensMap};
        Object.keys(updatedTokensMap).forEach(interviewId => {
          const tokens = updatedTokensMap[interviewId];
          const index = tokens.findIndex(t => t.id === parseInt(id, 10));
          
          if (index !== -1) {
            updatedTokensMap[interviewId] = tokens.filter(t => t.id !== parseInt(id, 10));
            found = true;
            interviewIdOfDeletedToken = interviewId;
          }
        });
        
        if (found && interviewIdOfDeletedToken) {
          saveMockData('mockTokens', updatedTokensMap);
          
          // Update interview's token count
          const interviews = getMockData('mockInterviews', defaultInterviews);
          const index = interviews.findIndex(i => i.id === parseInt(interviewIdOfDeletedToken, 10));
          if (index !== -1) {
            interviews[index].tokenCount = Math.max(0, (interviews[index].tokenCount || 0) - 1);
            saveMockData('mockInterviews', interviews);
          }
          
          resolve({ data: { message: 'Token deleted successfully' } });
        } else {
          reject({ message: 'Token not found' });
        }
      }, 200);
    });
  }
};

// Mock config API implementation
export const mockConfigAPI = {
  getConfig: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const config = localStorage.getItem('mockConfig');
        if (config) {
          const parsedConfig = JSON.parse(config);
          
          // Transform to match the backend schema
          const backendFormat = {
            rate_limits: {
              interview: parsedConfig.interviewDuration || 30,
              questions: parsedConfig.questionsPerInterview || 5,
              retries: parsedConfig.maxRetries || 3
            },
            feature_flags: {
              autoEndInterview: parsedConfig.autoEndInterview !== undefined ? parsedConfig.autoEndInterview : true,
              recordVideo: parsedConfig.recordVideo !== undefined ? parsedConfig.recordVideo : true
            },
            timeouts: {
              default: 30000
            },
            storage_paths: {
              recordings: '/uploads/recordings'
            }
          };
          
          resolve({ data: backendFormat });
        } else {
          const defaultConfig = {
            rate_limits: {
              interview: 30,
              questions: 5,
              retries: 3
            },
            feature_flags: {
              autoEndInterview: true,
              recordVideo: true
            },
            timeouts: {
              default: 30000
            },
            storage_paths: {
              recordings: '/uploads/recordings'
            }
          };
          
          localStorage.setItem('mockConfig', JSON.stringify({
            interviewDuration: 30,
            questionsPerInterview: 5,
            autoEndInterview: true,
            recordVideo: true,
            maxRetries: 3
          }));
          
          resolve({ data: defaultConfig });
        }
      }, 200);
    });
  },
  
  updateConfig: (configData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store in frontend format for compatibility
        localStorage.setItem('mockConfig', JSON.stringify(configData));
        
        // Transform to backend format for response
        const backendFormat = {
          rate_limits: {
            interview: configData.interviewDuration || 30,
            questions: configData.questionsPerInterview || 5,
            retries: configData.maxRetries || 3
          },
          feature_flags: {
            autoEndInterview: configData.autoEndInterview !== undefined ? configData.autoEndInterview : true,
            recordVideo: configData.recordVideo !== undefined ? configData.recordVideo : true
          }
        };
        
        resolve({ data: backendFormat });
      }, 200);
    });
  }
};