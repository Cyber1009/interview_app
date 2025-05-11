import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography
} from '@mui/material';

/**
 * VideoReview component
 * Displays recorded video for review before submission
 */
const VideoReview = ({ open, onClose, videoBlob, allowReRecord = true }) => {
  if (!videoBlob) {
    return null;
  }

  const videoUrl = URL.createObjectURL(videoBlob);

  const handleAction = (action) => {
    // Clean up the blob URL to prevent memory leaks
    URL.revokeObjectURL(videoUrl);
    onClose(action);
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleAction('cancel')}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Review Your Response
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
          <video
            src={videoUrl}
            controls
            style={{ width: '100%', maxHeight: '60vh' }}
            autoPlay
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Review your video response. You can re-record if needed or continue to the next question.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        {allowReRecord && (
          <Button
            variant="outlined"
            onClick={() => handleAction('re-record')}
            sx={{ mr: 1 }}
          >
            Record Again
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => handleAction('continue')}
          color="primary"
        >
          {allowReRecord ? 'Continue' : 'Next Question'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoReview;