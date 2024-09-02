import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { selectRole } from '../features/auth/authSlice';

const withAuthorization = (allowedRoles) => (WrappedComponent) => {
  return (props) => {
    const role = useSelector(selectRole);

    if (!allowedRoles.includes(role)) {
      return <Redirect to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthorization;
