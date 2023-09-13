import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import { OrderDetailsModel } from "../../models/OrderDetailsModel";
import { GetSellerOrderDetails } from "../../services/OrderService";

function SellerDetails({ open, handleClose, orderId }) {
  const [details, setDetails] = useState(new OrderDetailsModel());
  const [errorMessage, setErrorMessage] = useState("");

  const getSellerOrderDetails = async (orderId) => {
    try {
      const resp = await GetSellerOrderDetails(orderId);
      setDetails(resp);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (open) {
        getSellerOrderDetails(orderId);
    }
  }, [open, orderId]);

  return (
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Ordered Items</DialogTitle>
    <DialogContent>
      {details && details.length > 0 ? (
        <div className=" m-12">
          {details.map((item, index) => (
            <div className="flex flex-col gap-1 py-4 border-t border-b border-gray-300">
                <img
                  className="item-image"
                  alt=""
                  src={`https://localhost:5001/${item.imageUri}`}
                  style={{ width: '50px', height: '50px' }}
                />
              <span>Name: {item.name}</span>
              <span>Description: {item.description}</span>
              <span>Price: {item.price} rsd</span>
              <span>Quantity: {item.itemQuantity}</span>
            </div>
          ))}
        </div>
              
              
            
        
      ) : (
        <p>No items found</p>
      )}
      {errorMessage && <h3>{errorMessage}</h3>}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
  );
}

export default SellerDetails;