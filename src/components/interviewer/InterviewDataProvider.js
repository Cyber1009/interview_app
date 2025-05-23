import React, { useState, useEffect, useCallback } from 'react';
// Import from consolidated API structure
import { interviewerAPI } from '../../api';

/**
 * InterviewDataProvider Component - Context provider for interview data
 * 
 * Handles all interview data fetching, state management, and CRUD operations
 * Used across multiple components to provide consistent data access
 */
const InterviewDataProvider = ({ children, interviewId }) => {
  const [interviews, setInterviews] = useState([]);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the list of all interviews
  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await interviewerAPI.getAllInterviews();
      setInterviews(response.data || []);
    } catch (err) {
      console.error('Failed to load interviews:', err);
      setError('Failed to load interviews. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific interview by ID with all its questions
  const fetchInterview = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const interviewResponse = await interviewerAPI.getInterview(id);
      
      // If we need questions too, fetch them
      if (interviewResponse.data) {
        try {
          const questionsResponse = await interviewerAPI.getQuestions(id);
          const sortedQuestions = [...(questionsResponse.data || [])].sort((a, b) => a.order - b.order);
          
          setInterview({
            ...interviewResponse.data,
            questions: sortedQuestions
          });
        } catch (questionsErr) {
          console.error('Failed to load questions:', questionsErr);
          setInterview(interviewResponse.data);
        }
      } else {
        setInterview(null);
      }
    } catch (err) {
      console.error(`Failed to load interview ${id}:`, err);
      setError(`Failed to load interview details. Please try again.`);
      setInterview(null);
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
      
      // Add the new interview to the list
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

  // Update an existing interview
  const updateInterview = async (id, interviewData) => {
    if (!id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await interviewerAPI.updateInterview(id, interviewData);
      
      // Update the interview in the list
      if (response.data) {
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
      
      // Remove the interview from the list
      setInterviews(prevInterviews => 
        prevInterviews.filter(item => item.id !== id)
      );
      
      // Clear current interview if it's the one being deleted
      if (interview && interview.id === id) {
        setInterview(null);
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
      // First, get the interview to duplicate
      const sourceResponse = await interviewerAPI.getInterview(id);
      
      if (!sourceResponse.data) {
        throw new Error('Source interview not found');
      }
      
      // Create a new interview with similar data but "Copy of" prefix
      const newInterviewData = {
        title: `Copy of ${sourceResponse.data.title || 'Untitled'}`,
        description: sourceResponse.data.description || ''
      };
      
      const newInterviewResponse = await interviewerAPI.createInterview(newInterviewData);
      
      if (!newInterviewResponse.data) {
        throw new Error('Failed to create new interview');
      }
      
      const newInterviewId = newInterviewResponse.data.id;
      
      // Get questions from the source interview
      const questionsResponse = await interviewerAPI.getQuestions(id);
      
      // Add each question to the new interview
      if (questionsResponse.data && questionsResponse.data.length > 0) {
        for (const question of questionsResponse.data) {
          await interviewerAPI.addQuestion({
            interviewId: newInterviewId,
            text: question.text,
            preparation_time: question.preparation_time,
            responding_time: question.responding_time
          });
        }
      }
      
      // Add the new interview to the list
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

  // Refresh data based on the current context
  const refreshData = useCallback(() => {
    if (interviewId) {
      fetchInterview(interviewId);
    } else {
      fetchInterviews();
    }
  }, [interviewId, fetchInterview, fetchInterviews]);

  // Initialize data when component mounts or interviewId changes
  useEffect(() => {
    if (interviewId) {
      fetchInterview(interviewId);
    } else {
      fetchInterviews();
    }
  }, [interviewId, fetchInterview, fetchInterviews]);

  // Provide all interview data and operations as a single object
  const interviewData = {
    interviews,
    interview,
    loading,
    error,
    setError,
    refreshData,
    createInterview,
    updateInterview,
    deleteInterview,
    duplicateInterview
  };

  // Allow consumers to access the interview data through the children prop
  return typeof children === 'function' 
    ? children(interviewData) 
    : React.cloneElement(children, { interviewData });
};

export default InterviewDataProvider;
