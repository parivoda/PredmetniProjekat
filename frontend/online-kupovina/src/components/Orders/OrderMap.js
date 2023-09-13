import Home from "../../pages/Home/Home";
import "leaflet/dist/leaflet.css";
import { AcceptOrder, GetOrdersOnMap } from "../../services/OrderService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "leaflet";
import { Button, Snackbar } from "@mui/material";

function OrderMap() {
  const [markers, setMarkers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const geocodeAddresses = async () => {
      const orders = await GetOrdersOnMap();
      orders.forEach(async (order) => {
        try {
          const response = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
              params: {
                address: order.deliveryAddress,
                key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
              },
            }
          );

          const { results } = response.data;
          if (results.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            setMarkers((prevMarkers) => [
              ...prevMarkers,
              { lat, lng, orderDetails: order },
            ]);
          }
        } catch (error) {
          console.log(error);
        }
      });
    };

    geocodeAddresses();
  }, []);

  const customIcon = new Icon({
    iconUrl: process.env.PUBLIC_URL + "/location.png",
    iconSize: [38, 38],
  });

  const handleMarkerClick = (orderDetails) => {
    setSelectedOrder(orderDetails);
  };

  const acceptOrder = async (orderId) => {
    try{
        const resp = await AcceptOrder(orderId);
        setSnackbarMessage(resp);
        setSnackbarOpen(true);
        setMarkers((prevMarkers) =>
        prevMarkers.filter((marker) => marker.orderDetails.id !== orderId)
      );
    }catch(error){
        console.log('Error occured while trying to accept order.');
    }
  };

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
      <Home />
      <MapContainer style={{ height: '100vh', width: '100wh' }} center={[44.8125, 20.4612]} zoom={7}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker, index) => (
          <Marker
            icon={customIcon}
            position={[marker.lat, marker.lng]}
            key={index}
            eventHandlers={{
              click: () => handleMarkerClick(marker.orderDetails),
            }}
          >
            <Popup>
              <p><b>{marker.orderDetails.deliveryAddress}</b></p>
              <p>Comment: {marker.orderDetails.comment}</p>
            <p>Total price: {marker.orderDetails.totalPrice} usd</p>
            <p>Payment type: {getType(marker.orderDetails.paymentType)}</p>
            <Button onClick={() => acceptOrder(selectedOrder.id)} variant="outlined" color='secondary'>Accept order</Button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      

      <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      message={snackbarMessage}
    />
    </>
  );
}

export default OrderMap;