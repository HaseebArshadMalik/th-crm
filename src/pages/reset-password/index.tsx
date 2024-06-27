import { Box, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import './../login/index.css'
import React from 'react';
import { Link } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../../components/logo';
const ResetPassword = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <>
      <Box className='content-center'>
        <Card className='formOuter'>
          <CardContent>
            <Box>
              <Logo />
              <h1>Reset Password 🔒</h1>
              <p>Your new password must be different from previously used passwords</p>
              <FormControl className='formControl' variant="outlined">
                <InputLabel htmlFor="newPassword">New Password</InputLabel>
                <OutlinedInput
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
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
              <FormControl className='formControl mb5' variant="outlined">
                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
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
              <Button className='dButton' variant="contained">Send reset link</Button>
              <div className='exLink'>
                <p className='backLink'><Link to={"/"}><ArrowBackIosIcon /> Back to login</Link>
                </p>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ResetPassword;
