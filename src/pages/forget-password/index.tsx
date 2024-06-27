import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import "./../login/index.css";
import React from "react";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Logo from "../../components/logo";
import { motion } from "framer-motion";
const ForgetPassword = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <Box className="content-center">
        <Card className="formOuter">
          <CardContent>
            <Box>
              <Logo />
              <h1>Forgot Password? 🔒</h1>
              <p>
                Enter your email and we′ll send you instructions to reset your
                password
              </p>
              <TextField
                className="formControl mb5"
                label="Email"
                variant="outlined"
              />
              <Button className="dButton" variant="contained">
                Send reset link
              </Button>
              <div className="exLink">
                <p className="backLink">
                  <Link to={"/"}>
                    <ArrowBackIosIcon /> Back to login
                  </Link>
                </p>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export default ForgetPassword;
