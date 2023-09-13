import Home from "../../pages/Home/Home";
import { GetAllOrders } from "../../services/OrderService";
import { useEffect, useState } from "react";
import { OrderInfoModel } from "../../models/OrderInfoModel";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from "@mui/material";
import OrderDetails from "../../pages/Order/Details/OrderDetails";

function AllOrders(){
    const [orders, setOrders] = useState(new OrderInfoModel());
    const [errorMessage, setErrorMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const getAllOrders = async () => {
        try {
          const resp = await GetAllOrders();
          setOrders(resp);
        } catch (error) {
          setErrorMessage(error.message);
          console.log(error.message);
        }
      };
    
      useEffect(() => {
        getAllOrders();
      }, []);

      const formatDate = (date) => {
        const dateTime = new Date(date);
        const formattedDateTime = dateTime.toLocaleString();
        return formattedDateTime;
      }

      const handleOpenDialog = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenDialog(true);
      };
    
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };

    return (
        <>
        <Home/>
        {!orders && (<p>Loading...</p>)}
        {errorMessage && <h3 class="pl-12 pt-3 mx-auto text-2xl">{errorMessage}</h3>}
        {orders.length > 0 && (
            <>
            <div className="pt-12 w-10/12 md:w-5/6 mx-auto">
            <div class="relative overflow-x-auto rounded-lg mx-auto">
                  
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
                                  Total Price
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
                                  <div class="flex items-center">
                                      {order.totalPrice}
                                  </div>
                              </td>
                              <td class="px-6 py-4">
                                  <p class="font-medium text-start">
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
            </div>
            
            <OrderDetails
              open={openDialog}
              handleClose={handleCloseDialog}
              orderId={selectedOrderId}
            />
            </>
        )}
        </>
    );
}

export default AllOrders;