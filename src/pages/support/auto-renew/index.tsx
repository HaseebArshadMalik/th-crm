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
import { FaPaypal, FaRegCreditCard } from "react-icons/fa";
import { motion } from "framer-motion";

const AutoRenew = () => {
  const [data, setData] = useState<any>(null);
  const [product, setProduct] = useState<string>("");
  const [msisdn, setmsisdn] = useState("");

  const [bundle, setBundle] = useState<any>(null);

  const [open, setOpen] = useState(false);
  const [cOpen, setCOpen] = useState(false);

  const [action, setAction] = useState(false);
  const [actionRequest, setActionRequest] = useState(false);

  const handleGetBundles = async () => {
    setData(null);
    toast.dismiss();
    if (msisdn.trim().length > 9 && product !== "") {
      setAction(true);
      requestBundles();
    } else {
      toast.error("Please enter valid inputs.");
    }
  };

  const requestBundles = async () => {
    await axiosInterceptorInstance
      .get(`/bundle/list?MSISDN=${msisdn.trim()}&Product=${product}`)
      .then((res: any) => {
        setAction(false);
        const data = JSON.parse(res.data.body);
        if (data.bundles !== null) {
          setData(data.bundles);
        }
      })
      .catch((error: any) => {
        setAction(false);
        toast.error(error.message);
      });
  };

  const bundleUpdateRequest = async (
    bundle: any,
    isCancel: boolean = false
  ) => {
    toast.dismiss();
    setActionRequest(true);
    await axiosInterceptorInstance
      .put(`/bundle/autorenewal`, {
        msisdn: msisdn,
        bundleID: bundle.BundleID,
        isRenew: bundle.IsRenew,
        isActive: bundle.IsActive,
        product: parseInt(product),
      })
      .then((res: any) => {
        if ((isCancel && bundle.PaymentMethod !== "Paypal") || !isCancel) {
          setOpen(false);
          setCOpen(false);
          setActionRequest(false);
        }
        
        const data = JSON.parse(res.data.body);
        if (data.Error) {
          toast.error("Error from API");
        } else {
          if (data.message !== "") {
            if (bundle.PaymentMethod === "Paypal" && isCancel) {
              setActionRequest(true);
              unsubPaypal(bundle);
            } else {
              toast.success(data.message);
              requestBundles();
            }
          } else {
            toast.error("Bundle updation unsucessfull.");
          }
        }
      })
      .catch((error: any) => {
        setOpen(false);
        setCOpen(false);
        setActionRequest(false);
      });
  };

  const unsubPaypal = async (bundle: any) => {
    await axiosInterceptorInstance
      .post("/bundle/paypal/unsubscribe", {
        subscriptionId: bundle.TransactionID,
      })
      .then((res: any) => {
        setOpen(false);
        setCOpen(false);
        setActionRequest(false);
        const data = JSON.parse(res.data.body);
        if (data.Error) {
          toast.error("Error from API");
        } else {
          if (data.status !== null || data.portIn) {
            toast.success("Bundle updated successfully.");
            requestBundles();
          } else {
            toast.error("Bundle updation unsucessfull.");
          }
        }
      })
      .catch((error: any) => {
        setOpen(false);
        setCOpen(false);
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
        <h2 className="sectionTitle">Bundle Auto Renewal and Cancellation</h2>
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

            {data.map((bundle: any, index: number) => {
              return (
                <Grid key={index} item md={6} lg={4} height="100%">
                  <div className="boxShadow m0">
                    <div className="boxInner">
                      <h3
                        className="m0 mb10"
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          {bundle.Name} - £{bundle.Price}
                        </span>
                        {bundle.PaymentMethod === "Card" && (
                          <span>
                            <FaRegCreditCard
                              style={{ marginTop: "2px" }}
                              size={22}
                            />
                          </span>
                        )}
                        {bundle.PaymentMethod === "Paypal" && (
                          <span>
                            <FaPaypal style={{ marginTop: "2px" }} size={22} />
                          </span>
                        )}
                      </h3>

                      <div className="btnGroup">
                        <Button
                          onClick={() => {
                            setOpen(true);
                            setBundle(bundle);
                          }}
                          className="dButton dButton2"
                          variant="contained"
                        >
                          {bundle.IsRenew ? "Disable" : "Enable"}
                        </Button>
                        {bundle.TransactionID && (
                          <Button
                            className="dButton dButton2"
                            onClick={() => {
                              setCOpen(true);
                              setBundle(bundle);
                            }}
                            variant="contained"
                          >
                            Cancel
                          </Button>
                        )}
                        {!bundle.TransactionID && (
                          <Button
                            className="dButton dButton2"
                            disabled
                            variant="contained"
                            title="Unable to cancel this bundle"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>
      )}
      {bundle && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Bundle Renewal Confirmation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Would you like to {bundle.IsRenew ? "disable" : "enable"} the auto
              renewal of this bundle?
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
                  const objBundle = bundle;
                  objBundle.IsRenew = !bundle.IsRenew;
                  bundleUpdateRequest(objBundle, true);
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
      )}
      {bundle && (
        <Dialog
          open={cOpen}
          onClose={() => setCOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Bundle Cancellation Confirmation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Would you like to {bundle.IsActive ? "cancel" : "enable"} the
              selected bundle?
            </DialogContentText>
          </DialogContent>
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
                  const objBundle = bundle;
                  objBundle.IsActive = !bundle.IsActive;
                  bundleUpdateRequest(objBundle, true);
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
      )}
    </motion.div>
  );
};

export default AutoRenew;
