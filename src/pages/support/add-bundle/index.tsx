import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
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

const AddBundle = () => {
  const [data, setData] = useState<any>(null);
  const [accountID, setAccountID] = useState<string>("");
  const [msisdn, setmsisdn] = useState("");
  const [bundleID, setBundleID] = useState<any>("");
  const [activeBundles, setActiveBundles] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(false);
  const [actionRequest, setActionRequest] = useState(false);

  const handleGetBundles = async () => {
    setData(null);
    toast.dismiss();
    if (msisdn.trim().length > 9) {
      setAction(true);
      requestBundles();
    } else {
      toast.error("Please enter valid inputs.");
    }
  };

  const requestBundles = async () => {
    await axiosInterceptorInstance
      .get(`/bundle/bymsisdn?MSISDN=${msisdn.trim()}`)
      .then((res: any) => {
        setAction(false);
        const data = JSON.parse(res.data.body);
        setAccountID(data.AccountID);
        if (data.AccountID == null) {
          toast.error("MSISDN not found.");
        }
        if (data.userBundles != null) {
          setData(data.userBundles);
        }
        if (data.activeBundles != null) {
          setActiveBundles(data.activeBundles);
        }
      })
      .catch((error: any) => {
        setAction(false);
        toast.error(error.message);
      });
  };

  const addBundleRequest = async () => {
    toast.dismiss();
    if (bundleID === "") {
      alert("Please choose Bundle");
      return false;
    }
    setActionRequest(true);
    await axiosInterceptorInstance
      .post(`/bundle/add`, {
        msisdn: msisdn,
        packageID: bundleID,
        accountID: accountID,
      })
      .then((res: any) => {
        const data = JSON.parse(res.data.body);
        setOpen(false);
        setBundleID("");
        setActionRequest(false);
        if (data.Error) {
          toast.error(data.Errors[0]);
        } else {
          if (data.message !== "") {
            toast.success(data.message);
            requestBundles();
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
        <h2 className="sectionTitle">Add Bundle</h2>
        <div className="boxInner">
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                className="formControl"
                label="MSISDN"
                variant="outlined"
                defaultValue={msisdn}
                onChange={(e) => setmsisdn(e.target.value)}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item xs={4}>
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
          <div className="boxInner" style={{ paddingTop: "0px" }}>
            <Grid container spacing={2} height="100%">
              <Grid item xs={8}>
                <h2 style={{ fontWeight: 600, marginLeft: "-20px" }}>
                  Active Bundles
                </h2>
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                  className="dButton dbuttonSec"
                  variant="contained"
                >
                  Add Bundle
                </Button>
              </Grid>
            </Grid>
          </div>
          {data && data.length === 0 && (
            <div
              style={{
                textAlign: "center",
                fontWeight: 600,
                padding: "30px 0px",
                color: "#999",
              }}
            >
              Data Not Found
            </div>
          )}
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
                          {bundle.Name} {bundle.Price && `- £${bundle.Price}`}
                        </span>
                        <span>{bundle.Data}</span>
                      </h3>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add New Bundle"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <select
              className="ddl-menu"
              value={bundleID}
              onChange={(e: any) => {
                setBundleID(e.target.value);
              }}
            >
              <option value={""}>Choose Bundle</option>
              {activeBundles &&
                activeBundles.map((item: any, index: number) => (
                  <option key={index} value={item.ID}>
                    {item.Name} - {item.Data}
                  </option>
                ))}
            </select>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className="dButton dButton2 dbuttonSec"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <div style={{ width: "30px" }}></div>
          {!actionRequest && (
            <Button
              variant="contained"
              className="dButton dButton2"
              autoFocus
              onClick={() => addBundleRequest()}
            >
              Submit
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
  );
};

export default AddBundle;
