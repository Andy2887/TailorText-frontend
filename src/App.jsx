import { Box, Container, Typography, TextField, Button, CircularProgress, Paper, Divider } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import './App.css'
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [emailContent, setEmailContent] = useState('')
  const [context, setContext] = useState('')
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setGeneratedEmail('')
    setCopied(false)

    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', 
        { emailContent, context })
      console.log(response)
      
      // Since the response is a string, use response.data directly
      setGeneratedEmail(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 3, 
        px: { xs: 2, sm: 3 },
        height: '100%'
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          bgcolor: '#fff',
          border: '1px solid #dadce0',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2.5 
        }}>
          <EmailIcon sx={{ 
            fontSize: 28, 
            mr: 1.5, 
            color: '#1a73e8' 
          }} />
          <Typography 
            variant='h5' 
            component='h1' 
            sx={{ 
              color: '#202124',
              fontWeight: 500,
              letterSpacing: '-0.25px'
            }}
          >
            Email Generator
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            label="Original Email Content"
            placeholder="Paste the original email you want to respond to..."
            value={emailContent || ''}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ 
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1a73e8',
                  borderWidth: '2px'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#1a73e8'
              }
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            label="Context & Instructions (Optional)"
            placeholder="Provide any context or specific instructions (e.g., 'Politely decline the invitation')"
            value={context || ''}
            onChange={(e) => setContext(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1a73e8',
                  borderWidth: '2px'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#1a73e8'
              }
            }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
          size="large"
          sx={{ 
            mb: 3,
            bgcolor: '#1a73e8',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '4px',
            py: 1.25,
            '&:hover': {
              bgcolor: '#1765cc'
            },
            '&.Mui-disabled': {
              bgcolor: '#e8eaed',
              color: '#bdc1c6'
            }
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Generate Email'}
        </Button>

        {error && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 1, 
              bgcolor: '#fce8e6',
              border: '1px solid #fad2cf'
            }}
          >
            <Typography sx={{ color: '#c5221f', fontSize: '0.875rem' }}>
              {error}
            </Typography>
          </Paper>
        )}

        {generatedEmail && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 500,
                  color: '#202124' 
                }}
              >
                Generated Email
              </Typography>
              <Divider sx={{ flex: 1, ml: 2 }} />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              value={generatedEmail}
              InputProps={{
                readOnly: true,
                sx: { 
                  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#dadce0'
                  }
                }
              }}
              sx={{ mb: 2 }}
            />
            <Button 
              variant='contained' 
              color={copied ? 'success' : 'primary'}
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                bgcolor: copied ? '#0f9d58' : '#1a73e8',
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: copied ? '#0c8043' : '#1765cc'
                }
              }}
            >
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  )
}

export default App