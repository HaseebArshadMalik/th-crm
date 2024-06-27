import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AutoTopup = () => {
  const [data, setData] = useState<any>(null);
  const [product, setProduct] = useState<string>("");
  const [msisdn, setmsisdn] = useState("");

  const [topups, setTopups] = useState<any>(null);

  const [open, setOpen] = useState(false);

  const [action, setAction] = useState(false);
  const [actionRequest, setActionRequest] = useState(false);

  const handleGetBundles = async () => {
    setData(null);
    toast.dismiss();
    if (msisdn.trim().length > 9 && product !== "") {
      setAction(true);
      requestTopups();
    } else {
      toast.error("Please enter valid inputs.");
    }
  };

  const requestTopups = async () => {
    await axiosInterceptorInstance
      .get(`/topup/list?MSISDN=${msisdn.trim()}&Product=${product}`)
      .then((res: any) => {
        setAction(false);
        const data = JSON.parse(res.data.body);
        if (data.topups != null) {
          setData(data.topups);
        }
      })
      .catch((error: any) => {
        setAction(false);
      });
  };

  const TopupUpdateRequest = async (bundle: any) => {
    toast.dismiss();
    setActionRequest(true);
    await axiosInterceptorInstance
      .put(`/topup/autotopup`, {
        id: topups.ID,
        isAutoTopup: !topups.IsAutoTopup,
        product: parseInt(product),
      })
      .then((res: any) => {
        setOpen(false);
        setActionRequest(false);
        const data = JSON.parse(res.data.body);
        if (data.Error) {
          toast.error("Error from API");
        } else {
          if (data.message !== "") {
            toast.success(data.message);
            requestTopups();
          } else {
            toast.error("AutoTopup updation unsucessfull.");
          }
        }
      })
      .catch((error: any) => {
        setOpen(false);
        setActionRequest(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div className="boxShadow">
        <h2 className="sectionTitle">Auto Topup</h2>
        <div className="boxInner">
          <Grid container spacing={2}>
            <Grid item xs={4.5}>
              <TextField
                className="formControl"
                label="MSISDN"
                variant="outlined"
                defaultValue={msisdn}
                onChange={(e) => setmsisdn(e.target.value)}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item xs={4.5}>
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label" style={{ background: "#fff", padding: " 0 5px 0px 0px" }}>Product</InputLabel>
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
                  <MenuItem value="3">THA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              {!action && (
                <Button
                  onClick={handleGetBundles}
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
        </div>
      </div>
      {(action || actionRequest) && <div className="diable-bg"></div>}
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        >
          <Grid container spacing={2} height="100%">
            {data.map((topup: any, index: number) => {
              return (
                <Grid key={index} item md={6} lg={4} height="100%">
                  <div className="boxShadow m0 box">
                    <div className="boxInner">
                      <h3
                        className="m0 mb10"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Price: £{topup.Amount}</span>
                        <span>Threshold: £{topup.TheresholdAmount}</span>
                      </h3>
                      <div className="btnGroup">
                        <Button
                          onClick={() => {
                            setOpen(true);
                            setTopups(topup);
                          }}
                          className="dButton dButton2"
                          variant="contained"
                        >
                          {topup.IsAutoTopup ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>
      )}
      {topups && (
        <motion.div
          initial={{ y: -1000 }}
          animate={{ y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        >
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"AutoTopup Confirmation"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Would you like to update the autotopup?
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
                  onClick={() => {
                    const objBundle = topups;
                    objBundle.IsRenew = !topups.IsAutoTopup;
                    TopupUpdateRequest(objBundle);
                  }}
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
        </motion.div>
      )}
    </motion.div>
  );
};

export default AutoTopup;
