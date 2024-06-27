import React, { useRef, useState } from "react";
import {
    Button,
    Grid,
    TextField,
    CircularProgress,

} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { validateEmail } from "../../../utils";


const CreditSimStatus = () => {
    const [data, setData] = useState<any>(null);
    const [msisdn, setmsisdn] = useState("");
    const [email, setEmail] = useState<string>("");

    const [action, setAction] = useState<Boolean>(false);
    const agGridRef = useRef<AgGridReact | null>(null);


    const exportGridDataAsCSV = () => {
        if (agGridRef.current) {
            agGridRef.current.api.exportDataAsCsv();
        }
    };
    const columnDefs: ColDef[] = [

        {
            field: "msisdn",
            headerName: "Msisdn",
            filter: true,
            resizable: true,
            sortable: true,

        },
        {
            field: "email",
            headerName: "Email",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "Name",
            headerName: "User Name",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "ordereddate",
            headerName: "Ordered Date",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "fulfillmentdate",
            headerName: "Fulfillment Date",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "transactiontype",
            headerName: "Transaction Type",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "BundleAmount",
            headerName: "BundleAmount",
            filter: true,
            resizable: true,
            sortable: true,

        },
        {
            field: "TopupAmount",
            headerName: "TopupAmount",
            filter: true,
            resizable: true,
            sortable: true,

        },
        {
            field: "bundlename",
            headerName: "Bundle Name",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "Address",
            headerName: "Address",
            filter: true,
            resizable: true,
            sortable: true,
        },
    ];
    const handleGetBundles = async () => {
        setData(null);
        toast.dismiss();
        if (msisdn.trim().length > 9 || email.trim() !== "") {
            if (email.trim() !== "" && !validateEmail(email.trim())) {
                toast.error("Please enter valid email address");
                return false;
            }
            setAction(true);
            requestBundles();
        } else {
            toast.error("Please enter valid  input.");
        }
    };

    const requestBundles = async () => {
        await axiosInterceptorInstance
            .get(`/dashboard/CreditSimStatus?MSISDN=${msisdn.trim()}&Email=${email.trim()}`)
            .then((res: any) => {

                setAction(false);
                const apiresponse = JSON.parse(res.data.body);
                if (apiresponse.Data.length == 0) {
                    toast.error("Record not found.");
                }
                else {
                    setData(apiresponse.Data);
                    setEmail(apiresponse.Data[0].email);
                    setmsisdn(apiresponse.Data[0].msisdn != null ? apiresponse.Data[0].msisdn : "");
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
                <h2 className="sectionTitle">Credit Sim Status</h2>
                <div className="boxInner">
                    <Grid container spacing={2}>
                        <Grid item xs={4.5}>
                            <TextField
                                className="formControl"
                                label="MSISDN"
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
                                inputProps={{ maxLength: 40 }}
                            />
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <button
                    className="small-btn"
                    style={{ visibility: (data ? "visible" : "hidden") }}
                    onClick={() => {
                        if (data) {
                            exportGridDataAsCSV();
                        }
                    }}
                >
                    Export as CSV
                </button>
            </div>
            {data && (
                <div className="ag-theme-alpine">
                    <AgGridReact
                        ref={agGridRef}
                        paginationPageSize={12}
                        pagination={true}
                        domLayout="autoHeight"
                        rowData={data}
                        columnDefs={columnDefs}
                    ></AgGridReact>
                </div>
            )}

        </motion.div>
    );
};

export default CreditSimStatus;
