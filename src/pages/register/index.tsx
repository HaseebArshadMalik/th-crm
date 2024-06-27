import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import "./../login/index.css";
import React from "react";
import { Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../../components/logo";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/support/portin");
    }
  }, []);

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
              <h1>Adventure starts here 🚀</h1>
              <p>Make your app management easy and fun!</p>
              <TextField
                className="formControl"
                label="Username"
                variant="outlined"
              />
              <TextField
                className="formControl"
                label="Email"
                variant="outlined"
              />
              <FormControl className="formControl mb0" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
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
                      label={
                        <>
                          I agree to <Link to="#">privacy policy & terms</Link>
                        </>
                      }
                    />
                  </FormGroup>
                </div>
              </div>
              <Link to={"/support/portin"}>
                <Button className="dButton" variant="contained">
                  Sign up
                </Button>
              </Link>
              <div className="exLink">
                <p>
                  New on our platform? <Link to={"/"}>Sign in here</Link>
                </p>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export default Register;
