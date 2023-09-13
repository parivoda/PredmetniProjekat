import React from 'react';
import { useEffect, useState } from 'react';
import { UserProfile } from '../../services/UserService';
import { Box, Typography, TextField, Button, Alert, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from '@mui/material';
import { ChangeUserProfile } from '../../services/UserService';
import EditIcon from '@mui/icons-material/Edit';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { UpdateUser } from '../../models/UpdateUserModel';
import { ChangeUserPassword } from '../../services/UserService';
import Home from '../Home/Home';

const Profile = () => {
  const [profileData, setProfileData] = useState(new UpdateUser());
  const [confirmPass, setConfirmPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const currentDate = new Date().toISOString().split('T')[0]; 

  const profile = async () => {
    try {
      const resp = await UserProfile();
      setProfileData(resp);
      const dateObject = new Date(resp.birthDate);
      const formattedDate = dateObject.toISOString().split('T')[0];
      setProfileData((prevData) => ({
        ...prevData,
        birthDate: formattedDate,
      }));
    } catch (error) {
      console.log(error.message);
    }
  
};

  useEffect(() => {
    profile();
  }, []);

  const handleSubmit = async (e) =>  {
    e.preventDefault();
    if (!validateForm(profileData)) {
        return;
      }

      const formData = new FormData();
      formData.append("email", profileData.email);
      formData.append("username", profileData.username);
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("address", profileData.address);
      formData.append("birthDate", profileData.birthDate);
      formData.append("imageUri", selectedImage);
      
      try {
        const resp = await ChangeUserProfile(formData);
        setProfileData(resp);
        const dateObject = new Date(resp.birthDate);
        const formattedDate = dateObject.toISOString().split('T')[0];
        setProfileData((prevData) => ({
        ...prevData,
        birthDate: formattedDate,
      }));
        setIsEditing(false);
  
      } catch (error) {
        console.log(error.message);
      }
  };

  const handleDecline = async(e) => {
    profile();
    setIsEditing(false);
  };

  function validateForm(user) {
    const trimmedFields = ['username', 'firstName', 'lastName', 'address'];
    const hasEmptyRequiredFields = trimmedFields.some((field) => user[field].trim() === '');

    if (hasEmptyRequiredFields) {
      setErrorMessage("Fields cannot be empty. Please try again.");
      return false;
  }
    return true;
  }

  function validatePasswords(newPass, confirmPass) {
    if(newPass !== confirmPass){
      setErrorPass("Passwords doesn't match. Try again.");
      setConfirmPass('');
      return false;
    }

    return true;
  }

  const handleEdit = () => {
    setIsEditing(true);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmPass('');
    setErrorPass('');
  };

  const handleCloseAlert = () => {
    setSuccessMessage('');
  };

  const handleChangingPass = async (e) => {
    e.preventDefault();
    if (!validatePasswords(newPass, confirmPass)) {
      return;
    }
    try {
      const resp = await ChangeUserPassword({'newPassword': newPass});
      setSuccessMessage(resp);

    } catch (error) {
      setErrorMessage(error.message);
    }
    handleClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  
return (
  <>
  <Home/>
        <div className='flex flex-col justify-center items-center pt-12'>
        {profileData && (
          <>
          <div style={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
          alt="Profile Picture"
          src={`https://localhost:5001/${profileData.imageUri}`}
          sx={{ width: 110, height: 110 }}
        />
      </div>
    <Typography variant="h6" component="h6" gutterBottom>
      Profile
      <IconButton onClick={handleEdit}>
        <EditIcon />
            </IconButton>
    </Typography>
    <form onSubmit={handleSubmit}>
    <div>{errorMessage && <Alert variant="outlined" severity="error">{errorMessage}</Alert>}</div>
    <div>{successMessage && <Alert variant="outlined" severity="success">{successMessage} <IconButton size='small' onClick={handleCloseAlert}>
        <CloseRoundedIcon />
            </IconButton></Alert>}</div>
    <div className='grid grid-cols-1 gap-3'>
      <TextField
        name="email"
        variant="filled"
        sx={{ width: "400px" }}
        label="Email"
        value={profileData.email}
        size='small'
        disabled
      />
      <TextField
        name="firstName"
        variant="filled"
        sx={{ width: "400px" }}
        label="First Name"
        value={profileData.firstName}
        onChange={(e) => setProfileData((prevUser) => ({ ...prevUser, firstName: e.target.value }))}
        size='small'
        disabled={!isEditing}
      />
      <TextField
        name="lastName"
        variant="filled"
        label="Last Name"
        sx={{ width: "400px" }}
        value={profileData.lastName}
        onChange={(e) => setProfileData((prevUser) => ({ ...prevUser, lastName: e.target.value }))}
        size='small'
        disabled={!isEditing}
      />
      <TextField
        name="username"
        variant="filled"
        label="Username"
        sx={{ width: "400px" }}
        value={profileData.username}
        onChange={(e) => setProfileData((prevUser) => ({ ...prevUser, username: e.target.value }))}
        size='small'
        disabled={!isEditing}
      />
      <TextField
        name="address"
        variant="filled"
        label="Address"
        sx={{ width: "400px" }}
        value={profileData.address}
        onChange={(e) => setProfileData((prevUser) => ({ ...prevUser, address: e.target.value }))}
        size='small'
        disabled={!isEditing}
      />
      <TextField
        variant="filled"
        name="birthDate"
        label="Date of birth"
        inputProps={{ max: currentDate }}
        sx={{ width: "400px" }}
        value={ profileData.birthDate}
        onChange={(e) => setProfileData((prevUser) => ({ ...prevUser, birthDate: e.target.value }))}
        size='small'
        type='date'
        disabled={!isEditing}
      />
      <input
        variant="filled"
        helperText="Change image"
        sx={{ width: "400px" }}
        type="file"
        disabled={!isEditing}
        InputProps={{
          inputProps: {
            accept: 'image/*',
          }}}
        onChange={handleFileChange}
      />
      {isEditing &&
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        disabled={!isEditing}
        endIcon={<CheckRoundedIcon />}
        type="submit"
        variant="outlined"
        color="success"
      >
        Apply
      </Button>
      <Button
        disabled={!isEditing}
        endIcon={<CloseRoundedIcon />}
        onClick={handleDecline}
        variant="outlined"
        color="error"
      >
        Discard
      </Button>
      </div>}
      </div>
      <div className='pt-3'>
      {profileData.registrationType === 0 && (
        <Button variant="contained" onClick={handleOpen} color="primary">
        Change password
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <div className='p-12 px-24 mx-auto'> 
        <DialogTitle>Change your password</DialogTitle>
        <DialogContent>
        {errorPass && (
          <div className='pb-2 mx-auto'>
            <Typography variant="body1" color="error">
              {errorPass}
            </Typography>
          </div>
            
          )}
          <form onSubmit={handleChangingPass} className='gap-4 mx-auto'>
            <input className='p-4 border border-blue-600 w-64 hover:border-blue-500' placeholder="New password"
            onChange={(e) => setNewPass(e.target.value)}
            variant='filled' type='password' />
            <br/>
            <input className='mt-3 p-4 border border-blue-600 w-64 hover:border-blue-500' placeholder="Confirm new password"
            onChange={(e) => setConfirmPass(e.target.value)}
            variant='filled' value={confirmPass} type='password' />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleChangingPass} type='submit' color="primary" variant="contained">
            Change
          </Button>
        </DialogActions>
        </div>
        
      </Dialog>
      </div>
    </form>
          </>
      )}

            {!profileData && (
                <>
                <h1>Loading profile..</h1>
                </>
            )}
              </div>
              </>
      );
}

export default Profile;