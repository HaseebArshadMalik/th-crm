import * as React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div>
      <Outlet />
      <ToastContainer position="top-right" />
    </div>
  );
}
