import React from "react";
import Dashboard from "./dashboard";
import { motion } from "framer-motion";

const THM = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <Dashboard />
    </motion.div>
  );
};

export default THM;
