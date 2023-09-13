import React from "react";
import { useEffect, useState, useRef } from "react";
import { GetCurrentOrder, DeleteOrderItem, DeclineOrder, ConfirmOrder } from "../../services/OrderService";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  Button,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Box,
  TextField,
  Alert,
  Checkbox,
  Typography,
  Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from '@mui/material/Snackbar';
import Home from "../Home/Home";
import { ConfirmOrderModel } from "../../models/ConfirmOrderModel";
import PayPalButton from "../../components/Orders/PaypalButton";

function Cart() {
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderToConfirm, setOrderToConfirm] = useState(new ConfirmOrderModel());
  const [emptyFieldsMess, setEmptyFieldsMess] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const commentRef = useRef(null);
  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const streetRef = useRef(null);
  const postalCodeRef = useRef(null);

  const getOrder = async () => {
    try {
      const resp = await GetCurrentOrder();
      setOrder(resp);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const handleDelete = async (itemId, orderId) => {
    try {
      await DeleteOrderItem(itemId, orderId);
      getOrder();
    } catch (error) {
      setOrder(null);
      setErrorMessage(error.message);
    }
  };

  const handleDecline = async (orderId) => {
    try {
        await DeclineOrder(orderId);
        setOrder(null);
      } catch (error) {
        setErrorMessage(error.message);
      }
  };

  const handleSubmit = async (orderId) => {
    
    if(orderToConfirm.comment.trim() === ''){
      setEmptyFieldsMess("Please fill out comment before confirming order.");
      commentRef.current.focus();
      return;
    }
    if(country.trim() === ''){
      setEmptyFieldsMess("Please fill out country before confirming order.");
      countryRef.current.focus();
      return;
    }
    if(city.trim() === ''){
      setEmptyFieldsMess("Please fill out city before confirming order.");
      cityRef.current.focus();
      return;
    }
    if(street.trim() === ''){
      setEmptyFieldsMess("Please fill out street before confirming order.");
      streetRef.current.focus();
      return;
    }
    if(postalCode.trim() === ''){
      setEmptyFieldsMess("Please fill out postal code before confirming order.");
      postalCodeRef.current.focus();
      return;
    }

    if(!isChecked && !isPaymentSuccess){
      // nije odabrano placanje
      setEmptyFieldsMess("Please select payment method. You can pay on delivery or using paypal.");
      return;
    }
    setEmptyFieldsMess('');

    try {
      if(isChecked){
        orderToConfirm.paymentType = 'OnDelivery';
      }
      else if(isPaymentSuccess){
        orderToConfirm.paymentType = 'Paypal';
      }else{
        orderToConfirm.paymentType = 'None';
      }
      
      console.log(orderToConfirm);
      const resp = await ConfirmOrder(orderId, orderToConfirm);
      setOrder(null);
      setSnackbarMessage(resp);
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const handlePaymentSuccess = () => {
    setIsPaymentSuccess(true);
    setEmptyFieldsMess('');
  };
  

  return (
    <>
      <Home />
      {order !== null && errorMessage === '' && (
        <>
      <div className="pt-12 w-11/12 md:w-5/6 mx-auto">
        <div class="relative rounded-lg w-5/6 overflow-auto mx-auto">
        <div>{emptyFieldsMess && <Alert variant="outlined" severity="error">{emptyFieldsMess}</Alert>}</div>
                  <table class="text-sm text-left text-gray-500  mx-auto border border-gray-400 ">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-200 ">
                          <tr>
                              <th scope="col" class="px-6 py-3">
                                Product
                              </th>
                              <th scope="col" class="px-6 py-3">
                                Quantity
                              </th>
                              <th scope="col" class="px-6 py-3">
                                Price
                              </th>
                              <th scope="col" class="px-6 py-3">
                                 Total
                              </th>
                              <th scope="col" class="px-6 py-3">
                                  Action
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                      {order.map((orderItem) => (
                          <tr class="bg-gray-100  hover:bg-gray-200 text-center">
                              <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                  <img class="w-10 h-10 rounded-full" src={`https://localhost:5001/${orderItem.itemImage}`} alt="Profile"/>
                                  <div class="pl-3 max-w-[200px]">
                                      <div class="text-base font-semibold overflow-auto">{orderItem.itemName}</div>
                                  </div>  
                              </th>
                              <td class="px-6 py-4">
                                {orderItem.itemQuantity}
                              </td>
                              <td class="px-6 py-4">
                                  <div class="flex items-center">
                                  {orderItem.itemPrice}
                                  </div>
                              </td>
                              <td class="px-6 py-4">
                                  <div class="flex items-center">
                                  {orderItem.itemPrice * orderItem.itemQuantity} RSD
                                  </div>
                              </td>
                              <td class="px-6 py-4">
                                <div>
                                    <button class="p-2 border border-red-500 text-black hover:text-white hover:bg-red-400"
                                    onClick={() => handleDelete(orderItem.itemId, orderItem.orderId)}>Remove</button>
                                </div>
                              </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
        
        </div>
        <div id="summary" class="w-3/6 py-10 mx-auto pb-3">
            <h1 class="font-semibold text-2xl border-b pb-2">Order Summary</h1>
            <div class="flex justify-between mt-4 mb-2">
              <span class="font-semibold text-sm">Total items cost: {order[0].totalPrice} RSD</span>
            </div>
            <div>
              <label class="font-medium inline-block mb-1 text-sm">Shipping: {order[0].fee} RSD</label>
            </div>
            <div class="border-t mt-1">
              <div class="flex font-semibold justify-between py-6 text-md uppercase">
                <span>Total cost</span>
                <span>{order[0].totalPrice + order[0].fee}</span>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" mt={2}>
              <Box display="flex" flexDirection="column">
              <h1>Shipping details:</h1>

              <TextField
                    label="Comment"
                    value={orderToConfirm.comment}
                    onChange={(e) => setOrderToConfirm((prevData) => ({ ...prevData, comment: e.target.value }))}
                    variant="outlined"
                    size="small"
                    multiline
                    margin="dense"
                    inputRef={commentRef}
                  />
                  <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Country"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setOrderToConfirm((prevData) => ({
                          ...prevData,
                          deliveryAddress: `${street}, ${city}, ${postalCode}, ${e.target.value}`
                        }));
                      }}
                      variant="outlined"
                      size="small"
                      margin="dense"
                      inputRef={countryRef}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="City"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setOrderToConfirm((prevData) => ({
                          ...prevData,
                          deliveryAddress: `${street}, ${e.target.value}, ${postalCode}, ${country}`
                        }));
                      }}
                      variant="outlined"
                      size="small"
                      margin="dense"
                      inputRef={cityRef}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Street"
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        setOrderToConfirm((prevData) => ({
                          ...prevData,
                          deliveryAddress: `${e.target.value}, ${city}, ${postalCode}, ${country}`
                        }));
                      }}
                      variant="outlined"
                      size="small"
                      margin="dense"
                      inputRef={streetRef}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Postal Code"
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                        setOrderToConfirm((prevData) => ({
                          ...prevData,
                          deliveryAddress: `${street}, ${city}, ${e.target.value}, ${country}`
                        }));
                      }}
                      variant="outlined"
                      size="small"
                      margin="dense"
                      inputRef={postalCodeRef}
                    />
                  </Grid>
                  </Grid>

                  </Box>

                  <div class="flex flex-col md:flex-row justify-between items-center mt-2 gap-3">
                    <div class="flex flex-row items-center">
                      <Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} disabled={isPaymentSuccess}/>
                      <Typography>Pay on delivery</Typography>
                    </div>
                    <div className="mx-2">
                      <Typography variant="body2">OR</Typography>
                    </div>
                    <div className="flex flex-col md:flex-row flex-wrap">
                        <Box>
                          <PayPalButton totalPrice={order[0].totalPrice + order[0].fee}
                          disabled={isChecked}
                          onPaymentSuccess={handlePaymentSuccess} />
                        </Box>
                    </div>
                    
                  </div>
                
                
                <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={3} flexWrap={1}>
                  <Button onClick={() => handleDecline(order[0].orderId)} disabled={isPaymentSuccess} variant="contained" color="error">
                    Decline
                  </Button>
                  <Button onClick={() => handleSubmit(order[0].orderId)} variant="contained" color="primary">
                    Confirm
                  </Button>
                </Box>
              </Box>
              
              </form>
          </div>
        </div>
      </>)} 
      {errorMessage && <p class="pl-12 pt-3 mx-auto text-2xl">{errorMessage}</p>}
                    <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={7000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                    message={snackbarMessage}
                  />
      </>
)}

export default Cart;