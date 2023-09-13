import jwtDecode from 'jwt-decode';

export const GetUserRole = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
};

export const GetUserVerification = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken['verified'];
};