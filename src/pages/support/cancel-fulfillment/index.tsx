import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  FormControl,
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


const CancelFulfillment = () => {
  const [data, setData] = useState<any>(null);
  const [product, setProduct] = useState<string>("0");
  const [msisdn, setmsisdn] = useState("");
  const [cOpen, setCOpen] = useState(false);
  const [action, setAction] = useState(false);
  const [actionRequest, setActionRequest] = useState(false);

  const handleGetBundles = async () => {
    setData(null);
    toast.dismiss();
    if (msisdn.trim().length > 9 && product !== "0") {
      setAction(true);
      requestBundles();
    } else {
      toast.error("Please enter valid inputs.");
    }
  };
  const requestBundles = async () => {
    await axiosInterceptorInstance
      .get(`/bundle/fulfillment?MSISDN=${msisdn.trim()}&Product=${product}`)
      .then((res: any) => {
        setAction(false);
        const obj = JSON.parse(res.data.body);
        if (obj.Data != null) {
          setData(obj.Data);
          setCOpen(true);

        }
      })
      .catch((error: any) => {
        setAction(false);
        toast.error(error.message);
      });
  };


  const bundleUpdateRequest = async () => {
    toast.dismiss();
    setActionRequest(true);
    await axiosInterceptorInstance
      .put(`/bundle/cancelfulfillment`, {
        msisdn: data.msisdn,
        id: data.id,
        product: parseInt(product),
      })
      .then((res: any) => {
      })
      .catch((error: any) => {
        setCOpen(false);
        setActionRequest(false);
      }).finally(() => {
        setCOpen(false);
        setActionRequest(false);
        toast.success("Cancellation Successfull");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div className="boxShadow">
        <h2 className="sectionTitle">Cancel Fulfillment</h2>
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

                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"

                  className="selectControl"
                  autoWidth
                  value={product}
                  defaultValue={product}
                  onChange={(e: any) => setProduct(e.target.value)}
                >
                  <MenuItem value="0">Choose Product</MenuItem>
                  <MenuItem value="1">THM</MenuItem>
                  <MenuItem value="2">Now</MenuItem>
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
      {data && (
        <Dialog
          open={cOpen}
          onClose={() => setCOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"

        >
          <DialogTitle id="alert-dialog-title">
            {"Fulfillment Cancellation Confirmation"}
            {data.isFulfilled}
            <h3>Details</h3>
            <Grid container spacing={2} style={{ marginLeft: "0px", width: "100%", marginBottom: "20px" }}>
              <Grid item xs={12} style={{ padding: "0" }}>

                <Grid container >
                  <Grid item xs={4}>
                    <p className="titles-text " style={{ textAlign: "left" }}> Msisdn</p>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <p className="numberColumn" style={{ justifyContent: "left" }}>{data.msisdn}</p>
                  </Grid>

                  <Grid item xs={4}>
                    <p className="titles-text" style={{ textAlign: "left" }}>Email </p>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <p className="numberColumn" style={{ justifyContent: "left" }}>{data.email}</p>
                  </Grid>

                  <Grid item xs={4}>
                    <p className="titles-text" style={{ textAlign: "left" }}>Fulfilled </p>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <p className="numberColumn" style={{ justifyContent: "left" }}>{data.isFulfilled.toString()}</p>
                  </Grid>

                  <Grid item xs={4}>
                    <p className="titles-text" style={{ textAlign: "left" }}>Payment</p>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <p className="numberColumn" style={{ justifyContent: "left" }}>{data.isPaymentDone.toString()}</p>
                  </Grid>

                </Grid>

              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            {data.isPaymentDone && !data.isFulfilled ? <DialogContentText id="alert-dialog-description">
              Would you like to  cancel the fulfillment?
            </DialogContentText> :
              <DialogContentText id="alert-dialog-description">
                You can't update the fulfillment on requested MSISDN.
              </DialogContentText>}
          </DialogContent>
          {data.isPaymentDone && !data.isFulfilled ?
            <DialogActions>
              <Button
                variant="contained"
                className="dButton dButton2 dbuttonSec"
                onClick={() => setCOpen(false)}
              >
                Disagree
              </Button>
              <div style={{ width: "30px" }}></div>
              {!actionRequest && (
                <Button
                  variant="contained"
                  color="secondary"
                  className="dButton dButton2"
                  onClick={() => {

                    bundleUpdateRequest();
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
            </DialogActions> :
            <DialogActions>
              <Button
                variant="contained"
                className="dButton dButton2 dbuttonSec"
                onClick={() => setCOpen(false)}
              >
                OK
              </Button>
            </DialogActions>}
        </Dialog>
      )}
    </motion.div>


  );
};

export default CancelFulfillment;
