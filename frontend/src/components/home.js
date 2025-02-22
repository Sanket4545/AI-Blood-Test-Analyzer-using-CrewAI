import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, Typography, TextField, CircularProgress, Box, Grid, List, ListItem, ListItemText } from '@mui/material';
import { CloudUpload, Chat, Description, Search, FlashOn, Psychology } from '@mui/icons-material';
import axios from 'axios';

const SmartLabReports = () => {
  const uploadSectionRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  // const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const features = [
    { icon: <CloudUpload fontSize="large" color="primary" />, title: "Easy Upload", description: "Drag and drop or click to upload your lab report PDF." },
    { icon: <Psychology fontSize="large" color="primary" />, title: "AI Analysis", description: "Advanced AI processes your medical data instantly." },
    { icon: <Search fontSize="large" color="primary" />, title: "Smart Insights", description: "Get detailed explanations and insights about your test results." },
    { icon: <FlashOn fontSize="large" color="primary" />, title: "Quick Answers", description: "Ask questions and receive instant, accurate responses." }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (uploadedFile) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("response.data.report: ", response.data.report);

      setReportData(response.data.report);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);  // Move this before the try block
  
    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", {
        question,
        report: reportData, // Sending both question and report
      });
      console.log("res.data.response: ", res.data.answer);
      
      setResponse(res.data.answer);
      console.log("response: ", response);
    } catch (error) {
      setResponse("Error fetching response");
    } finally {
      setLoading(false);  // Ensure loading is set to false in finally block
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
      <Box sx={{ backgroundColor: 'white', padding: '16px', boxShadow: 1, marginBottom: '24px' }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          <Description sx={{ verticalAlign: 'middle', marginRight: '8px' }} />
          SmartLabReports
        </Typography>
      </Box>

      <Box textAlign="center" marginBottom={5}>
        <Typography variant="h4" fontWeight="bold">
          Understand Your Lab Results with AI
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" maxWidth="600px" margin="auto" marginTop={2}>
          Upload your blood test report and get AI-powered insights in plain language.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          startIcon={<CloudUpload />}
          onClick={() => {
            // Reset state variables
            setFile(null);
            setIsLoading(false);
            setReportData(null);
            setQuestion('');
            setChatHistory([]);
            setResponse('');

            // Scroll to the upload section
            uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Upload Your Report
        </Button>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ textAlign: 'center', padding: '16px' }}>
              <CardContent>
                {feature.icon}
                <Typography variant="h6" marginTop={1}>{feature.title}</Typography>
                <Typography variant="body2" color="textSecondary">{feature.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box 
  ref={uploadSectionRef} 
  marginTop={5} 
  textAlign="center"
  sx={{ 
    width: '60%',
    mx: 'auto',
    p: 3,
    borderRadius: 2,
    bgcolor: '#f9f9f9',
    boxShadow: reportData ? 1 : 0,
    border: reportData ? 'none' : '3px dashed #1976d2',
  }}
>
  {reportData ? (
    <Box padding={3} bgcolor="white" borderRadius={2} boxShadow={1} textAlign="left">
    <Typography variant="h5" fontWeight="bold" color="primary">
      AI-Generated Health Report
    </Typography>
    <Box sx={{ maxHeight: "400px", overflowY: "auto", marginTop: 2, padding: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
      {reportData.split("\n\n").map((section, index) => {
        const formattedText = section.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        if (section.trim().startsWith("•")) {
          return (
            <List key={index} sx={{ pl: 2 }}>
              {section.split("\n").map((item, i) => (
                <ListItem key={i} sx={{ color: "#1976d2" }}>
                  <ListItemText primary={<Typography component="span" dangerouslySetInnerHTML={{ __html: item }} />} />
                </ListItem>
              ))}
            </List>
          );
        }
        return <Typography key={index} variant="body1" sx={{ marginBottom: 1 }} dangerouslySetInnerHTML={{ __html: formattedText }} />;
      })}
    </Box>

    {/* Input field for questions */}
    <Box mt={3}>
      <TextField
        fullWidth
        label="Ask a question about the report"
        variant="outlined"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAskQuestion} 
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Asking..." : "Ask AI"}
      </Button>
    </Box>

    {/* Response Display */}
    {response && (
      <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={1}>
        <Typography variant="h6" fontWeight="bold" color="primary">AI Response:</Typography>
        <Typography variant="body1" mt={1}>{response}</Typography>
      </Box>
    )}
  </Box>
  ) : (
    <>
      <input type="file" accept="application/pdf" onChange={handleFileChange} hidden id="file-upload" />
      <label htmlFor="file-upload">
        <Button 
          variant="outlined" 
          component="span" 
          startIcon={<CloudUpload />}
          sx={{ fontSize: 18, padding: '12px 24px' }}
        >
          {file ? `Uploaded: ${file.name}` : 'Choose a PDF'}
        </Button>
      </label>
    </>
  )}
</Box>



      {isLoading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <CircularProgress color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default SmartLabReports;
