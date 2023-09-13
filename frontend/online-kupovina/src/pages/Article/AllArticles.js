import Home from "../Home/Home";
import { useState, useEffect } from "react";
import { GetAllItems } from "../../services/ItemService";
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { AddItemToCart } from "../../services/OrderService";
import Snackbar from '@mui/material/Snackbar';

function AllArticles(){
    const [items, setItems] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [itemQuantities, setItemQuantities] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const getAllItems = async () => {
        try {
          const resp = await GetAllItems();
          setItems(resp);
        } catch (error) {
          setErrorMessage(error.message);
        }
    };
    
      useEffect(() => {
        getAllItems();
      }, []);

      
  const handleIncreaseQuantity = (itemId) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 0) + 1,
    }));
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
    });
  };

  const handleDecreaseQuantity = (itemId) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max((prevQuantities[itemId] || 0) - 1, 0),
    }));
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
    });
  };

  const handleAddToCart = async (itemId) => {
    const quantity = itemQuantities[itemId] || 0;
    
    try {
      const resp = await AddItemToCart(itemId, quantity);
      setItemQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: 0, 
      }));
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
        <div className="py-12">
        {items && (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <Card key={item.id} className="mx-auto mb-12 px-12">
            <CardContent>
              <div className="flex flex-row gap-3">
                <div>
                  <img className="item-image" alt="Picture" src={`https://localhost:5001/${item.imageUri}`} />
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="h5" component="div">
                  {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {item.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Price: {item.price} rsd
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Quantity: {item.quantity}
                  </Typography>
                </div>
              </div>
              
            </CardContent>
            <CardActions>
              <div className="flex flex-row gap-3 flex-wrap">
                <div className="flex flex-row gap-3 flex-wrap">
                    <button className="px-3 py-1 rounded border border-gray-400" 
                        variant="outlined" 
                        disabled={!itemQuantities[item.id] || itemQuantities[item.id] === 0} 
                        size="small" 
                        onClick={() => handleDecreaseQuantity(item.id)}>
                              -
                    </button>
                            <p className="m-auto text-md" variant="body2" color="text.secondary">
                                {itemQuantities[item.id] || 0}
                            </p>
                      <button className="px-3 py-1 rounded border border-gray-400" disabled={item.quantity === 0} 
                        variant="outlined" size="small" onClick={() => handleIncreaseQuantity(item.id)}>
                              +
                      </button>
                </div>
                    <button className="px-3 py-1 rounded border border-blue-500"  variant="outlined"  size="small" onClick={() => handleAddToCart(item.id)}>Add to cart</button>
              </div>
              
             
              
            </CardActions>
          </Card>
        ))}
      </div>
          </>
        )}
        <Snackbar
      open={snackbarOpen}
      autoHideDuration={7000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      message={snackbarMessage}
    />
    {!items && (
        <><h1 class="pl-12 pt-3 mx-auto text-2xl">{errorMessage}</h1></>
    )}
        </div>
        
        </>
    );
}

export default AllArticles;