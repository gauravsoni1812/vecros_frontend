// /* eslint-disable react/prop-types */
// import React from "react";
// import { Route, Navigate } from "react-router-dom";
// import Cookies from "js-cookie";

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const authToken = Cookies.get("authToken"); // Get the auth token from cookies
//   const userId = authToken ? JSON.parse(atob(authToken.split('.')[1])).userId : null; // Decode JWT token to get userId

//   return (
//     <Route
//       {...rest}
//       element={
//         userId ? (
//           <Component /> // If user is authenticated, render the component
//         ) : (
//           <Navigate to="/sign-in" /> // Otherwise, redirect to the sign-in page
//         )
//       }
//     />
//   );
// };

// export default ProtectedRoute;
