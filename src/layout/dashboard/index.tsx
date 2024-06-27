import * as React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Aside from "./aside";
import Header from "./header";
import Footer from "./footer";
import "./index.css";
import { useEffect } from "react";
import { motion } from "framer-motion";

const DashboardLayout = (props: any) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <div className="mainOuter">
        <div className="aside">
          <Aside />
        </div>
        <div className="header">
          <Header />
        </div>
        <div className="main">
          <div className="mainInner">
            {props.children ? props.children : <Outlet />}
          </div>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <img
          className="maskImg"
          src="/images/auth-v1-mask-light.png"
          alt="maskImage"
        />
      </motion.div> */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <img
          className="tree1Img"
          src="/images/auth-v1-tree-c.png"
          alt="maskImage"
        />
      </motion.div>
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <img
          className="tree2Img"
          src="/images/auth-v1-tree-2-c.png"
          alt="maskImage"
        />
      </motion.div> */}
    </>
  );
};

export default DashboardLayout;
