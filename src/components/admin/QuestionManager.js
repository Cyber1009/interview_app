import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Grid, Card, CardContent, TextField,
    List, ListItem, ListItemText, ListItemSecondaryAction, IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { questionAPI } from '../../services/api';

const QuestionManager = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ text: '', category: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await questionAPI.getQuestions();
            setQuestions(response.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        }
    };

    const handleAddQuestion = async () => {
        try {
            await questionAPI.addQuestion(newQuestion);
            setNewQuestion({ text: '', category: '' });
            fetchQuestions();
        } catch (error) {
            console.error('Failed to add question:', error);
        }
    };

    const handleUpdateQuestion = async (id, updatedQuestion) => {
        try {
            await questionAPI.updateQuestion(id, updatedQuestion);
            setEditingId(null);
            fetchQuestions();
        } catch (error) {
            console.error('Failed to update question:', error);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await questionAPI.deleteQuestion(id);
            fetchQuestions();
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 4 }}>Interview Questions</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <TextField
                                fullWidth
                                label="Question Text"
                                value={newQuestion.text}
                                onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Category"
                                value={newQuestion.category}
                                onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddQuestion}
                            >
                                Add Question
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <List>
                        {questions.map((question) => (
                            <ListItem key={question.id}>
                                {editingId === question.id ? (
                                    <Box sx={{ width: '100%' }}>
                                        <TextField
                                            fullWidth
                                            value={question.text}
                                            onChange={(e) => handleUpdateQuestion(question.id, {
                                                ...question,
                                                text: e.target.value
                                            })}
                                        />
                                    </Box>
                                ) : (
                                    <ListItemText
                                        primary={question.text}
                                        secondary={question.category}
                                    />
                                )}
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => setEditingId(question.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteQuestion(question.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Box>
    );
};

export default QuestionManager;
