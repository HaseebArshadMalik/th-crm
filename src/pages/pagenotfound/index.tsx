import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import "./index.css";

const PageNotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div>
        <div className="pnf-container">
          <Typography variant="h1" component="h1">
            404
          </Typography>
          <Typography variant="h5" component="h5">
            Page Not Found ⚠️
          </Typography>
          <Typography variant="h4" component="h4">
            We couldn′t find the page you are looking for.
          </Typography>
          <img
            src="/images/404.png"
            alt=""
            className="banner"
          />
        </div>
        <div>
          <img
            className="tree1Imgs"
            src="/images/auth-v1-tree-c.png"
            alt="maskImage"
          />
          <img
            alt="mask"
            className="mask-pnf"
            src="/images/auth-v1-mask-light.png"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PageNotFound;
