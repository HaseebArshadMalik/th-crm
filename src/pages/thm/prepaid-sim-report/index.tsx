import React from "react";
import AgGrid from "../../../components/grids/grid";
import { motion } from "framer-motion";

const THMReports = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <h2 className="heading">Sim Order Report</h2>
      <AgGrid />
    </motion.div>
  );
};

export default THMReports;
