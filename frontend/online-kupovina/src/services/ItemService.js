import apiClient from "../utils/ApiClient";

export const GetAllItems = async () => {
  try {
    const response = await apiClient.get(`/items`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const GetSellerItems = async () => {
    try {
      const response = await apiClient.get(`/items/seller-items`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const DeleteItem = async (id) => {
    try {
      const response = await apiClient.delete(`${process.env.REACT_APP_API_URL}/items/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const ModifyItem = async (data) => {
    try {
      const response = await apiClient.post(`/items/update-item`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const AddItem = async (data) => {
    try {
      const response = await apiClient.post(`/items`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };