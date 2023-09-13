import Home from "../../pages/Home/Home";
import { AcceptOrder, DeclineOrder, GetSellerOrders } from "../../services/OrderService";
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from "@mui/material";
import SellerDetails from "./SellerDetails";
import { OrderInfoModel } from "../../models/OrderInfoModel";

function SellerNewOrders(){
    const [orders, setOrders] = useState(new OrderInfoModel());
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [remainingTimes, setRemainingTimes] = useState({});
    const [info, setInfo] = useState('');

    const getNewOrders = async () => {
        try {
          const resp = await GetSellerOrders(true);
          setOrders(resp);
        } catch (error) {
          setInfo(error.message);
        }
      
    };
    
      useEffect(() => {
        getNewOrders();
      }, []);

      const calculateRemainingTime = (deliveryTime) => {
        const currentTime = new Date();
        const targetTime = new Date(deliveryTime);
        const timeDifference = targetTime.getTime() - currentTime.getTime();
      
        if (timeDifference > 0) {
          const remainingDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const remainingHours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
          const remainingMinutes = Math.floor((timeDifference / 1000 / 60) % 60);
          const remainingSeconds = Math.floor((timeDifference / 1000) % 60);
          return `${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
        } else {
          return "Delivered!";
        }
      };

      const formatDate = (date) => {
        const dateTime = new Date(date);
        const formattedDateTime = dateTime.toLocaleString();
        return formattedDateTime;
      }

      const handleAcceptOrder = async (orderid) => {
        try {
              const resp = await AcceptOrder(orderid);
              setInfo(resp);
            } catch (error) {
              setInfo(error.message);
            }
        };

      const handleDeclineOrder = async (orderid) => {
        try {
              const resp = await DeclineOrder(orderid);
              setInfo(resp);
            } catch (error) {
              setInfo(error.message);
            }
        };

      const handleOpenDialog = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenDialog(true);
      };
    
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };

      useEffect(() => {
        const updateRemainingTimes = () => {
          if (orders.length > 0) {
            const updatedTimes = {};
            orders.forEach((order) => {
              if (!order.isDelivered) {
                const remainingTime = calculateRemainingTime(order.deliveryTime);
                updatedTimes[order.id] = remainingTime;
              }
            });
            setRemainingTimes(updatedTimes);
          }
        };
    
        updateRemainingTimes();
    
        const timer = setInterval(() => {
          updateRemainingTimes();
        }, 1000);
    
        return () => {
          clearInterval(timer);
        };
      }, [orders]);

    return (
        <>
        <Home/>
        <div className="pt-12 w-10/12 md:w-5/6 mx-auto">
          {info && <h3 class="pl-12 pt-3 mx-auto text-2xl">{info}</h3>}
        {!orders && (<p>Loading...</p>)}
        {orders.length > 0 && (
            <>

            

            <div class="relative overflow-x-auto rounded-lg mx-auto">
              <h3>New orders</h3>
                  <table class="text-sm text-left text-gray-500  mx-auto border border-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-200 ">
                          <tr>
                              <th scope="col" class="px-6 py-3">
                                Purchaser
                              </th>
                              <th scope="col" class="px-6 py-3">
                                Ordering time
                              </th>
                              <th scope="col" class="px-6 py-3">
                                Estimated Delivery Time
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Delivery Address
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Remaining Time
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Total Price
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Status
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Details
                              </th>
                              
                          </tr>
                      </thead>
                      <tbody>
                      {orders.map((order) => (
                          <tr class="bg-gray-100  hover:bg-gray-200 ">
                              <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                  <img class="w-10 h-10 rounded-full" src={`https://localhost:5001/${order.customerImage}`} alt="Profile"/>
                                  <div class="pl-3">
                                      <div class="text-base font-semibold">{order.customer}</div>
                                      <div class="font-normal text-gray-500">{order.customer.email}</div>
                                  </div>  
                              </th>
                              <td class="px-6 py-4">
                                {formatDate(order.orderingTime)}
                              </td>
                              <td class="px-6 py-4">
                                  <div class="flex items-center">
                                      {formatDate(order.deliveryTime)}
                                  </div>
                              </td>
                              <td class="px-6 py-4">
                                  <div class="flex items-center">
                                      {order.deliveryAddress}
                                  </div>
                              </td>
                              <td class="px-6 py-4">
                                <div>
                                    {remainingTimes[order.id] && <span>{remainingTimes[order.id]}</span>}
                                </div>
                              </td>
                              <td class="px-6 py-4">
                                  <div class="flex items-center">
                                      {order.totalPrice} RSD
                                  </div>
                              </td>
                              <td class="px-6 py-4">
                                  <p class="font-medium">
                                    {order.status === 2 ? 
                                    (<div class="flex flex-row ">
                                    <div class="h-2.5 w-2.5 rounded-full m-auto bg-red-500 mr-2"></div>
                                    <p class="text-red-500">Canceled</p>
                                   </div>) : 
                                    order.isDelivered ? 
                                    (<div class="flex flex-row ">
                                      <div class="h-2.5 w-2.5 rounded-full m-auto bg-green-500 mr-2"></div>
                                      <p class="text-green-500">Delivered</p>
                                     </div>): 
                                    (<div class="flex flex-row ">
                                    <div class="h-2.5 w-2.5 rounded-full m-auto bg-yellow-500 mr-2"></div>
                                    <p class="text-yellow-500">Delivering..</p>
                                   </div>)}
                                  </p>
                              </td>
                              <td class="px-6 py-4">
                                  <div class="flex items-center">
                                      <button class="p-2 border border-blue-500 hover:bg-blue-500 hover:border-white text-black hover:text-white rounded " onClick={() => handleOpenDialog(order.id)}>Details</button>
                                  </div>
                              </td>
                              
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </div>
            
            <SellerDetails
              open={openDialog}
              handleClose={handleCloseDialog}
              orderId={selectedOrderId}
            />
            </>
        )}
            </div>
        
        </>
    );
}

export default SellerNewOrders;