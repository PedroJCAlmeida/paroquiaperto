import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
