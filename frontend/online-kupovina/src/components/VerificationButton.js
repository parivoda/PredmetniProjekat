import React from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import VerificationDetails from './VerificationDetails';
import { Button } from '@mui/material';




export default function VerificationButton() {

    const [isVerificationOpen, setIsVerificationOpen] = useState(false);

    const handleVerificationClick = () => {
        setIsVerificationOpen(true);
    };

  return (
    <>
        <Button type='button' className='border p-1 mr-3 rounded-lg
            border-blue-300 hover:border-blue-500 hover:bg-blue-300' 
            onClick={handleVerificationClick}>
            <HelpOutlineIcon />
            Check verification status
        </Button>
        {isVerificationOpen && <VerificationDetails onClose={() => setIsVerificationOpen(false)} />}
    </>
  )
}
