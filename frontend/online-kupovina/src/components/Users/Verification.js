import React from "react";
import { useEffect, useState } from "react";
import { GetSellers } from "../../services/UserService";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, TablePagination } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Home from "../../pages/Home/Home";
import { VerifySeller, DeclineSeller } from "../../services/UserService";

function Verification() {
  const [sellers, setSellers] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalRows, setTotalRows] = useState(0);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

  const verification = async () => {
      try {
        const resp = await GetSellers(page, rowsPerPage);
        setSellers(resp.data);
        setTotalRows(resp.totalRows);
      } catch (error) {
        console.log(error.message);
      }
 };
  useEffect(() => {
      verification();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [page, rowsPerPage]);

  const handleAccept = async (id) => {
    try{
      console.log(id);
        await VerifySeller(id);
        console.log(id);
        // nije bilo errora pa cu samo izmeniti prikaz podataka, necu fecovati listu svih opet
        const updatedSellers = sellers.map((seller) =>
        seller.id === id ? { ...seller, verified: true, verificationStatus: true } : seller);
        setSellers(updatedSellers);
    }catch (error) {
        console.log(error.message);
    } 
 }

  const handleDecline = async (id) => {
    try{
      await DeclineSeller(id);
      const updatedSellers = sellers.filter((seller) => seller.id !== id);
      setSellers(updatedSellers);
    }catch (error) {
      console.log(error.message);
    } 
 }

 const getType = (type) => {
    if( type === 0){
      return 'Customer';
    }else{
      return 'Seller';
    }
 }

 const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 3));
  setPage(0);
};
return (
      <>
      <Home/>
      {!sellers && (<h1 className="mx-auto text-2xl font-bold pt-12">No sellers yet.</h1>)}
      {sellers && (
      <div className="pt-12 w-10/12 md:w-5/6 mx-auto">
        <div class="relative overflow-x-auto rounded-lg mx-auto">
              <table class="text-sm text-left text-gray-500 mx-auto border border-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-200">
                      <tr>
                          <th scope="col" class="px-6 py-3">
                            User
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Firstname
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Lastname
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Role
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Verified
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Status
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Action
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                  {sellers.map((seller) => (
                      <tr class="bg-gray-100  hover:bg-gray-200 ">
                          <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                              <img class="w-10 h-10 rounded-full" src={`https://localhost:5001/${seller.imageUri}`} alt="Profile"/>
                              <div class="pl-3">
                                  <div class="text-base font-semibold">{seller.username}</div>
                                  <div class="font-normal text-gray-500">{seller.email}</div>
                              </div>  
                          </th>
                          <td class="px-6 py-4">
                            {seller.firstName}
                          </td>
                          <td class="px-6 py-4">
                              <div class="flex items-center">
                                  {seller.lastName}
                              </div>
                          </td>
                          <td class="px-6 py-4">
                              <div class="flex items-center">
                                  {seller.userType}
                              </div>
                          </td>
                          <td class="px-6 py-4">
                              <div class="flex items-center">
                                  {seller.verified ? 
                                  (<div class="flex flex-row ">
                                  <div class="h-2.5 w-2.5 rounded-full m-auto bg-green-500 mr-2"></div>
                                  <p class="text-green-500">Verified</p>
                                </div>) : 
                                (<div class="flex flex-row">
                                <div class="h-2.5 w-2.5 rounded-full m-auto bg-red-500 mr-2"></div>
                                <p class="text-red-500">Unverified</p>
                                </div>)}
                              </div>
                          </td>
                          <td class="px-6 py-4">
                              <p class="font-medium">
                                {seller.verificationStatus ? 
                                (<div class="flex flex-row ">
                                  <div class="h-2.5 w-2.5 rounded-full m-auto bg-green-500 mr-2"></div>
                                  <p class="text-green-500">Finished</p>
                                </div>) : 
                                (<div class="flex flex-row">
                                  <div class="h-2.5 w-2.5 rounded-full m-auto bg-yellow-500 mr-2"></div>
                                  <p class="text-yellow-500">Pending</p>
                                  </div>)
                              }
                              </p>
                          </td>
                          <td class="px-6 py-4">
                          {!seller.verified && !seller.verificationStatus && (
                              <div class="flex items-center gap-2">
                                <button class="py-1 px-2 border border-green-500 hover:bg-green-500  text-green hover:text-white rounded" onClick={() => handleAccept(seller.id)}>Accept <CheckRoundedIcon /></button>
                                <button class="py-1 px-2 border border-red-500 hover:bg-red-500  text-red hover:text-white rounded " onClick={() => handleDecline(seller.id)}>Decline <CloseRoundedIcon /></button>
                              </div>
                          )}
                          </td>
                      </tr>
                  ))}
                  </tbody>
              </table>
          </div>
        </div>
  )} </> )}

export default Verification;