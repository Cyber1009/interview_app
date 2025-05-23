import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { interviewerAPI } from '../../../api';

// Create the context with initial values
const InterviewDataContext = createContext({
  interview: null,
  interviews: [],
  loading: false,
  error: null,
  currentId: null,
  currentName: null,
  createInterview: () => {},
  updateInterview: () => {},
  deleteInterview: () => {},
  duplicateInterview: () => {},
  refreshData: () => {}
});

// Custom hook to use the context
export const useInterviewData = () => {
  const context = useContext(InterviewDataContext);
  if (!context) {
    throw new Error('useInterviewData must be used within an InterviewDataProvider');
  }
  return context;
};

export const InterviewDataProvider = ({ interviewId, children }) => {
  const [interview, setInterview] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentId, setCurrentId] = useState(interviewId);
  const [currentName, setCurrentName] = useState(null);

  // When interviewId prop changes, update our state
  useEffect(() => {
    setCurrentId(interviewId);
  }, [interviewId]);

  // Fetch a single interview
  const fetchInterview = useCallback(async (identifier) => {
    if (!identifier) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const interviewResponse = await interviewerAPI.getInterview(identifier);
      
      if (interviewResponse.data) {
        // Get questions for this interview
        try {
          const questionsResponse = await interviewerAPI.getQuestions(identifier);
          const sortedQuestions = [...(questionsResponse.data || [])].sort((a, b) => a.order - b.order);
          
          const interviewData = {
            ...interviewResponse.data,
            questions: sortedQuestions
          };

          setInterview(interviewData);
          setCurrentId(interviewData.id);
          setCurrentName(interviewData.name);
        } catch (questionsErr) {
          console.error('Failed to load questions:', questionsErr);
          setInterview(interviewResponse.data);
          setCurrentId(interviewResponse.data.id);
          setCurrentName(interviewResponse.data.name);
        }
      } else {
        setInterview(null);
        setCurrentId(null);
        setCurrentName(null);
      }
    } catch (err) {
      console.error(`Failed to load interview ${identifier}:`, err);
      setError(`Failed to load interview details. Please try again.`);
      setInterview(null);
      setCurrentId(null);
      setCurrentName(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all interviews
  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await interviewerAPI.getAllInterviews();
      setInterviews(response || []);
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
      setError('Failed to load interviews. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new interview
  const createInterview = async (interviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await interviewerAPI.createInterview(interviewData);
      
      if (response.data) {
        setInterviews(prevInterviews => [...prevInterviews, response.data]);
      }
      
      return response.data;
    } catch (err) {
      console.error('Failed to create interview:', err);
      setError('Failed to create interview. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an interview
  const updateInterview = async (id, interviewData) => {
    if (!id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await interviewerAPI.updateInterview(id, interviewData);
      
      if (response.data) {
        // Update the interview in the list
        setInterviews(prevInterviews => 
          prevInterviews.map(item => 
            item.id === id ? { ...item, ...response.data } : item
          )
        );
        
        // Update the current interview if it's the one being edited
        if (interview && interview.id === id) {
          setInterview(prev => ({ ...prev, ...response.data }));
        }
      }
      
      return response.data;
    } catch (err) {
      console.error(`Failed to update interview ${id}:`, err);
      setError('Failed to update interview. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an interview
  const deleteInterview = async (id) => {
    if (!id) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await interviewerAPI.deleteInterview(id);
      
      setInterviews(prevInterviews => prevInterviews.filter(item => item.id !== id));
      
      if (interview && interview.id === id) {
        setInterview(null);
        setCurrentId(null);
        setCurrentName(null);
      }
      
      return true;
    } catch (err) {
      console.error(`Failed to delete interview ${id}:`, err);
      setError('Failed to delete interview. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Duplicate an interview
  const duplicateInterview = async (id) => {
    if (!id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const sourceResponse = await interviewerAPI.getInterview(id);
      
      if (!sourceResponse.data) {
        throw new Error('Source interview not found');
      }
      
      const newInterviewData = {
        title: `Copy of ${sourceResponse.data.title || 'Untitled'}`,
        description: sourceResponse.data.description || ''
      };
      
      const newInterviewResponse = await interviewerAPI.createInterview(newInterviewData);
      
      if (!newInterviewResponse.data) {
        throw new Error('Failed to create new interview');
      }
      
      const questionsResponse = await interviewerAPI.getQuestions(id);
      
      if (questionsResponse.data && questionsResponse.data.length > 0) {
        for (const question of questionsResponse.data) {
          await interviewerAPI.addQuestion({
            interviewId: newInterviewResponse.data.id,
            text: question.text,
            preparation_time: question.preparation_time,
            responding_time: question.responding_time
          });
        }
      }
      
      await fetchInterviews();
      
      return newInterviewResponse.data;
    } catch (err) {
      console.error(`Failed to duplicate interview ${id}:`, err);
      setError('Failed to duplicate interview. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (interviewId) {
      fetchInterview(interviewId);
    } else {
      fetchInterviews();
    }
  }, [interviewId, fetchInterview, fetchInterviews]);

  const contextValue = {
    interview,
    interviews,
    loading,
    error,
    currentId,
    currentName,
    createInterview,
    updateInterview,
    deleteInterview,
    duplicateInterview,
    refreshData: fetchInterviews
  };

  return (
    <InterviewDataContext.Provider value={contextValue}>
      {children}
    </InterviewDataContext.Provider>
  );
};

export default InterviewDataProvider;