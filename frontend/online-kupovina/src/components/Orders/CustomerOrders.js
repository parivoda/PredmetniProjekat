import Home from "../../pages/Home/Home";
import { CustomersOrders, CancelOrder } from "../../services/OrderService";
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Snackbar } from "@mui/material";
import OrderDetails from "../../pages/Order/Details/OrderDetails";

function CustomerOrders() {
    const [allOrders, setAllOrders] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [remainingTimes, setRemainingTimes] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    const getAllOrders = async () => {
        try {
          const resp = await CustomersOrders();
          setAllOrders(resp);
        } catch (error) {
          setErrorMessage(error.message);
        }
      };
    
      useEffect(() => {
        getAllOrders();
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
      

      useEffect(() => {
        const updateRemainingTimes = () => {
          if (allOrders) {
            const updatedTimes = {};
            allOrders.forEach((order) => {
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
      }, [allOrders]);

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

      const handleCancel = async (orderId) => {
        try {
          const resp = await CancelOrder(orderId);
          const filtered = allOrders.filter((order) => order.id !== +orderId);
          setAllOrders(filtered);
          setSnackbarMessage(resp);
          setSnackbarOpen(true);
        } catch (error) {
          setSnackbarMessage(error.message);
          setSnackbarOpen(true);
        }
      };

    return (
        <>
        <Home/>
        {allOrders && (
            <>
            {allOrders.filter((order) => !order.isDelivered).length > 0 && (
              <div className="pt-12 w-10/12 md:w-5/6 mx-auto">
                    <h3>Orders in progress</h3>
              <div class="relative overflow-x-auto rounded-lg mx-auto">
                    
                    <table class="text-sm text-left text-gray-500  mx-auto border border-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-200 ">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                Order time
                                </th>
                                <th scope="col" class="px-6 py-3">
                                Estimated delivery time
                                </th>
                                <th scope="col" class="px-6 py-3">
                                Delivery address
                                </th>
                                <th scope="col" class="px-6 py-3">
                                Total price (rsd)
                                </th>
                                <th scope="col" class="px-6 py-3">
                                  Remaining delivery time
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Details
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {allOrders.filter((order) => !order.isDelivered).map((order) => (
                            <tr class="bg-gray-100  hover:bg-gray-200 ">
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
                                    <p class="font-medium">
                                    {remainingTimes[order.id] && <span>{remainingTimes[order.id]}</span>}
                                    </p>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <button class="p-2 border border-blue-500 hover:bg-blue-500
                                         hover:border-white text-black hover:text-white rounded" 
                                         onClick={() => handleOpenDialog(order.id)}>
                                          Details
                                        </button>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <button class="p-2 border border-red-500 hover:bg-red-500
                                         hover:border-white text-black hover:text-white rounded"
                                         onClick={() => handleCancel(order.id)}>Cancel</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
              </div>
        )}

        {allOrders.filter((order) => order.isDelivered).length > 0 && (
          <div className="py-12 w-10/12 md:w-5/6 mx-auto">
          <h3>Delivered Orders</h3>
            <div class="relative overflow-x-auto rounded-lg mx-auto">
                  
                  <table class="text-sm text-left text-gray-500  mx-auto border border-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-200 ">
                          <tr>
                              <th scope="col" class="px-6 py-3">
                              Order time
                              </th>
                              <th scope="col" class="px-6 py-3">
                              Estimated delivery time
                              </th>
                              <th scope="col" class="px-6 py-3">
                              Delivery address
                              </th>
                              <th scope="col" class="px-6 py-3">
                              Total price (rsd)
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
                      {allOrders.filter((order) => order.isDelivered).map((order) => (
                          <tr class="bg-gray-100 hover:bg-gray-200">
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
                                  <div class="flex items-center">
                                      {order.isDelivered ? 'Delivered' : ('')}
                                  </div>
                              </td>
                              <td class="px-6 py-4">
                                  <div class="flex items-center">
                                      <button class="p-2 border border-blue-500 hover:bg-blue-500
                                      hover:border-white text-black hover:text-white rounded" 
                                      onClick={() => handleOpenDialog(order.id)}>
                                        Details
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </div>
            </div>
                
            )}
          </>
        )}
        {errorMessage && <h3 class="pl-12 pt-3 mx-auto text-2xl">{errorMessage}</h3>}
        <OrderDetails
        open={openDialog}
        handleClose={handleCloseDialog}
        orderId={selectedOrderId}
        />
      <Snackbar
      open={snackbarOpen}
      autoHideDuration={7000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      message={snackbarMessage}
      />
        </>
    );
}

export default CustomerOrders;