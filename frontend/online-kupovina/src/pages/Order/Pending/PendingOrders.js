import Home from "../../Home/Home";
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { GetPendingOrders } from "../../../services/OrderService";

function PendingOrders(){
    const [allOrders, setAllOrders] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

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

    const getPendingOrders = async () => {
        try {
          const resp = await GetPendingOrders();
          setAllOrders(resp);
        } catch (error) {
          setErrorMessage(error.message);
        }
      };
    
      useEffect(() => {
        getPendingOrders();
      }, []);

      const formatDate = (date) => {
        const dateTime = new Date(date);
        const formattedDateTime = dateTime.toLocaleString();
        return formattedDateTime;
      }

      const getType = (type) => {
        if(type === 0){
            return 'None';
        }
        if(type === 1){
            return 'PayPal';
        }
        if(type === 2){
            return 'On Delivery';
        }
      }

    return (
        <>  
        <Home/>
        {errorMessage && <h3 class="pl-12 pt-3 mx-auto text-2xl">{errorMessage}</h3>}
        {allOrders &&
        <div className="py-12 w-10/12 md:w-5/6 mx-auto">
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
                </tr>
            </thead>
            <tbody>
            {allOrders.map((order) => (
                <tr class="bg-gray-100  hover:bg-gray-200 ">
                    <td class="px-6 py-4">
                      {formatDate(order.orderingTime)}
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                        {order.deliveryAddress}
                        </div>
                    </td>
                    <td class="px-6 py-4  max-w-[200px]">
                        <div class="items-center overflow-auto  max-w-[200px]">
                            {order.comment}
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            {order.totalPrice}
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <p class="font-medium">
                        {getType(order.paymentType)}
                        </p>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  </div>
}
  </>
  );
}

export default PendingOrders;