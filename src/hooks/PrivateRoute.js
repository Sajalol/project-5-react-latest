import { Route, Redirect } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const StaffRoute = ({ component: Component, ...rest }) => {
  const currentUser = useCurrentUser();

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser && currentUser.is_staff ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default StaffRoute;