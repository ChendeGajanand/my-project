import { Mic } from "@mui/icons-material";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function WorshipApp() {
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [date3, setDate3] = useState(null);
  const [savedAudio, setSavedAudio] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioTracks, setAudioTracks] = useState({
    audio1: { blob: null, url: null },
    audio2: { blob: null, url: null },
    audio3: { blob: null, url: null },
  });

  useEffect(() => {
    fetchSavedAudio();
  }, []);

  const fetchSavedAudio = async () => {
    try {
      const response = await axios.get('http://localhost:8080/schedule/save'); // Replace with your API endpoint
      setSavedAudio(response.data);
    } catch (error) {
      console.error('Error fetching saved audio:', error);
    }
  };

  const saveAudioData = async () => {
    try {
      const payload = {
        date1,
        date2,
        date3,
        audio1: audioTracks.audio1.blob,
        audio2: audioTracks.audio2.blob,
        audio3: audioTracks.audio3.blob
      };
      await axios.post('/api/audio', payload); // Replace with your API endpoint
      fetchSavedAudio(); // Refresh the audio list after saving
    } catch (error) {
      console.error('Error saving audio data:', error);
    }
  };

  const startRecording = (track) => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioURL = URL.createObjectURL(audioBlob);
          setAudioTracks(prevTracks => ({
            ...prevTracks,
            [track]: { blob: audioBlob, url: audioURL }
          }));
          setIsRecording(false);
        });

        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000); // Stop recording after 5 seconds
      });
  };

  const deleteAudio = (index) => {
    setSavedAudio(savedAudio.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ border: 1, borderColor: 'black' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} sx={{ bgcolor: '#ffd700', border: 1, borderColor: 'black', textAlign: 'center' }}>
                <Typography variant="h5" color="black">WORSHIP</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {/* Record Audio 1 */}
            <TableRow>
              <TableCell sx={{ border: 1, borderColor: 'black' }}>
                <Typography variant="h6">Record Audio 1</Typography>
              </TableCell>
              <TableCell sx={{ border: 1, borderColor: 'black' }}>
                <IconButton onClick={() => startRecording('audio1')} disabled={isRecording}>
                  <Mic />
                </IconButton>
                {audioTracks.audio1.url && <audio src={audioTracks.audio1.url} controls />}
              </TableCell>
              <TableCell sx={{ border: 1, borderColor: 'black' }} />
            </TableRow>

            {/* Record Audio 2 */}
            <TableRow>
              <TableCell sx={{ border: 1, borderColor: 'black' }}>
                <Typography variant="h6">Record Audio 2</Typography>
              </TableCell>
              <TableCell sx={{ border: 1, borderColor: 'black' }}>
                <IconButton onClick={() => startRecording('audio2')} disabled={isRecording}>
                  <Mic />
                </IconButton>
                {audioTracks.audio2.url && <audio src={audioTracks.audio2.url} controls />}
              </TableCell>
              <TableCell sx={{ border: 1, borderColor: 'black' }} />
            </TableRow>

            {/* Record Audio 3 */}
            <TableRow>
              <TableCell sx={{ border: 1, borderColor: 'black' }}>
                <Typography variant="h6">Record Audio 3</Typography>
              </TableCell>
              <TableCell sx={{ border: 1, borderColor: 'black' }}>
                <IconButton onClick={() => startRecording('audio3')} disabled={isRecording}>
                  <Mic />
                </IconButton>
                {audioTracks.audio3.url && <audio src={audioTracks.audio3.url} controls />}
              </TableCell>
              <TableCell sx={{ border: 1, borderColor: 'black' }} />
            </TableRow>

            {/* Saved Audio */}
            <TableRow>
              <TableCell sx={{ border: 1, borderColor: 'black' }}>
                <Typography variant="h6">Saved Audio</Typography>
              </TableCell>
              <TableCell sx={{ border: 1, borderColor: 'black' }} colSpan={2}>
                {savedAudio.map((audio, index) => (
                  <div key={index}>
                    <audio src={audio.url} controls />
                    <Button variant="contained" onClick={() => deleteAudio(index)}>Delete</Button>
                  </div>
                ))}
              </TableCell>
            </TableRow>

            {/* Schedule */}
            <TableRow>
              <TableCell sx={{ border: 1, borderColor: 'black' }}>
                <Typography variant="h6">Schedule</Typography>
              </TableCell>
              <TableCell sx={{ border: 1, borderColor: 'black' }} colSpan={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography>Current</Typography>
                      <DatePicker
                        label="Date"
                        value={date1}
                        onChange={(newValue) => setDate1(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <TimePicker
                        label="Time"
                        value={date1}
                        onChange={(newValue) => setDate1(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography>Date 1</Typography>
                      <DatePicker
                        label="Date"
                        value={date2}
                        onChange={(newValue) => setDate2(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <TimePicker
                        label="Time"
                        value={date2}
                        onChange={(newValue) => setDate2(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography>Date 2</Typography>
                      <DatePicker
                        label="Date"
                        value={date3}
                        onChange={(newValue) => setDate3(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <TimePicker
                        label="Time"
                        value={date3}
                        onChange={(newValue) => setDate3(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </TableCell>
            </TableRow>

            {/* Save & Send */}
            <TableRow>
              <TableCell sx={{ border: 1, borderColor: 'black' }} colSpan={3} align="right">
                <Button variant="contained" color="success" onClick={saveAudioData}>Save & Send</Button>
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default WorshipApp;
