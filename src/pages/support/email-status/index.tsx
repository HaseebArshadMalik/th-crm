import React, { useState } from "react";
import {
    Button,
    Grid,
    TextField,
    CircularProgress,

} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const EmailStatus = () => {
    const [data, setData] = useState<any>(null);
    const [email, setEmail] = useState<string>("");
    const [action, setAction] = useState<Boolean>(false);

    const handleGetBundles = async () => {
        setData(null);
        toast.dismiss();
        if (email.trim() !== "") {
            setAction(true);
            requestBundles();
        } else {
            toast.error("Please enter valid email.");
        }
    };

    const requestBundles = async () => {
        await axiosInterceptorInstance
            .get(`/product/EmailStatus?Email=${email.trim()}`)
            .then((res: any) => {
                
                setAction(false);
                const apiresponse = JSON.parse(res.data.body);
                if (apiresponse === null) {
                    toast.error("Status not found.");
                }
                else if (apiresponse.data && apiresponse.data.ResponseBody) {
                    const simStatusObj = JSON.parse(apiresponse.data.ResponseBody)
                    setData(simStatusObj);
                }
            })
            .catch((error: any) => {
                setAction(false);
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
                <h2 className="sectionTitle">Email Status</h2>
                <div className="boxInner">
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
                                className="formControl"
                                label="Email"
                                variant="outlined"
                                defaultValue={email}
                                onChange={(e) => setEmail(e.target.value)}
                                inputProps={{ maxLength: 200 }}
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


            {data !== null && (
                <div className="boxShadow" style={{ padding: "20px" }}>
                    <table className="customTable">
                        <thead>
                            <tr>
                                <th >
                                    Email Address
                                </th>
                                <th >
                                    Status
                                </th>
                                <th >
                                    Sub Status
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textTransform: "uppercase" }} >{data.address}</td>
                                <td style={{ textTransform: "uppercase" }}>{data.status}</td>
                                <td style={{ textTransform: "uppercase" }} >{data.sub_status}</td>
                            </tr>
                        </tbody>
                    </table>


                </div>

            )}




        </motion.div>
    );
};

export default EmailStatus;
