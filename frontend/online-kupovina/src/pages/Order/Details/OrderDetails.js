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
import { OrderDetailsModel } from "../../../models/OrderDetailsModel";
import { GetOrderDetails } from "../../../services/OrderService";

function OrderDetails({ open, handleClose, orderId }) {
  const [details, setDetails] = useState(new OrderDetailsModel());
  const [errorMessage, setErrorMessage] = useState("");

  const getOrderDetails = async (orderId) => {
    try {
      const resp = await GetOrderDetails(orderId);
      setDetails(resp);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (open) {
      getOrderDetails(orderId);
    }
  }, [open, orderId]);

  return (
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Items in order</DialogTitle>
    <DialogContent>
      {details && details.length > 0 ? (
        <List>
          {details.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                    <span>
                    <img
                          className="item-image"
                          alt=""
                          src={`https://localhost:5001/${item.imageUri}`}
                          style={{ width: '50px', height: '50px' }}
                        />
                    </span>
                    <br />
                    <span>Name: {item.name}</span>
                    </>
                  }
                  secondary={
                    <>
                      <span>Description: {item.description}</span>
                      <br />
                      <span>Price: {item.price} rsd</span>
                      <br />
                      <span>Quantity: {item.itemQuantity}</span>
                      <br />
                      <span>Seller name: {item.sellerName}</span>
                    </>
                  }
                />
              </ListItem>
              {index !== details.length - 1 && <Divider sx={{ height: 2, backgroundColor: 'black', margin: '10px 0' }}/>}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <p class="pl-12 pt-3 mx-auto text-2xl">No items found</p>
      )}
      {errorMessage && <h3 class="pl-12 pt-3 mx-auto text-2xl">{errorMessage}</h3>}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
  );
}

export default OrderDetails;