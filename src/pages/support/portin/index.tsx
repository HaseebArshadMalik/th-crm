import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils";
import { motion } from "framer-motion";

const Portin = () => {
  const [data, setData] = useState<any>([]);
  const [email, setEmail] = useState<string>("");
  const [portIn, setPortIn] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [msisdn, setmsisdn] = useState("");

  const [open, setOpen] = useState(false);

  const [action, setAction] = useState(false);
  const [actionRequest, setActionRequest] = useState(false);

  const handleClick = async () => {
    setData([]);
    setPortIn("");
    setProduct("");
    setCode("");
    toast.dismiss();

    if (msisdn.trim().length > 9 || email.trim() !== "") {
      if (email.trim() !== "" && !validateEmail(email.trim())) {
        toast.error("Please enter valid email address");
        return false;
      }
      setAction(true);
      await axiosInterceptorInstance
        .get(`/product?MSISDN=${msisdn.trim()}&Email=${email.trim()}`)
        .then((res: any) => {
          setAction(false);
          const data = JSON.parse(res.data.body);
          if (data.userProducts.length > 0) {
            setData(data.userProducts);
            setmsisdn(data.userProducts[0].NTMsisdn);
            setEmail(data.userProducts[0].Email);
          } else {
            setData({});
          }
        })
        .catch((error: any) => {
          setAction(false);
        });
    } else {
      toast.error("Please enter valid inputs.");
    }
  };

  const handlePortInRequest = async () => {
    toast.dismiss();
    if (
      msisdn.trim().length > 9 &&
      email.trim() !== "" &&
      portIn.trim().length > 9 &&
      code.trim() !== "" &&
      product.trim() !== "" &&
      validateEmail(email.trim())
    ) {
      setOpen(true);
    } else {
      toast.error("Please enter a valid data.");
    }
  };

  const portInRequest = async () => {
    toast.dismiss();
    setActionRequest(true);
    await axiosInterceptorInstance
      .put(`/product`, {
        email: email.trim(),
        ntMsisdn: msisdn.trim(),
        portMsisdn: portIn.trim(),
        code: code.trim(),
        product: parseInt(product),
        medium: 1,
      })
      .then((res: any) => {
        setOpen(false);
        setActionRequest(false);
        const data = JSON.parse(res.data.body);
        if (data.Error && data.Errors.length > 0) {
          toast.error(data.Errors[0]);
        } else {
          if (data.portIn != null) {
            toast.success("PortIn successfully.");
          } else {
            toast.error("PortIn unsucessfully.");
          }
        }
      })
      .catch((error: any) => {
        setOpen(false);
        setActionRequest(false);
        toast.error(error.message);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div className="boxShadow">
        <h2 className="sectionTitle">PortIn</h2>
        <div className="boxInner">
          <Grid container columnSpacing={2}>
            <Grid item xs={4.5}>
              <TextField
                className="formControl"
                label="NT-MSISDN"
                variant="outlined"
                value={msisdn}
                onChange={(e) => setmsisdn(e.target.value)}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item xs={4.5}>
              <TextField
                className="formControl"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={3}>
              {!action && (
                <Button
                  onClick={handleClick}
                  className="dButton dButton2"
                  variant="contained"
                >
                  Search
                </Button>
              )}
              {action && (
                <Button className="dButton dButton2" variant="contained">
                  <CircularProgress color="inherit" size={30} />
                </Button>
              )}
            </Grid>
          </Grid>
          {(action || actionRequest) && <div className="diable-bg"></div>}
          {data.length > 1 && (
            <div className="selection-container">
              <FormControl>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  className="label"
                >
                  Available NT-MSISDN
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={msisdn}
                  name="radio-buttons-group"
                >
                  {data &&
                    data.map((item: any, index: number) => (
                      <div className="grid">
                        <FormControlLabel
                          value={item.NTMsisdn}
                          control={<Radio />}
                          label={item.NTMsisdn}
                          onChange={(e: any) => setmsisdn(e.target.value)}
                        />
                        <div><strong>Order Date:</strong> {item.OrderDate}</div>
                        <div><strong>Plan Ordered:</strong> --</div>
                      </div>
                    ))}
                </RadioGroup>
              </FormControl>
            </div>
          )}
          {data.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: "linear", duration: 0.5 }}
            >
              <Grid container columnSpacing={2}>
                <Grid item xs={12}>
                  <h3>Provide Further Details:</h3>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    className="formControl"
                    label="PortIn-MSISDN"
                    variant="outlined"
                    value={portIn}
                    onChange={(e) => setPortIn(e.target.value)}
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    className="formControl"
                    label="Code"
                    variant="outlined"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-label">
                      Product
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="anbu"
                      className="selectControl"
                      autoWidth
                      value={product}
                      defaultValue={product}
                      onChange={(e) => setProduct(e.target.value)}
                    >
                      <MenuItem value="">Choose Product</MenuItem>
                      <MenuItem value="1">THM</MenuItem>
                      <MenuItem value="2">Now</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    onClick={() => handlePortInRequest()}
                    className="dButton dButton2"
                    variant="contained"
                  >
                    PortIn
                  </Button>
                </Grid>
              </Grid>
            </motion.div>
          )}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"MSISDN PortIn Confirmation"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Would you like to PortIn selected MSISDN?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                className="dButton dButton2 dbuttonSec"
                onClick={() => setOpen(false)}
              >
                Disagree
              </Button>
              <div style={{ width: "30px" }}></div>
              {!actionRequest && (
                <Button
                  variant="contained"
                  className="dButton dButton2"
                  onClick={() => portInRequest()}
                  autoFocus
                >
                  Agree
                </Button>
              )}
              {actionRequest && (
                <Button className="dButton dButton2" variant="contained">
                  <CircularProgress color="inherit" size={30} />
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </motion.div>
  );
};

export default Portin;
