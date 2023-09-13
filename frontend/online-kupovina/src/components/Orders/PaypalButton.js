import React, { useRef, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

export default function PayPalButton({ totalPrice, disabled, onPaymentSuccess  }) {
  const paypal = useRef();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    /* eslint-disable */
    const renderPayPalButton = async () => {
      await window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: totalPrice,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log(order);
            setSnackbarMessage("Payment successful. Please confirm the order.");
            setSnackbarOpen(true);
            if (onPaymentSuccess) {
              onPaymentSuccess();
            }
          },
          onError: (err) => {
            console.log(err);
            setSnackbarMessage("Payment failed.");
            setSnackbarOpen(true);
          },
        })
        .render(paypal.current);
    };

    renderPayPalButton();
    return () => {
      if (paypal.current) {
        paypal.current.innerHTML = "";
      }
    };
  }, [totalPrice]);
/* eslint-enable */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <div ref={paypal} style={{ pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.5 : 1 }}></div>
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          ContentProps={{
            sx: {
              width: "400px",
              fontSize: "16px",
            },
          }}
        />
    </>
  );
}