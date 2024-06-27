import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
const DetachNumber = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState<number>(0);
    const [msisdn, setmsisdn] = useState("");
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(false);


    const handleGetBundles = async () => {
        toast.dismiss();
        if (msisdn.trim().length > 9 && product !== 0) {
            setOpen(true);
        } else {
            toast.error("Please enter valid inputs.");
        }
    };

    const detachBundle = async () => {
        setAction(true);
        await axiosInterceptorInstance
            .post(`/product/detachnumber`, {
                msisdn,
                product,
            })
            .then((res: any) => {
                setAction(false);
                const data = JSON.parse(res.data.body);
                setOpen(false);
                setmsisdn("");
                setProduct(0);
                toast.success(data.message);
            })
            .catch((error: any) => {
                setAction(false);
            });
    };
    useEffect(() => {
        if (localStorage.getItem("user")) {
            var user = JSON.parse(localStorage.getItem("user") || "");
            if (user.Email.indexOf("admin-support") !== -1) {
                navigate("/support/detach-number");
            }
            else {
                navigate("/support/portin");
            }
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "linear", duration: 0.5 }}
        >
            <div className="boxShadow">
                <h2 className="sectionTitle">Detach NUmber</h2>
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
                                <InputLabel id="demo-simple-select-label">Product</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="anbu"
                                    className="selectControl"
                                    autoWidth
                                    value={product}
                                    defaultValue={product}
                                    onChange={(e: any) => setProduct(parseInt(e.target.value))}
                                >
                                    <MenuItem value="0">Choose Product</MenuItem>
                                    <MenuItem value="1">THM</MenuItem>
                                    <MenuItem value="2">Now</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                onClick={() => handleGetBundles()}
                                className="dButton dButton2"
                                variant="contained"
                            >
                                Detach Number
                            </Button>
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
                    {"Detach Number Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Would you like to detach this MSISDN?
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
                                detachBundle();
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

export default DetachNumber;
