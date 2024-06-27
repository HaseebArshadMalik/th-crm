import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import "./index.css";
import { Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../../components/logo";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axiosInterceptorInstance from "../../utils/axios.interceptor";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [action, setAction] = useState<Boolean>(false);

  const controller = new AbortController();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      var user = JSON.parse(localStorage.getItem("user") || "");
      if (user.Email.indexOf("marketing") !== -1) {
        navigate("/thm/dashboard");
      } else if (user.Email == "asfand.yar@now.net.pk") {
        navigate("/sendcredit/operator-cms");
      } else {
        navigate("/support/portin");
      }
    }
    return () => {
      controller.abort();
    };
  }, []);

  const handleLogin = async () => {
    toast.dismiss();
    setAction(true);
    if (email.trim() !== "" && password.trim() !== "") {
      await axiosInterceptorInstance
        .post(
          `/account/login`,
          {
            email: email,
            password: password,
          },
          { signal: controller.signal }
        )
        .then((res: any) => {
          setAction(false);
          const data = res.data;
          if (data.body !== "" && data.statusCode === 200) {
            var user = JSON.parse(data.body);
            if (user.Token) {
              localStorage.setItem("user", JSON.stringify(user));
              if (user.Email.indexOf("marketing") !== -1) {
                navigate("/thm/dashboard");
              } else if (user.Email.indexOf("support") !== -1) {
                navigate("/support/portin");
              }
              else if (user.Email == "asfand.yar@now.net.pk") {
                navigate("/sendcredit/operator-cms");
              }
              else {
                navigate("/support/portin");
              }
            }
          }
        });
    } else {
      toast.error("You have entered an invalid username or password");
    }
  };

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
              <h1>Welcome to Talk home! 👋🏻</h1>
              <p>Please sign-in to your account and start the adventure</p>
              <TextField
                className="formControl"
                label="Email/Username"
                variant="outlined"
                onChange={(e: any) => setEmail(e.target.value)}
              />
              <FormControl className="formControl mb0" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  onChange={(e: any) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <div className="d-flex">
                <div>
                  <FormGroup>
                    <FormControlLabel
                      className="checkBox"
                      control={<Checkbox />}
                      label="Remember Me"
                    />
                  </FormGroup>
                </div>
                <div style={{ display: "none" }}>
                  <Link to={"/forget-password"}>Forgot Password?</Link>
                </div>
              </div>

              {!action && (
                <Button
                  className="dButton"
                  onClick={() => handleLogin()}
                  variant="contained"
                >
                  Login
                </Button>
              )}
              {action && (
                <Button className="dButton" variant="contained">
                  <CircularProgress color="inherit" size={30} />
                </Button>
              )}
              <div className="exLink" style={{ display: "none" }}>
                <p>
                  New on our platform?{" "}
                  <Link to={"/register"}>Create an account</Link>
                </p>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export default Login;
