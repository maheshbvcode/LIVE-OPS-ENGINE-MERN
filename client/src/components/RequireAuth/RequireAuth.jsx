import {Navigate, Outlet } from "react-router-dom";
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();

    return (
        allowedRoles.includes(auth?.role)
            ? <Outlet />
            : auth?.token
                ? <Navigate to="/unauthorized"/>
                : <Navigate to="/login"/>
    );
}

export default RequireAuth;