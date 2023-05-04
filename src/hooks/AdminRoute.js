import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const AdminRoute = ({ component: Component, ...rest }) => {
  const currentUser = useCurrentUser();
  console.log('currentUser:', currentUser);


  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser && currentUser.is_superuser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

export default AdminRoute;
