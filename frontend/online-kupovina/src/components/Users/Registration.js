import { React, useState } from "react";
import { RegisterUser } from "../../services/UserService";
import { TextField, Button, MenuItem, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import { User } from "../../models/UserModel";
import Alert from '@mui/material/Alert';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from "../../redux/userSlice";
import { GetUserRole, GetUserVerification } from "../../utils/CurrentUser";

function Registration() {

  const [user, setRegisterUser] = useState(new User());
  const [confirmPass, setConfirmPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const currentDate = new Date().toISOString().split('T')[0]; 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function validateForm(user, confirmPass) {
    if (user.password !== confirmPass) {
      setErrorMessage('Passwords does not match. Try again!');
      setRegisterUser((prevUser) => ({ ...prevUser, password: '' }));
      setConfirmPass('');
      return false; 
    }
    const trimmedFields = ['email', 'username', 'firstName', 'lastName', 'address'];
    const hasEmptyRequiredFields = trimmedFields.some((field) => user[field].trim() === '');

    if (hasEmptyRequiredFields) {
      setErrorMessage("Please fill in all required fields.");
      return false;
  }
    return true;
  }

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!validateForm(user, confirmPass)) {
      return;
    }
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('username', user.username);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('address', user.address);
    formData.append('userType', user.userType);
    formData.append('birthDate', user.birthDate);
    formData.append('password', user.password);
    formData.append('imageUri', selectedFile);

    try {
      const resp = await RegisterUser(formData);
      dispatch(setUser({ token: resp.token, role: GetUserRole(resp.token), isVerified: GetUserVerification(resp.token) }));
      navigate('/');
      
    } catch (error) {
      setErrorMessage(error.message);
      setRegisterUser((prevUser) => ({ ...prevUser, email: '' }))
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const imageUri = URL.createObjectURL(file);
    setRegisterUser((prevUser) => ({ ...prevUser, imageUri }));
  };


  return (
    <div >
    <form onSubmit={handleRegistration} >
    
    <div className="flex flex-col justify-center items-center py-24 bg-gray-300">
        <h4 className="font-bold text-2xl md:text-4xl mx-auto">Register a new account:</h4>
        <div className="py-6">
          {errorMessage && <Alert variant="outlined" severity="error">{errorMessage}</Alert>}
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 bg-white p-8 rounded-lg border border-gray-400">

       
      
        <TextField
          required
          id="email"
          label="Email"
          variant="filled"
          size="small"
          value={user.email}
          onChange={(e) => setRegisterUser((prevUser) => ({ ...prevUser, email: e.target.value }))}
        />
        <TextField
          id="username"
          required
          label="Username"
          variant="filled"
          size="small"
          value={user.username}
          onChange={(e) => setRegisterUser((prevUser) => ({ ...prevUser, username: e.target.value }))}
        />
        <TextField
          id="firstName"
          required
          label="Firstname"
          variant="filled"
          size="small"
          value={user.firstName}
          onChange={(e) => setRegisterUser((prevUser) => ({ ...prevUser, firstName: e.target.value }))}
        />
        <TextField
          id="lastName"
          required
          label="Lastname"
          variant="filled"
          size="small"
          value={user.lastName}
          onChange={(e) => setRegisterUser((prevUser) => ({ ...prevUser, lastName: e.target.value }))}
        />
        <TextField
          id="address"
          required
          label="Address"
          variant="filled"
          size="small"
          value={user.address}
          onChange={(e) => setRegisterUser((prevUser) => ({ ...prevUser, address: e.target.value }))}
        />
        <TextField
          id="birthDate"
          required
          label="Date of birth"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="filled"
          size="small"
          value={user.birthDate}
          inputProps={{ max: currentDate }}
          onChange={(e) => setRegisterUser((prevUser) => ({ ...prevUser, birthDate: e.target.value }))}
        />
        <TextField
        helperText="Upload Image"
        type="file"
        InputProps={{
          inputProps: {
            accept: 'image/*',
          },
          startAdornment: selectedFile && (
            <img
              src={user.imageUri}
              alt="Selected"
              style={{ width: '20px', height: '20px', objectFit: 'cover' }}
            />
          ),
        }}
        onChange={handleFileChange}
      />
        <TextField
          id="userType"
          select
          helperText="Please select your type"
          variant="filled"
          size="small"
          value={user.userType}
          onChange={(e) => setRegisterUser((prevUser) => ({ ...prevUser, userType: e.target.value }))}
        ><MenuItem value={0}>Customer</MenuItem>
        <MenuItem value={1}>Seller</MenuItem>
        </TextField>
      <TextField
          id="password"
          required
          label="Password"
          variant="filled"
          type="password"
          size="small"
          value={user.password}
          onChange={(e) => setRegisterUser((prevUser) => ({ ...prevUser, password: e.target.value }))}
        />
        <TextField
          id="confirmPass"
          required
          label="Confirm password"
          variant="filled"
          type="password"
          size="small"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
        <div></div>
        <button
          variant="outlined"
          className="border border-gray-700 mt-2 py-2 px-5 rounded hover:border-gray-900"
          type="submit"
        >
          Register  <LoginIcon />
        </button>
        </div>
      
        
    </div>
    </form>
    </div>
  );
}

export default Registration;