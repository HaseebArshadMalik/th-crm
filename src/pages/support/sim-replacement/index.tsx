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

const SimReplacement = () => {
  const [oldMSISDN, setOldMSISDN] = useState("");
  const [newMSISDN, setNewMSISDN] = useState("");
  const [open, setOpen] = useState(false);
  const [actionFind, setActionFind] = useState(false);
  const [action, setAction] = useState(false);
  const [accountID, setAccountID] = useState("");

  const handleReplaceSim = async () => {
    toast.dismiss();
    if (oldMSISDN.trim().length > 9 && newMSISDN.trim().length > 9) {
      getUserByMSISDN();
    } else {
      toast.error("Please enter valid inputs.");
    }
  };

  const getUserByMSISDN = async () => {
    setActionFind(true);
    await axiosInterceptorInstance
      .get(`/product/userbymsisdn?msisdn=${newMSISDN}`)
      .then((res: any) => {
        const data = JSON.parse(res.data.body);
        if (data.user.length > 0) {
          setAccountID(data.user[0].AccountID.trim());
          setOpen(true);
        } else {
          toast.error("New MSISDN not found");
        }
      })
      .catch((error: any) => { })
      .finally(() => {
        setActionFind(false);
      });
  };

  const replaceSimRequest = async () => {
    toast.dismiss();
    setAction(true);
    await axiosInterceptorInstance
      .post(`/product/simreplacement`, {
        oldMSISDN: oldMSISDN,
        newMSISDN: newMSISDN,
        accountID: accountID,
      })
      .then((res: any) => {
        const data = JSON.parse(res.data.body);
        if (data.Error) {
          toast.error("Error from API");
        } else {
          if (data.message !== "") {
            toast.success(data.message);
          } else {
            toast.error("Sim replacement unsucessfull.");
          }
        }
      })
      .catch((error: any) => { })
      .finally(() => {
        setAction(false);
        setOpen(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div className="boxShadow">
        <h2 className="sectionTitle">Online SIM Number Update</h2>
        <div className="boxInner">
          <Grid container spacing={2}>
            <Grid item xs={4.5}>
              <TextField
                className="formControl"
                label="Old MSISDN"
                variant="outlined"
                defaultValue={oldMSISDN}
                onChange={(e) => setOldMSISDN(e.target.value)}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item xs={4.5}>
              <TextField
                className="formControl"
                label="New MSISDN"
                variant="outlined"
                defaultValue={newMSISDN}
                onChange={(e) => setNewMSISDN(e.target.value)}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item xs={3}>
              {!actionFind && (
                <Button
                  onClick={handleReplaceSim}
                  className="dButton dButton2"
                  variant="contained"
                >
                  Replace
                </Button>
              )}
              {actionFind && (
                <Button className="dButton dButton2" variant="contained">
                  <CircularProgress color="inherit" size={30} />
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sim Replacement Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Would you like to replace sim from <strong>{oldMSISDN}</strong> to{" "}
            <strong>{newMSISDN}</strong>.
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
          {!action && (
            <Button
              variant="contained"
              className="dButton dButton2"
              onClick={() => {
                replaceSimRequest();
              }}
              autoFocus
            >
              Agree
            </Button>
          )}
          {action && (
            <Button className="dButton dButton2" variant="contained">
              <CircularProgress color="inherit" size={30} />
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default SimReplacement;
