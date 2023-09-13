import { React, useState } from "react";
import Alert from '@mui/material/Alert';
import LoginIcon from '@mui/icons-material/Login';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { TextField, Button, Link, Typography, rgbToHex} from '@mui/material';
import Box from '@mui/material/Box';
import { UserLogin } from "../../models/UserLoginModel";
import { LoginUser } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from "../../redux/userSlice";
import { useEffect } from 'react';
import { RegisterUserWithGoogle } from "../../services/UserService";
import { GetUserRole, GetUserVerification } from "../../utils/CurrentUser";
import { blue } from "@mui/material/colors";


function Login() {
  const [user, setLoginUser] = useState(new UserLogin());
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    /*global google*/
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    const handleCallbackResponse = async (response) => {
      try {
        const resp = await RegisterUserWithGoogle({'googleToken': response.credential});
        dispatch(setUser({ token: resp.token, role: GetUserRole(resp.token) }));
        navigate('/');
  
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    script.onload = () => {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse,
      });
      google.accounts.id.renderButton(document.getElementById('signInDiv'), {
        theme: 'outline',
        size: 'large',
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm(user)) {
      return;
    }
    try {
      const resp = await LoginUser(user);
      dispatch(setUser({ token: resp.token, role: GetUserRole(resp.token), isVerified: GetUserVerification(resp.token) }));
      navigate('/');

    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setLoginUser((prevUser) => ({ ...prevUser, email: '', password: ''}))
    }
  };

  function validateForm(user){
    if(user.email.trim() === '' || user.password.trim() === ''){
      setErrorMessage('Please fill out all required fields.');
      return false;
    }

    return true;
  }

  return (
  <div className="bg-gray-300 pt-12 pb-24">
    <div className="flex flex-col items-center justify-center h-1/2 w-fit mx-auto rounded p-12 gap-3 bg-white border-gray-400">
      <h4 className="font-bold text-4xl text-gray-700 mb-12">
        WELCOME BACK!
      </h4>
        <form onSubmit={handleLogin} className="flex flex-col items-center justify-center h-1/2 gap-8">
          {errorMessage && (
          <Alert variant="outlined" severity="error" size="small">
            {errorMessage}
          </Alert>)}
          <input
            required
            id="email"
            label="Email"
            value={user.email}
            placeholder="Email"
            className="w-96 p-3 border rounded-lg border-gray-900"
            onChange={(e) =>
              setLoginUser((prevUser) => ({ ...prevUser, email: e.target.value }))
            }
          />
          <input
            id="password"
            required
            label="Password"
            type="password"
            placeholder="Password"
            value={user.password}
            className="w-96 p-3 border rounded-lg border-gray-900"
            onChange={(e) =>
              setLoginUser((prevUser) => ({ ...prevUser, password: e.target.value }))
            }
          />
          <button
            variant="outlined"
            className="border border-gray-700 mt-2 py-2 px-5 rounded hover:border-gray-900"
            type="submit"
          >
            Log in  <LoginIcon />
          </button>
        </form>
        <div className="mt-2 font-bold">
          <Link href="/registration">
            Don't have an account? Sign up!
          </Link>
        </div>
        <Typography sx={{ mt: 2 }}>
          Or
        </Typography>
      <div id="signInDiv"></div>
    </div>  
  </div>
  );
}
export default Login;