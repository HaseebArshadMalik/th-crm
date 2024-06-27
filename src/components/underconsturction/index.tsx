import { Typography } from "@mui/material";
import React from "react";
import "./index.css";
import { motion } from "framer-motion";

const UnderConsturction = () => {
  return (
    <motion.div
      initial={{ y: -1000 }}
      animate={{ y: 0 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div className="uc-container">
        <Typography variant="h5" component="h5">
          Under Maintenance! 🚧
        </Typography>
        <Typography variant="h4" component="h4">
          Sorry for the inconvenience but we′re performing some maintenance at
          the moment
        </Typography>
        <img
          className="banner"
          src="/images/misc-under-maintenance.png"
          alt=""
        />
      </div>
    </motion.div>
  );
};

export default UnderConsturction;
