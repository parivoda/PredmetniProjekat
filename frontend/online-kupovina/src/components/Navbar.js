import {AppBar, Toolbar, Box } from '@mui/material';
import {Button, IconButton,Dialog, DialogTitle, DialogContent, Typography, DialogActions} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import DensitySmallRoundedIcon from '@mui/icons-material/DensitySmallRounded';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import Login from '../components/Users/Login';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import BallotIcon from '@mui/icons-material/Ballot';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';
import PendingIcon from '@mui/icons-material/Pending';
import VerificationButton from './VerificationButton';


export default function Navbar() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
    };
    
  return (
    <>
        {user.token === null && (
          <>
          <Login/>
          </>
        )}
    {user.token !== null && (
    <nav class="bg-white border border-gray-200 ">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <ul class="flex flex-col gap-3 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
        <li>
          <Button component={Link} to="/profile">Profile <PersonRoundedIcon/></Button>
        </li>
        {user.role === 'Administrator' && (
          <div class="flex flex-row gap-3">
          <li>
            <Button component={Link} to="/verification">Verification <CheckBoxRoundedIcon/></Button>
          </li>
          <li>
            <Button component={Link} to="/all-orders">All Orders <DensitySmallRoundedIcon/></Button>
          </li>
        </div>
        )}
        {user.role === 'Customer' && (
        <div class="flex flex-row gap-3">
          <li>
            <Button component={Link} to="/all-articles">Articles <ListAltIcon/></Button>
          </li>
          <li>
            <Button component={Link} to="/customer-orders">Previous Orders <HistoryIcon/></Button>
          </li>
          <li>
          <Button component={Link} to="/pending-orders">Pending Orders <PendingIcon/></Button>
          </li>
        </div>
        )}
        {user.role === 'Seller' && (
          <div class="flex flex-row gap-3">
                <li>
                  <Button disabled={user.isVerified === 'False'} component={Link} to="/seller-articles">My Articles <ListAltIcon/></Button>
                </li>
                <li>
                  <Button disabled={user.isVerified === 'False'} component={Link} to="/seller-orders">My Orders <BallotIcon/></Button>
                </li>
                <li>
                  <Button disabled={user.isVerified === 'False'} component={Link} to="/new-orders">New Orders <FiberNewIcon/></Button>
                </li>
                <li>
                  <Button disabled={user.isVerified === 'False'} component={Link} to="/map">Pending Orders <LocationOnIcon/></Button>
                </li>
          </div>
        )}
        <div class="flex flex-row gap-3">
        <li>
          {user.role === 'Seller' && (
            <VerificationButton />
          )}
          {user.role === 'Customer' && (
                   <Link to="/cart">
                   <IconButton aria-label="cart">
                       <ShoppingCartIcon />
                   </IconButton>
                 </Link>
          )}
        </li>
        <li>
            <Button color="inherit" onClick={handleLogout}>
              Logout <ExitToAppIcon />
            </Button>
        </li>
        </div>
        </ul>
      </div>
    </nav>
    )}         
   </>
  )
}
