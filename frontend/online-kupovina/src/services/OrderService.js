import apiClient from "../utils/ApiClient";

export const AddItemToCart = async (itemId, quantity) => {
  try {
    const response = await apiClient.post(`/orders/add-to-cart/${itemId}/${quantity}`, null);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const GetCurrentOrder = async () => {
    try {
      const response = await apiClient.get(`/orders/order-view`)
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const GetCount = async () => {
    try {
      const response = await apiClient.get(`/orders/items-count`)
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const DeleteOrderItem = async (itemId, orderId) => {
    try {
      const response = await apiClient.delete(`/orders/${itemId}/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const DeclineOrder = async (orderId) => {
    try {
      const response = await apiClient.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const ConfirmOrder = async (id, data) => {
    try {
      const response = await apiClient.put(`/orders/confirm-order/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const CustomersOrders = async () => {
    try {
      const response = await apiClient.get(`/orders/previous-orders`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const GetOrderDetails = async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/order-details/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const GetSellerOrderDetails = async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/seller-order-details/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const CancelOrder = async (orderId) => {
    try {
      const response = await apiClient.put(`/orders/cancel-order/${orderId}`, null);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const GetAllOrders = async () => {
    try {
      const response = await apiClient.get(`/orders/all-orders`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const GetSellerOrders = async (isNew) => {
    try {
      const response = await apiClient.get(`/orders/seller-orders?isNew=${isNew}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const GetPendingOrders = async () => {
    try {
      const response = await apiClient.get(`/orders/pending-orders`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const GetOrdersOnMap = async () => {
    try {
      const response = await apiClient.get(`/orders/orders-map`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const AcceptOrder = async (orderId) => {
    try {
      const response = await apiClient.put(`/orders/accept-order/${orderId}`, null);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };