import { Fragment, ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Unauthorised from "../pages/unauthorised";
import { useDispatch } from "react-redux";
import { addNotification } from "@/redux/notificationSlice";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole?: string;
    disallowedRole?: string;
}

interface MyToken {
    sub: string;
    role: string;
    iat: number;
    exp: number;
}

export default function ProtectedRoute({ children, allowedRole, disallowedRole }: ProtectedRouteProps) {
    const token = localStorage.getItem("jwt");
    const location = useLocation();
    const dispatch = useDispatch();

    if(!token) {
        return <Navigate to="/login" />
    }

    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:8080/api/v1/notifications/connect/Bearer${ token }`);

        eventSource.addEventListener("notification", (event) => {
            const data = JSON.parse(event.data);
            dispatch(addNotification({
                senderId: data.sender.id,
                receiverId: data.receiver.id,
                subjectId: data.subject.id,
                readStatus: data.readStatus,
                title: data.title,
                description: data.description
            }));
        });

        return () => {
            eventSource.close();
        };

    }, []);

    const decodedToken = jwtDecode<MyToken>(token);
    const userRole = decodedToken.role;

    // If the route has a disallowed role and the user's role matches, redirect
    if (disallowedRole && userRole === disallowedRole) {
        return <Unauthorised />;  // Redirect to home or any other page
    }

    // If a required role is set and the user doesn't have the correct role, redirect
    if (allowedRole && userRole !== allowedRole) {
        return <Unauthorised />;
    }

    // If the token is valid and no disallowed role is matched, render the protected route
    return <Fragment>{children}</Fragment>;
}