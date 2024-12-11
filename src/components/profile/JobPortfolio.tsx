//@ts-nocheck
import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  IconButton, 
  Card, 
  CardMedia, 
  CardContent,
  Chip,
  Box
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  VideoFile as VideoFileIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { i } from 'react-router/dist/production/route-data-DuV3tXo2';
import toast from 'react-hot-toast';

const JobPortfolio = ({ 
  open,
  onClose,
  onSave,
  isEdit = false, 
  initialData = null 
}) => {
  const [jobDetails, setJobDetails] = useState({
    title: initialData?.jobHistory.jobTitle || '',
    description: initialData?.jobHistory.description || '',
    dateCompleted: initialData?.jobHistory.dateCompleted || null,
    clientName: initialData?.jobHistory.clientName || '',
    clientUsername: initialData?.jobHistory.clientUsername || '',
    images: initialData?.images || [],
    videos: initialData?.videos || []
  });

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleFileUpload = (fileType) => {
    const inputRef = fileType === 'image' ? imageInputRef : videoInputRef;
    inputRef.current.click();
  };

  const handleFileChange = (event, fileType) => {
    const files = Array.from(event.target.files);
    const newFiles = [];
  
    files.forEach(file => {
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = () => {
          setJobDetails(prev => ({
            ...prev,
            images: [...prev.images, { file, preview: reader.result }]
          }));
        };
        reader.readAsDataURL(file);
      } else {
        newFiles.push({ file });
      }
    });
  
    if (fileType !== 'image') {
      setJobDetails(prev => ({
        ...prev,
        [fileType + 's']: [...prev[fileType + 's'], ...newFiles]
      }));
    }
  };

  const removeFile = (index, fileType) => {
    setJobDetails(prev => ({
      ...prev,
      [fileType + 's']: prev[fileType + 's'].filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested client object
    if (name.startsWith('client.')) {
      const clientField = name.split('.')[1];
      setJobDetails(prev => ({
        ...prev,
        client: {
          ...prev.client,
          [clientField]: value
        }
      }));
    } else {
      setJobDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  

  const handleSave = () => {
    // Validate and save job details
    const jobHistory = {
      jobTitle: jobDetails.title,
      description: jobDetails.description,
      dateCompleted: jobDetails.dateCompleted,
      clientName: jobDetails.clientName,
      clientUsername: jobDetails.clientUsername,
      images: jobDetails.images,
      videos: jobDetails.videos
    }
    
    if (onSave) {
      onSave(jobHistory);
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          border: '2px solid #333366'
        }
      }}
    >
      <DialogTitle sx={{ backgroundColor: '#f0f0f0', color: '#333366' }}>
        {isEdit ? "Edit Job Portfolio" : "Add Job to Portfolio"}
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Job Details */}
          <Grid size={{xs:12, md:6}}>
            <TextField
              fullWidth
              label="Job Title"
              name="title"
              value={jobDetails.title}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Job Description"
              name="description"
              value={jobDetails.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date Completed"
                value={jobDetails.dateCompleted}
                onChange={(newValue) => 
                  setJobDetails(prev => ({
                    ...prev, 
                    dateCompleted: newValue
                  }))
                }
                renderInput={(params) => 
                  <TextField 
                    {...params} 
                    fullWidth 
                    variant="outlined" 
                    sx={{ mb: 2 }}
                  />
                }
              />
            </LocalizationProvider>
          </Grid>

          {/* Client Details */}
          <Grid size={{ xs:12, md:6}}>
            <TextField
              fullWidth
              label="Client Name"
              name="clientName"
              value={jobDetails.clientName}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Client Username"
              name="clientUsername"
              value={jobDetails.clientUsername}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Image Upload */}
          <Grid size={12}>
            <Box 
              display="flex" 
              alignItems="center" 
              mb={2}
            >
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Job Images
              </Typography>
              <input
                type="file"
                ref={imageInputRef}
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, 'image')}
              />
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ImageIcon />}
                onClick={() => handleFileUpload('image')}
              >
                Upload Images
              </Button>
            </Box>

            <Grid container spacing={2}>
              {jobDetails.images.map((image, index) => (
                <Grid item key={index}>
                  <Card sx={{ width: 150, position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={image.preview}
                      alt={`Job Image ${index + 1}`}
                    />
                    <IconButton
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 5, 
                        right: 5, 
                        backgroundColor: 'rgba(255,255,255,0.7)' 
                      }}
                      onClick={() => removeFile(index, 'image')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Video Upload */}
          <Grid size={12}>
            <Box 
              display="flex" 
              alignItems="center" 
              mb={2}
            >
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Job Videos
              </Typography>
              <input
                type="file"
                ref={videoInputRef}
                hidden
                accept="video/*"
                multiple
                onChange={(e) => handleFileChange(e, 'video')}
              />
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<VideoFileIcon />}
                onClick={() => handleFileUpload('video')}
              >
                Upload Videos
              </Button>
            </Box>

            <Grid container spacing={2}>
              {jobDetails.videos.map((video, index) => (
                <Grid item key={index}>
                  <Card sx={{ width: 250, position: 'relative' }}>
                    <CardMedia
                      component="video"
                      controls
                      src={video.preview}
                      height="150"
                    />
                    <IconButton
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 5, 
                        right: 5, 
                        backgroundColor: 'rgba(255,255,255,0.7)' 
                      }}
                      onClick={() => removeFile(index, 'video')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose} 
          color="secondary" 
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ 
            backgroundColor: '#333366', 
            color: 'white',
            '&:hover': { backgroundColor: '#262659' } 
          }}
        >
          {isEdit ? 'Update Portfolio' : 'Save Portfolio'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobPortfolio;