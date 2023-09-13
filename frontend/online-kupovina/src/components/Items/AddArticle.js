import {Typography,Button,Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { ItemToAdd } from '../../models/AddItemModel';
import { useState } from 'react';
import { AddItem } from '../../services/ItemService';

function AddArticle({ onClose, onAddItem }){
    const [newItem, setNewItem] = useState(new ItemToAdd());
    const [errorMessage, setErrorMessage] = useState(false);
    const [open, setOpen] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');

      const handleClose = () => {
        setOpen(false);
        onClose();
      };

     
      const handleAdd = async () => {
        if(!validateForm(newItem)){
          return;
        }

        const formData = new FormData();
        formData.append("name", newItem.name);
        formData.append("description", newItem.description);
        formData.append("quantity", newItem.quantity);
        formData.append("price", newItem.price);
        formData.append("imageUri", selectedImage);

        try {
            const resp = await AddItem(formData);
            onAddItem(resp);
            setNewItem(new ItemToAdd());
            handleClose();
          } catch (error) {
            setErrorMessage(error.message);
          }
      };

      function validateForm(newItem){

        const trimmedFields = ['name', 'description'];
        const hasEmptyRequiredFields = trimmedFields.some((field) => newItem[field].trim() === '');
    
        if (hasEmptyRequiredFields) {
          setErrorMessage("Please fill in all required fields.");
          return false;
        }
        return true;
      }

      const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
      };

    return (
        <Dialog open={open} onClose={handleClose}>
          <div className='flex flex-col'>
        <DialogTitle>Dodaj novi artikal: </DialogTitle>
        <DialogContent>
        
        {errorMessage && (
            <Typography  variant="body1" color="error">
              {errorMessage}
            </Typography>
          )}
          <form onSubmit={handleAdd}>
          <div className='flex flex-col gap-1'>
            <TextField label="Name" required
            variant='filled' value={newItem.name} onChange={(e) => setNewItem((prevItem) => ({ ...prevItem, name: e.target.value }))}
            />
            <br/>
            <TextField label="Description" required
            variant='filled' value={newItem.description} onChange={(e) => setNewItem((prevItem) => ({ ...prevItem, description: e.target.value }))}
            /><br/>
            <TextField label="Quantity" type='number' required
            variant='filled' value={newItem.quantity} onChange={(e) => setNewItem((prevItem) => ({ ...prevItem, quantity: e.target.value }))}
            /><br/>
            <TextField label="Price" sx={{ width: "300px" }} type='number' required
            variant='filled' value={newItem.price} onChange={(e) => setNewItem((prevItem) => ({ ...prevItem, price: e.target.value }))}
            /><br/>
            <input
              variant="filled"
                helperText="Upload image"
                sx={{ width: "400px" }}
                type="file"
                InputProps={{
                  inputProps: {
                    accept: 'image/*',
                  }}}
                onChange={handleFileChange}
              />
          </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd} type='submit' color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
        </div>
      </Dialog>);
}

export default AddArticle;