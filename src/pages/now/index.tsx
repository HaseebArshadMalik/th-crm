import React from "react";
import { motion } from "framer-motion";

const Now = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
    </motion.div>
  );
};

export default Now;
