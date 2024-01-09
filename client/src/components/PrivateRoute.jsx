import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser, currentUserSignIn } = useSelector((state) => state.user);
    console.log("currentUer", currentUser);
    console.log("currentUserSignIn", currentUserSignIn)
    return (currentUser && currentUserSignIn) ? <Outlet /> : <Navigate to='/sign-in' />;
}