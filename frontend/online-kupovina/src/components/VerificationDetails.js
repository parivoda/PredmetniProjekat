import React from 'react'
import { GetStatus } from '../services/UserService';
import { useState, useEffect } from 'react';
import {Dialog, DialogTitle, DialogContent, Typography} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';



export default function VerificationDetails({ onClose, onAddItem }) {

    const [verificationStatus, setVerificationStatus] = useState();
    const [finishedVerification, setFinishedVerification] = useState();
    const [errorMessage, setErrorMessage] = useState(false);
    const [open, setOpen] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');

      const handleClose = () => {
        setOpen(false);
        onClose();
      };

    const checkVerification = async () => {
        try{
          const resp = await GetStatus();
          setVerificationStatus(resp.verified);
          setFinishedVerification(resp.verificationStatus);
          setOpen(true);
        }catch(error){
          console.log(error.message);
        }
      };
    useEffect(() => {
        if (open) {
            checkVerification();
        }
        }, [open]);


  return (
        <Dialog open={open} onClose={onClose}>
        <div className='px-36 py-12'>
        <div className='flex flex-col justify-center items-center'>
        {verificationStatus ? <CheckBoxRoundedIcon/> : <HighlightOffIcon/>}
        <DialogTitle>Verification Status </DialogTitle>

        <p className='text-2xl'>{verificationStatus ? 
        (" You are verified ") 
        : 
        ("You are not verified" ) }
        </p>

        <DialogContent>

        <Typography>{finishedVerification ? "Status: FINISHED" : "Status: PENDING" }</Typography>
        </DialogContent>

        <button type='button' className='border p-2 mr-3 rounded-lg border-blue-300 hover:border-blue-500 hover:bg-blue-100' onClick={handleClose}>Close</button>
        </div>

        </div>
    </Dialog>
  )
}
