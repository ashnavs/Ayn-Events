// // components/PublicRoute.jsx
// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { isAuthenticated } from '../utils/auth';

// const PublicRoute = ({ element: Component, ...rest }) => {
//   return !isAuthenticated() ? <Component {...rest} /> : <Navigate to="/home" />;
// };

// export default PublicRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const PublicRoute = ({ element: Component, ...rest }) => {
  return !isAuthenticated() ? <Component {...rest} /> : <Navigate to="/home" />;
};

export default PublicRoute;