import Home from "../../pages/Home/Home";
import { GetSellerOrders } from "../../services/OrderService";
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

function SellerDeliveredOrders(){
    const [orders, setOrders] = useState(new OrderInfoModel());
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [info, setInfo] = useState('');

    const getDeliveredOrders = async () => {
        try {
          const resp = await GetSellerOrders(false);
          setOrders(resp);
        } catch (error) {
          setInfo(error.message);
        }
    };
    
      useEffect(() => {
        getDeliveredOrders();
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
        {info && <h3 class="pl-12 pt-3 mx-auto text-2xl">{info}</h3>}
        {orders.length > 0 && (
            <>

            <div className="py-12 w-10/12 md:w-5/6 mx-auto">
              <h3>Delivered orders</h3>
              <div class="relative overflow-x-auto rounded-lg mx-auto">
                    
                    <table class="text-sm text-left text-gray-500  mx-auto border border-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-200 ">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                
                                </th>
                                <th scope="col" class="px-6 py-3">
                                Purchaser
                                </th>
                                <th scope="col" class="px-6 py-3">
                                Ordering time
                                </th>
                                <th scope="col" class="px-6 py-3">
                                Delivery time
                                </th>
                                <th scope="col" class="px-6 py-3">
                                Comment
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
                                Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr class="bg-gray-100  hover:bg-gray-200 ">
                                <td class="px-6 py-4">
                                <img
                                  alt=""
                                  src={`https://localhost:5001/${order.customerImage}`}
                                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                />
                                </td>
                                <td class="px-6 py-4">
                                  <span style={{ display: 'inline-block' }}>{order.customer}</span>
                                </td>
                                <td class="px-6 py-4">
                                {formatDate(order.orderingTime)}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        {formatDate(order.deliveryTime)}
                                    </div>
                                </td>
                                <td class="px-6 py-4 max-w-[200px]">
                                    <div class="flex items-center overflow-auto">
                                    {order.comment}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                    {order.deliveryAddress}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <p class="font-medium">
                                    {order.totalPrice}
                                    </p>
                                </td>
                                <td class="px-6 py-4">
                                  {order.status === 2 ? 
                                    (<p class="font-medium text-red-500">Canceled</p> ) :
                                    order.isDelivered ?
                                    (<p class="font-medium text-green-500">Delivered</p>) :
                                    (<p class="font-medium text-yellow-500">Delivering...</p>)
                                  }
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <button class="p-2 border border-blue-500 hover:bg-blue-500
                                         hover:border-white text-black hover:text-white rounded"
                                         onClick={() => handleOpenDialog(order.id)}>Details</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
              </div>
            <SellerDetails
              open={openDialog}
              handleClose={handleCloseDialog}
              orderId={selectedOrderId}
            />
            </>
        )}
        
        </>
    );
}

export default SellerDeliveredOrders;