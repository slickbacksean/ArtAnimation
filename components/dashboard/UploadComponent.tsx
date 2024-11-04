import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import logger from '@/lib/logger';
import { DetectedObject } from '@/types/animation';
import { Button, Typography, Box, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

interface UploadComponentProps {
  onUploadSuccess: (results: DetectedObject[], imageUrl: string) => void;
}

const Input = styled('input')({
  display: 'none',
});

const UploadComponent: React.FC<UploadComponentProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size exceeds 10MB limit');
        return;
      }
      setFile(selectedFile);
    }
  }, []);

  const handleUpload = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    setLoading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<{ results: DetectedObject[], filename: string }>(
        'http://localhost:5000/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
            setProgress(percentCompleted);
          }
        }
      );

      const imageUrl = `http://localhost:5000/uploads/${response.data.filename}`;
      onUploadSuccess(response.data.results, imageUrl);
      toast.success('File uploaded successfully');
      logger.info(`File uploaded: ${response.data.filename}`);
    } catch (error) {
      logger.error('Error uploading file:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Upload failed: ${error.response.data.error || 'Unknown error'}`);
      } else {
        toast.error('Error uploading file. Please try again.');
      }
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [file, onUploadSuccess]);

  return (
    <Box component="form" onSubmit={handleUpload} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h6">Upload Image</Typography>
      <label htmlFor="contained-button-file">
        <Input
          accept="image/*"
          id="contained-button-file"
          type="file"
          onChange={handleFileChange}
          disabled={loading}
        />
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={loading}
        >
          Choose File
        </Button>
      </label>
      {file && (
        <Typography variant="body2">
          Selected file: {file.name}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || !file}
      >
        {loading ? 'Uploading...' : 'Upload and Detect Objects'}
      </Button>
      {loading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </Box>
  );
};

export default UploadComponent;