import axios from 'axios';
import React, { useState } from 'react';
//import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@material-ui/core';
import './ConfessionForm.css';
// Old import
//import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

// New import
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';


const ConfessionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    date: '',
    place: '',
    time: '',
    mobile: '',
    appointment: '',
    notes: '',
    rescheduleDate: '',
    reschedulePlace: '',
    rescheduleTime: '',
    cancelReason: ''
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Z]/.test(formData.name)) {
      newErrors.name = 'Name should start with a capital letter';
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 18 || formData.age > 60) {
      newErrors.age = 'Age should be more than 18 and less than 60';
    }

    // Gender validation
    if (!formData.gender) newErrors.gender = 'Gender is required';

    // Date validation
    if (!formData.date) newErrors.date = 'Date is required';

    // Place validation
    if (!formData.place) newErrors.place = 'Place is required';

    // Time validation
    if (!formData.time) newErrors.time = 'Time is required';

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number should be exactly 10 digits';
    }

    // Appointment validation
    if (!formData.appointment) newErrors.appointment = 'Appointment status is required';

    if (formData.appointment === 'rescheduled') {
      if (!formData.rescheduleDate) newErrors.rescheduleDate = 'Rescheduled date is required';
      if (!formData.reschedulePlace) newErrors.reschedulePlace = 'Rescheduled place is required';
      if (!formData.rescheduleTime) newErrors.rescheduleTime = 'Rescheduled time is required';
    }

    if (formData.appointment === 'cancelled' && !formData.cancelReason) {
      newErrors.cancelReason = 'Cancellation reason is required';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      axios.post('/api/confessions', formData)
        .then(response => {
          console.log(response.data);
          handleSubmitClick();
          // handle success (e.g., show a success message, clear the form, etc.)
        })
        .catch(error => {
          console.error(error);
          // handle error (e.g., show an error message)
        });
    }
  };

  const handleSubmitClick = () => {
    setPopupType('success');
    setShowPopup(true);
  };

  const handleCancelClick = () => {
    setPopupType('confirmation');
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType('');
  };

  return (
    <form className="confession-form" onSubmit={handleSubmit}>
      <Typography variant="h3" className="h3">CONFESSION</Typography>
      <div className="form-group">
        <TextField
          label="Service ID"
          value="Confession"
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </div>
      <div className="form-group">
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />
      </div>
      <div className="form-group">
        <TextField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.age}
          helperText={errors.age}
        />
      </div>
      <div className="form-group">
        <TextField
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.gender}
          helperText={errors.gender}
        />
      </div>
      <div className="form-group">
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.date}
          helperText={errors.date}
        />
      </div>
      <div className="form-group">
        <TextField
          label="Place"
          name="place"
          value={formData.place}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.place}
          helperText={errors.place}
        />
      </div>
      <div className="form-group">
        <TextField
          label="Time"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.time}
          helperText={errors.time}
        />
      </div>
      <div className="form-group">
        <TextField
          label="Mobile #"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.mobile}
          helperText={errors.mobile}
        />
      </div>
      <div className="appointment-section">
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend"><h3 className="h3">Appointment</h3></FormLabel>
          <RadioGroup name="appointment" value={formData.appointment} onChange={handleChange}>
            <FormControlLabel value="confirmed" control={<Radio />} label="Confirmed" />
            <FormControlLabel value="rescheduled" control={<Radio />} label="Re-Scheduled" />
            <FormControlLabel value="cancelled" control={<Radio />} label="Cancelled" />
          </RadioGroup>
          {errors.appointment && <Typography color="error">{errors.appointment}</Typography>}
        </FormControl>
      </div>
      {formData.appointment === 'confirmed' && (
        <div className="notes-section form-group">
          <TextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </div>
      )}
      {formData.appointment === 'rescheduled' && (
        <div className="reschedule-section">
          <div className="form-group">
            <TextField
              label="Rescheduled Date"
              name="rescheduleDate"
              type="date"
              value={formData.rescheduleDate}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.rescheduleDate}
              helperText={errors.rescheduleDate}
            />
          </div>
          <div className="form-group">
            <TextField
              label="Rescheduled Place"
              name="reschedulePlace"
              value={formData.reschedulePlace}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.reschedulePlace}
              helperText={errors.reschedulePlace}
            />
          </div>
          <div className="form-group">
            <TextField
              label="Rescheduled Time"
              name="rescheduleTime"
              type="time"
              value={formData.rescheduleTime}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.rescheduleTime}
              helperText={errors.rescheduleTime}
            />
          </div>
        </div>
      )}
      {formData.appointment === 'cancelled' && (
        <div className="cancel-section form-group">
          <TextField
            label="Cancellation Reason"
            name="cancelReason"
            value={formData.cancelReason}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={!!errors.cancelReason}
            helperText={errors.cancelReason}
          />
        </div>
      )}
      <div className="buttons">
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmitClick}>Submit</Button>
        <Button variant="contained" color="secondary" onClick={handleCancelClick}>Cancel</Button>
      </div>

      <Dialog open={showPopup} onClose={closePopup}>
        <DialogTitle>{popupType === 'success' ? 'Submission Successful!' : 'Confirmation'}</DialogTitle>
        <DialogContent>
         {popupType === 'confirmation' ? (
            <Typography>Are you sure you want to cancel?</Typography>
          ) : (
            <Typography>Your form has been submitted successfully!</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {popupType === 'confirmation' ? (
            <>
              <Button onClick={closePopup} color="primary">No</Button>
              <Button onClick={closePopup} color="primary">Yes</Button>
            </>
          ) : (
            <Button onClick={closePopup} color="primary">Close</Button>
          )}
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default ConfessionForm;