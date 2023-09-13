import axios from "axios";
import apiClient from "../utils/ApiClient";

export const GetStatus = async () => {
  try {
    const response = await apiClient.get(`/users/verification-status`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const RegisterUser = async (userData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const RegisterUserWithGoogle = async (googleToken) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/google-signin`, googleToken);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

export const LoginUser = async (userData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const UserProfile = async () => {
    try {
      const response = await apiClient.get(`/users/profile`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };


  export const ChangeUserProfile = async (userData) => {
    try {
      const response = await apiClient.post(`/users/update-profile`, userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const ChangeUserPassword = async (newPass) => {
    try {
      const response = await apiClient.put(`/users/change-password`, newPass);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const GetSellers = async (page, rowsPerPage) => {
    try {
      const response = await apiClient.get(`/users/sellers?page=${page}&rowsPerPage=${rowsPerPage}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };

  export const VerifySeller = async (id) => {
    try {
      const response = await apiClient.put(`/users/verify/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };


  export const DeclineSeller = async (id) => {
    try {
      const response = await apiClient.put(`/users/decline/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  };